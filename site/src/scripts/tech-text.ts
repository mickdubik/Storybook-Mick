// @ts-nocheck
// TechText, ported from React Bits (`TechText-JS-CSS`, https://reactbits.dev) to plain DOM for the home hero name
// (owner, 2026-11-10). Same drawing: letters turn into dashed vector outlines under the cursor, a selection frame with
// specks and size label, typographic guide lines, a typed intro and a spring kick on click.
// Changes from the original, for this site:
// - Placement: draws the host's own text at the host's own font, size, tracking and baseline (no auto-fit, no centring),
//   so the canvas sits exactly where the HTML name sits. The host text is hidden only while the canvas is in charge.
// - Pointer events come from a shared `target` (the h1); the canvas itself never takes pointer events.
// - `introDelay` (seconds) so two lines can type one after the other. No idle sweep (motion must stop by itself).
// - Labels use the site's mono font. Canvas `letterSpacing` is required; without it the HTML text stays.

const LABEL_FONT = '12px "Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace';
// Labels (owner, 2026-11-10: "hard to read"): 12px, the line's own colour at full strength, on a chip of the hero
// background so guide lines and letters never run through them.
const CHIP_X = 4, CHIP_H = 16;
const SPRING = 320;
const INTRO_DELAY = 0.15;
const KICK_DECAY = 0.62;
const HIT_Y = 12; // vertical tolerance around a word (the two name lines sit close together)

