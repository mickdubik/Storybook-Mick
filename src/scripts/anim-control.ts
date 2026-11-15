// One pause / play / replay control for every animation on the site (owner, 2026-11-12).
// The button comes from Replay.astro with `pausable`. It shows pause while the animation plays, play while it is
// paused, and replay once it has run to the end. This file holds the labels and the click behaviour, so every
// animation behaves the same; each animation only says how to pause, resume and restart itself.
export type CtlState = "playing" | "paused" | "done";

const LABEL: Record<CtlState, string> = { playing: "Pause", paused: "Play", done: "Replay" };

export function setCtl(btn: HTMLElement, state: CtlState): void {
  btn.dataset.state = state;
  btn.setAttribute("aria-label", `${LABEL[state]} ${btn.dataset.label ?? ""}`.trim());
  const hint = btn.querySelector(".replay__hint");
  if (hint) hint.textContent = LABEL[state];
}

export function bindCtl(
  btn: HTMLElement | null | undefined,
  actions: { pause: () => void; resume: () => void; restart: () => void },
  initial: CtlState = "playing",
): { set: (s: CtlState) => void } {
  if (!btn) return { set: () => {} };
  setCtl(btn, initial);
  btn.addEventListener("click", () => {
    const s = btn.dataset.state as CtlState;
    if (s === "playing") { actions.pause(); setCtl(btn, "paused"); }
    else if (s === "paused") { actions.resume(); setCtl(btn, "playing"); }
    else { actions.restart(); setCtl(btn, "playing"); }
  });
  return { set: (s) => setCtl(btn, s) };
}