const approach = (current, target, dt, seconds) => current + (target - current) * (1 - Math.exp(-dt / seconds));
const clamp01 = (v) => Math.min(1, Math.max(0, Number(v) || 0));
const smoothstep = (e0, e1, v) => { const t = clamp01((v - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
const noise = (...values) => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};
const signed = (v) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0");

export const canTechText = () => {
  const c = document.createElement("canvas").getContext("2d");
  return !!c && "letterSpacing" in c && "ResizeObserver" in window && "IntersectionObserver" in window;
};

/**
 * host: the element whose text is drawn (a block-level line of the name).
 * container: absolutely positioned box around the host (larger by pad on each side) holding the canvas.
 * target: element that receives pointer events (shared by several instances).
 */
export function createTechText({ host, container, target, pad, onCursor, options }) {
  const s = {
    dashLength: 2, dashGap: 2, strokeWidth: 1, lineStyle: "dashed", reveal: "letter", specks: 24,
    selection: true, labels: true, bounce: 0.5, speed: 1, clickKick: true, intro: "type",
    introDuration: 1, introDelay: 0, guides: true, background: () => "transparent", ...options,
  };
  const canvas = document.createElement("canvas");
  canvas.className = "tech-text-canvas";
  container.append(canvas);
  const ctx = canvas.getContext("2d");
  const scratch = document.createElement("canvas");
  const scratchCtx = scratch.getContext("2d");

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 1, height = 1, dpr = 1, raf = 0, last = performance.now();
  let themeUntil = 0, lastInk = "", visible = false, alive = true, layoutKey = "", sizeDirty = true, word = null, glyphs = [];
  let pulse = 0, introClock = 0, introducing = false, fontsReady = !document.fonts, guideAlpha = 0;
  let introDone = s.intro === "none" || reducedMotion;
  const kicks = [];
  const press = { x: 0, y: 0, time: 0, index: -1 };
  const pointer = { x: 0, y: 0, inside: false };
  const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

  // Typography is read from the host every layout, so a resize or breakpoint change follows the CSS.
  const typo = () => {
    const cs = getComputedStyle(host);
    const size = parseFloat(cs.fontSize);
    const raw = host.textContent.trim();
    return {
      text: cs.textTransform === "uppercase" ? raw.toUpperCase() : raw,
      family: cs.fontFamily, weight: cs.fontWeight, size,
      tracking: cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing),
      indent: parseFloat(cs.paddingLeft) || 0,
      lineBox: host.clientHeight,
      ink: cs.color,
    };
  };
  const setFont = (c, t) => {
    c.font = `${t.weight} ${t.size}px ${t.family}`;
    c.letterSpacing = `${t.tracking}px`;
    c.textAlign = "left";
    c.textBaseline = "alphabetic";
  };

  const sprite = (t, view, glyph, stroke) => {
    const p = Math.ceil(s.strokeWidth * 2 + 4);
    const left = glyph.box.x1 - p, top = glyph.box.y1 - p;
    const w = glyph.box.x2 - glyph.box.x1 + p * 2, h = glyph.box.y2 - glyph.box.y1 + p * 2;
    const image = document.createElement("canvas");
    image.width = Math.max(1, Math.ceil(w * dpr));
    image.height = Math.max(1, Math.ceil(h * dpr));
    const c = image.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
    setFont(c, t);
    if (stroke) {
      c.lineJoin = "round";
      c.lineWidth = s.strokeWidth * 2;
      c.lineCap = "butt";
      c.strokeStyle = t.ink;
      if (s.lineStyle !== "solid") c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
      c.strokeText(glyph.char, glyph.x, view.baseline);
      c.setLineDash([]);
      c.globalCompositeOperation = "destination-out";
      c.fillStyle = "#000";
      c.fillText(glyph.char, glyph.x, view.baseline);
      c.globalCompositeOperation = "source-over";
    } else {
      c.fillStyle = t.ink;
      c.fillText(glyph.char, glyph.x, view.baseline);
    }
    return { image, left, top };
  };

  const ensureLayout = (t) => {
    const key = [t.text, t.family, t.weight, t.size, t.tracking, t.indent, t.lineBox, t.ink, width, height, dpr].join("|");
    if (key === layoutKey && word) return word;
    layoutKey = key;
    const probe = scratchCtx;
    setFont(probe, t);
    const m = probe.measureText(t.text);
    // The baseline CSS uses: the content area (font ascent + descent) centred in the line box, half-leading either side.
    const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
    const baseline = pad.top + (t.lineBox - (asc + desc)) / 2 + asc;
    const x = pad.left + t.indent;
    const xHeight = baseline - probe.measureText("x").actualBoundingBoxAscent;
    const capHeight = baseline - probe.measureText("H").actualBoundingBoxAscent;
    const descender = baseline + probe.measureText("p").actualBoundingBoxDescent;
    word = {
      size: t.size, baseline,
      left: x - m.actualBoundingBoxLeft, right: x + m.actualBoundingBoxRight,
      top: baseline - m.actualBoundingBoxAscent, bottom: baseline + m.actualBoundingBoxDescent,
      // an all-caps name has no descenders, so that guide (whose label also sat on the next line) is left out
      lines: [
        { y: baseline, label: "baseline" },
        { y: xHeight, label: "x-height" },
        { y: capHeight, label: "cap height" },
        ...(/[a-z]/.test(t.text) ? [{ y: descender, label: "descender" }] : []),
      ],
    };
    const previous = glyphs;
    glyphs = [];
    let prefix = "";
    Array.from(t.text).forEach((char, i) => {
      prefix += char;
      const own = probe.measureText(char);
      // advance of the prefix minus this glyph (tracking is included in both, so it cancels to the glyph origin)
      const gx = x + probe.measureText(prefix).width - own.width;
      if (!char.trim()) return;
      const base = {
        char, x: gx,
        box: { x1: gx - own.actualBoundingBoxLeft, y1: baseline - own.actualBoundingBoxAscent, x2: gx + own.actualBoundingBoxRight, y2: baseline + own.actualBoundingBoxDescent },
      };
      const kept = previous[glyphs.length];
      const same = kept?.char === char && kept.index === i;
      glyphs.push({
        ...base,
        offset: same ? kept.offset : { x: 0, y: 0 },
        velocity: same ? kept.velocity : { x: 0, y: 0 },
        outline: same ? kept.outline : 0,
        shown: same ? kept.shown : introDone ? 1 : 0,
        index: i,
        fill: sprite(t, word, base, false),
        dashes: sprite(t, word, base, true),
      });
    });
    if (frame.index >= 0 && glyphs[frame.index]?.char !== previous[frame.index]?.char) frame.index = -1;
    return word;
  };

  const glyphAt = (x, y) => {
    if (!word || y < word.top - HIT_Y || y > word.bottom + HIT_Y) return -1;
    let best = -1, bestD = Infinity;
    glyphs.forEach((g, i) => {
      const x1 = g.box.x1 + g.offset.x, x2 = g.box.x2 + g.offset.x;
      const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
      if (d < bestD) { bestD = d; best = i; }
    });
    return bestD < 28 ? best : -1;
  };

  const blit = (target2, art, dx, dy, ox, oy) => {
    target2.drawImage(art.image, Math.round((art.left + dx) * dpr - ox), Math.round((art.top + dy) * dpr - oy));
  };
  const crisp = (v) => (Math.round(v * dpr) + 0.5) / dpr;
  // text on a chip of the background colour; align: "left" | "right"; y is the text's vertical middle
  const chipText = (text, x, y, align, color, alpha) => {
    ctx.font = LABEL_FONT;
    ctx.letterSpacing = "0px";
    const w = ctx.measureText(text).width;
    const left = align === "right" ? x - w : x;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = s.background();
    ctx.fillRect(Math.round(left - CHIP_X), Math.round(y - CHIP_H / 2), Math.ceil(w + CHIP_X * 2), CHIP_H);
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, Math.round(left), Math.round(y));
  };
  const perimeterPoint = (distance, w, h) => {
    let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
    if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
    d -= w;
    if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
    d -= h;
    if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
    d -= w;
    return [frame.x1, frame.y2 - d, -1, 0];
  };

  const drawSpecks = (a, accent) => {
    const w = frame.x2 - frame.x1, h = frame.y2 - frame.y1;
    if (w < 2 || h < 2) return;
    const perimeter = 2 * (w + h), seed = frame.index + 1, grid = 3;
    ctx.fillStyle = accent;
    ctx.strokeStyle = accent;
    for (let k = 0; k < s.specks; k++) {
      const period = 0.5 + noise(seed, k, 11) * 1.2;
      const t = pulse / period + noise(seed, k, 17);
      const cycle = Math.floor(t), life = t - cycle;
      if (life > 0.7) continue;
      const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
      const pick = noise(seed, k, cycle, 2);
      const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
      const large = size >= 8;
      const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
      const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
      const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
      const tone = noise(seed, k, cycle, 3);
      const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
      ctx.globalAlpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
      const left = Math.round(x - size / 2), top = Math.round(y - size / 2);
      if (tone < 0.26 || (large && tone < 0.78)) {
        ctx.strokeRect(left + 0.5, top + 0.5, size, size);
        if (large && tone > 0.5) ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      } else ctx.fillRect(left, top, size, size);
    }
    for (let j = 0; j < 2; j++) {
      const head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
      for (let i = 0; i < 4; i++) {
        const [x, y] = perimeterPoint(head - i * 6, w, h);
        const size = i === 0 ? 3 : 2;
        ctx.globalAlpha = a * [0.95, 0.55, 0.32, 0.16][i];
        ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
      }
    }
    ctx.globalAlpha = 1;
  };

  const drawFrame = (accent) => {
    const glyph = glyphs[frame.index];
    if (!glyph || frame.alpha < 0.01) return;
    const a = frame.alpha;
    const x1 = crisp(frame.x1), y1 = crisp(frame.y1), x2 = crisp(frame.x2), y2 = crisp(frame.y2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = accent;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
    if (moved > 1) {
      const hx = (glyph.box.x1 + glyph.box.x2) / 2, hy = (glyph.box.y1 + glyph.box.y2) / 2;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
      ctx.setLineDash([3, 4]);
      ctx.globalAlpha = 0.45 * a;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
      ctx.globalAlpha = 0.7 * a;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.globalAlpha = 0.5 * a;
    ctx.stroke();
    ctx.beginPath();
    for (const [cx, cy] of [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]) ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
    ctx.globalAlpha = 0.95 * a;
    ctx.fill();
    ctx.globalAlpha = 1;
    if (s.specks > 0) drawSpecks(a, accent);
    if (!s.labels) return;
    const label = moved > 1
      ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
      : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
    chipText(label, frame.x1, frame.y1 - 7 - CHIP_H / 2, "left", accent, a);
    ctx.globalAlpha = 1;
  };

  const drawLines = (view, accent, alpha, labelAlpha) => {
    const p = Math.max(12, view.size * 0.12);
    const x1 = Math.round(view.left - p), x2 = Math.round(view.right + p);
    const room = width - x2 > 96;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = accent;
    ctx.fillStyle = accent;
    ctx.lineWidth = 1;
    ctx.font = LABEL_FONT;
    ctx.letterSpacing = "0px";
    ctx.textBaseline = "middle";
    ctx.textAlign = room ? "left" : "right";
    view.lines.forEach((line) => {
      const y = crisp(line.y);
      ctx.globalAlpha = alpha * 0.4;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillRect(x1 - 1, Math.round(line.y) - 1, 3, 3);
      ctx.fillRect(x2 - 1, Math.round(line.y) - 1, 3, 3);
      if (s.labels) chipText(line.label, room ? x2 + 8 : x1 - 8, line.y, room ? "left" : "right", accent, labelAlpha);
    });
    ctx.textAlign = "left";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  };

  const kick = (index) => {
    const strength = (word ? word.size : 120) * 11;
    kicks.push({ index, at: pulse, velocity: strength });
    for (let d = 1; d < glyphs.length; d++) {
      const velocity = strength * Math.pow(KICK_DECAY, d);
      if (velocity < 30) break;
      for (const j of [index - d, index + d]) if (j >= 0 && j < glyphs.length) kicks.push({ index: j, at: pulse + d * 0.055, velocity });
    }
    wake();
  };

  const tick = (now) => {
    raf = 0;
    if (sizeDirty) {
      sizeDirty = false;
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(devicePixelRatio || 1, 2);
      const pw = Math.round(width * dpr), ph = Math.round(height * dpr);
      if (canvas.width !== pw) canvas.width = pw;
      if (canvas.height !== ph) canvas.height = ph;
    }
    const realDt = Math.max(0, (now - last) / 1000);
    const dt = Math.min(0.05, Math.max(0.001, realDt));
    last = now;
    const t = typo();
    // While the colour is still changing (a theme fade), keep drawing until it has held still for 150 ms.
    if (t.ink !== lastInk) { lastInk = t.ink; themeUntil = performance.now() + 150; }
    const accent = t.ink;
    const view = ensureLayout(t);
    const damping = 2 * Math.sqrt(SPRING) * (1 - clamp01(s.bounce) * 0.96);

    const introOn = !introDone && glyphs.length > 0;
    // the intro runs on real time (capped per frame), so a slow device still finishes it in about the set duration
    if (introOn && fontsReady) introClock += Math.min(0.5, realDt);
    const progress = introOn ? clamp01((introClock - INTRO_DELAY - s.introDelay) / Math.max(0.3, s.introDuration)) : 1;
    introducing = introOn && progress < 1;
    if (introOn && progress >= 1) introDone = true;
    pulse += dt;

    const active = !introducing && pointer.inside;

    for (let k = kicks.length - 1; k >= 0; k--) {
      if (kicks[k].at > pulse) continue;
      const g = glyphs[kicks[k].index];
      if (g) g.velocity.y -= kicks[k].velocity;
      kicks.splice(k, 1);
    }

    let moving = false;
    glyphs.forEach((g) => {
      const { offset, velocity } = g;
      if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05 && Math.hypot(velocity.x, velocity.y) < 0.5) {
        offset.x = offset.y = velocity.x = velocity.y = 0;
        return;
      }
      velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
      velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
      offset.x += velocity.x * dt;
      offset.y += velocity.y * dt;
      moving = true;
    });

    // typed intro: letters appear one by one; the ones still to come wait as dashed outlines
    let typing = -1;
    if (introducing) {
      const step = 0.86 / glyphs.length;
      const at = Math.min(glyphs.length - 1, Math.floor(Math.max(0, progress) / step));
      const started = introClock > INTRO_DELAY + s.introDelay;
      typing = started && progress < 0.93 ? at : -1;
      glyphs.forEach((g, i) => { g.shown = !started ? 0 : i < at ? 1 : i === at ? smoothstep(0, step * 0.3, progress - i * step) : 0; });
    } else glyphs.forEach((g) => (g.shown = 1));

    const focus = introducing ? typing : active ? glyphAt(pointer.x, pointer.y) : -1;
    if (focus >= 0 && s.selection) {
      const g = glyphs[focus];
      const bx1 = g.box.x1 + g.offset.x - 6, by1 = g.box.y1 + g.offset.y - 6, bx2 = g.box.x2 + g.offset.x + 6, by2 = g.box.y2 + g.offset.y + 6;
      if (frame.index < 0 || frame.alpha < 0.02) { frame.x1 = bx1; frame.y1 = by1; frame.x2 = bx2; frame.y2 = by2; }
      frame.x1 = approach(frame.x1, bx1, dt, 0.08);
      frame.y1 = approach(frame.y1, by1, dt, 0.08);
      frame.x2 = approach(frame.x2, bx2, dt, 0.08);
      frame.y2 = approach(frame.y2, by2, dt, 0.08);
      frame.index = focus;
    }
    frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);

    glyphs.forEach((g, i) => {
      const target2 = introducing ? (typing >= 0 && i >= typing ? 1 : 0) : s.reveal === "letter" && i === focus ? 1 : 0;
      if (introducing && g.shown === 0) g.outline = target2;
      g.outline = approach(g.outline, target2, dt, 0.09);
      if (Math.abs(g.outline - target2) > 0.002) moving = true;
      else g.outline = target2;
    });

    guideAlpha = approach(guideAlpha, s.guides && !introducing && focus >= 0 ? 1 : 0, dt, 0.14);
    onCursor(!introducing && focus >= 0 && pointer.inside && s.clickKick ? "pointer" : "");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const g of glyphs) {
      const moved = Math.hypot(g.offset.x, g.offset.y);
      if (moved > 1) {
        ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
        blit(ctx, g.dashes, 0, 0, 0, 0);
        ctx.globalAlpha = 1;
      }
    }
    if (guideAlpha > 0.005) drawLines(view, accent, guideAlpha * 0.6, guideAlpha);
    glyphs.forEach((g) => {
      if (g.shown < 0.001) return;
      if (g.outline < 0.999) {
        ctx.globalAlpha = (1 - g.outline) * g.shown;
        blit(ctx, g.fill, g.offset.x, g.offset.y, 0, 0);
      }
      if (g.outline > 0.001) {
        ctx.globalAlpha = g.outline * g.shown;
        blit(ctx, g.dashes, g.offset.x, g.offset.y, 0, 0);
      }
      ctx.globalAlpha = 1;
    });
    drawFrame(accent);

    const settling = moving || introducing || !introDone || kicks.length > 0 || (guideAlpha > 0.005 && guideAlpha < 0.995) || (frame.alpha > 0.01 && frame.alpha < 0.99) || performance.now() < themeUntil;
    if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (raf || !visible || !alive) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const locate = (e) => {
    const r = container.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    return pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
  };
  const onMove = (e) => { pointer.inside = locate(e); wake(); };
  const onLeave = () => { pointer.inside = false; wake(); };
  const onDown = (e) => {
    pointer.inside = locate(e);
    const primary = e.pointerType !== "mouse" || e.button === 0;
    press.x = pointer.x; press.y = pointer.y; press.time = performance.now();
    press.index = introducing || !primary || !pointer.inside ? -1 : glyphAt(pointer.x, pointer.y);
    wake();
  };
  const onUp = (e) => {
    if (e.type === "pointerup" && press.index >= 0 && s.clickKick && !reducedMotion && performance.now() - press.time < 450) {
      locate(e);
      if (Math.hypot(pointer.x - press.x, pointer.y - press.y) < 6) kick(press.index);
    }
    press.index = -1;
    wake();
  };
  target.addEventListener("pointermove", onMove, { passive: true });
  target.addEventListener("pointerenter", onMove, { passive: true });
  target.addEventListener("pointerdown", onDown, { passive: true });
  target.addEventListener("pointerup", onUp, { passive: true });
  target.addEventListener("pointercancel", onUp, { passive: true });
  target.addEventListener("pointerleave", onLeave, { passive: true });

  const resize = () => { sizeDirty = true; wake(); };
  new ResizeObserver(resize).observe(container);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); }).observe(container);
  // The theme toggle fades colours for about 200 ms. Keep drawing for 320 ms so the canvas reads the same fading colour
  // as the page, frame by frame, instead of drawing the old colour and then jumping. One last draw at 340 ms makes sure
  // the final colour lands even if frames were dropped.
  const themeObserver = new MutationObserver(() => { themeUntil = performance.now() + 320; wake(); window.setTimeout(wake, 340); });
  // The fade can start late on a busy page, so also follow the host's own colour transition: draw while it runs, and
  // once more when it ends, which is the moment the final colour can be read.
  const onFade = (e) => { if (e.propertyName === "color" || e.propertyName === "-webkit-text-fill-color") { themeUntil = performance.now() + 320; wake(); } };
  host.addEventListener("transitionrun", onFade);
  host.addEventListener("transitionend", onFade);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", wake);
  document.fonts?.ready.then(() => { fontsReady = true; layoutKey = ""; wake(); });
  resize();
}
