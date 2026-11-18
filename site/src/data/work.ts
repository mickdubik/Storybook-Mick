// Case studies. SOURCE: the owner's live case studies on https://mickdubik.webflow.io/cs/*
// (fetched 2026-09-29), condensed but not invented. Headline figures match PRODUCT.md.
// Where the live page has nothing for a section, that section is omitted for that case.
//
// Images: every still is self-hosted in src/assets/work/ (round 7; fetched from the owner's Webflow CDN with the
// owner's approval, edges normalised by scripts/prepare-case-images.py) and rendered by components/Shot.astro.
// `src` below keeps the original CDN URL as the record of the source and as the key into
// src/assets/work/manifest.json. `w`/`h` are the original sizes; Shot uses the trimmed asset's own size.
// GIFs stay remote (click to play).

const CDN = "https://cdn.prod.website-files.com/661867028444ce38e1184ac0";

export type MetricKind = "percent" | "share" | "score" | "multiple" | "months" | "plain";

export interface Metric {
  value: string; // "+23", "−64", "78.3", "Top 3"
  unit: string; // "%", "×", " mo", ""
  label: string;
  kind: MetricKind;
  magnitude?: number;
  direction?: "up" | "down";
  qualifier?: string;
  benchmark?: { value: number; label: string }; // for "score"
}

export interface Img {
  src: string;
  alt: string;
  w: number;
  h: number;
  caption?: string;
}

export type Block =
  | { t: "statement"; text: string }
  | { t: "prose"; paras: string[] }
  | { t: "list"; items: string[]; label?: string }
  | { t: "lists"; groups: { label: string; intro?: string; items: string[] }[] }
  // `viz: "bars"` draws a bar for each percentage and a row of dots for each "X of Y" (decorative; the figure stays as text).
  | { t: "stats"; items: { value: string; label: string }[]; label?: string; viz?: "bars"; lead?: string[]; stack?: boolean }
  | { t: "personas"; items: { name: string; desc: string; jtbd: string }[] }
  | { t: "cards"; items: { title: string; body: string }[]; label?: string; numbered?: boolean }
  // `verdict` renders only when present; `reason` only when the owner has given one. Never fill these in without the owner.
  | { t: "hypotheses"; items: { area: string; context: string; belief: string; tradeoffs: string[]; img?: Img; verdict?: { status: "Shipped" | "Parked" | "Dropped"; reason?: string } }[] }
  | { t: "beforeAfter"; rows: { label: string; before: number; after: number; unit: string; better: "up" | "down" }[] }
  | { t: "quotes"; items: string[]; label?: string }
  | { t: "image"; img: Img }
  // `compare` turns a two-image gallery (before, after) into a drag-to-compare slider; the plain gallery stays as the no-script fallback.
  | { t: "gallery"; imgs: Img[]; compare?: boolean; wide?: boolean }
  | { t: "tags"; items: string[]; label?: string }
  // `lead`: the first N results are shown as large tiles above the table of the rest.
  | { t: "results"; items: Metric[]; lead?: number }
  | { t: "plate"; variant: "traffic" | "tokens" | "portal" | "care"; title: string; caption: string; note?: string }
  // The full (looping) case animation, placed inside a chapter. The case then no longer shows it as the page cover.
  | { t: "demo"; demo: "smartTraffic" | "docPortal" | "doctorOnline"; caption?: string }
  | { t: "buttonStates"; title: string; caption: string; note?: string }
  // One token followed from the component down to the core value (live text, not SVG). `swatch` draws the resolved colour.
  | { t: "tokenChain"; label?: string; steps: { kind: string; name: string; hint: string; swatch?: string }[]; note: string }
  // A decision laid out as the options considered; `chosen` marks the one taken. Owner's words only.
  | { t: "decision"; label?: string; lead: string; options: { tag: string; title: string; body?: string; points?: string[]; chosen?: boolean }[] };

export interface Chapter {
  id: string;
  title: string;
  blocks: Block[];
}

// The 90-second read: problem → my call → outcome. Built only from sentences on the live case page
// (and owner-confirmed figures). Rejected alternatives and "who had to be convinced" are TODO(owner)
// where the source doesn't say.
export interface Brief {
  problem: string;
  call: string;
  outcome: string;
}

export interface CaseStudy {
  slug: string;
  index: string;
  company: string;
  product: string;
  title: string;
  /** The home-page hook: a few words that make the reader open the case. Each is a compression of wording already on the case (goal, dek or title), proposed 2026-10-22, owner to approve. */
  hook: string;
  dek: string;
  /** First screen: why the project existed (the business reason), and what the owner personally did. Both come from wording already on the case. */
  why: string;
  part: string;
  tags: string[];
  meta: { label: string; value: string }[];
  brief: Brief;
  headline: Metric;
  metrics: Metric[];
  cover: Img;
  /** A looping demo that replaces the still cover on the home card and the case page (the cover stays as the poster/fallback). */
  demo?: "smartTraffic" | "docPortal" | "doctorOnline";
  // Owner-confirmed measurement method, shown as "How measured" under the impact band and results. Omitted when unknown.
  measured?: string;
  chapters: Chapter[];
  source: string;
}

export const caseStudies: CaseStudy[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "unbounce-design-system",
    index: "01",
    company: "Unbounce",
    product: "Design system",
    title: "A design system that lets teams ship up to twice as much",
    hook: "One source of truth for design and code.",
    dek: "Led the evolution of Unbounce’s design system across 4 product designers and 12 front-end engineers, with semantic tokens, reusable components, governance and engineering alignment.",
    why: "Two dev teams ran separate component libraries, so the UI was hard to maintain and more than 40% inconsistent. The problem to solve: deliver and experiment faster without losing quality or accessibility.",
    part: "I ran strategy, research, planning and testing, then built and maintained the system alongside 4 product designers and 12 front-end engineers.",
    tags: ["Design Systems", "SaaS", "B2B", "Development"],
    meta: [
      { label: "Company", value: "Unbounce" },
      { label: "Role", value: "Senior Product Designer" },
      { label: "Duration", value: "6 months" },
      { label: "Team", value: "4 product designers, 12 front-end engineers, 2 product managers" },
      { label: "Scope", value: "Strategy, research, planning, testing, building, maintaining" },
    ],
    // Sources: Context, "Business challenge", Strategy, System structure and Governance sections of the live page;
    // figures owner-confirmed 2026-09-29 (85% adoption, 167 duplicates in the audit).
    // TODO(owner): what Mick personally drove vs the team, who pushed back, and what changed in the org (M1).
    brief: {
      problem: "As teams shipped independently, UI patterns diverged and design and engineering kept solving the same problems again. Two dev teams were using their own libraries, which made them hard to maintain, and more than 40% of interactions, behaviours and states were inconsistent. The audit found 167 duplicated components, 42 inconsistent interaction patterns and 19 different button implementations.",
      call: "Treat it as a problem of how teams build, not a redesign of the interface. I prioritised high-frequency components, shared patterns and engineering pain points, rolled the system out incrementally, and we shared ownership of it through a transparent contribution and review process.",
      outcome: "We reached 85% adoption across product teams after six months, with up to 2× features shipped per sprint. New designers were onboarded in 1 week instead of 3, and design clarification requests fell from 17 to 8 per sprint.",
    },
    headline: { value: "2", unit: "×", label: "Features shipped per sprint", kind: "multiple", magnitude: 2, direction: "up", qualifier: "up to" },
    measured: "Before and after, over the engagement period", // owner-confirmed 2026-09-29
    // The band leads with the owner-confirmed 85% adoption (round 4, M3 / minor 3).
    metrics: [
      { value: "85", unit: "%", label: "Design system adoption across product teams", kind: "share", magnitude: 85 },
      { value: "2", unit: "×", label: "Features shipped per sprint", kind: "multiple", magnitude: 2, direction: "up", qualifier: "up to" },
      { value: "−68", unit: "%", label: "Duplicated components, 167 to 53", kind: "percent", magnitude: 68, direction: "down" },
      { value: "−40", unit: "%", label: "UI implementation time", kind: "percent", magnitude: 40, direction: "down" },
    ],
    cover: {
      // Owner-approved bento overview of the system (colour, type, tokens, components, one pattern), rendered
      // from the owner's Figma variables (Dark mode values) and kept in src/assets/work/ds-cover-v2.webp as a transparent image, so the site's image frame is the only frame around it. `src` is
      // the manifest key, not a URL. The original Buttons sheet now lives in the "Component principles" chapter.
      src: "ds-cover.png",
      alt: "Unbounce design system overview: brand and neutral colour, Inter and Roboto Mono type, the token chain from core to semantic to component, two groups of components (buttons and controls) and a settings panel built from them.",
      w: 1792,
      h: 1388,
    },
    source: "https://mickdubik.webflow.io/cs/design-system",
    chapters: [
      {
        id: "goals",
        title: "Goals",
        blocks: [
          {
            t: "list",
            items: [
              "Align design and engineering around a single source of truth.",
              "Make design-to-development handoff more efficient and reduce clarification cycles.",
              "Enable faster experimentation and delivery without sacrificing quality or accessibility.",
            ],
          },
        ],
      },
      {
        id: "problem",
        title: "Context and challenge",
        blocks: [
          { t: "statement", text: "As Unbounce’s product ecosystem grew, teams shipped independently and UI patterns diverged. Design and engineering kept solving the same problems again." },
          { t: "prose", paras: ["The opportunity wasn’t to redesign the interface. It was to improve how teams build products."] },
        ],
      },
      {
        id: "research",
        title: "The audit found 167 duplicated components",
        blocks: [
          { t: "tags", label: "Audited", items: ["Figma libraries", "React component inventory", "Storybook", "Engineering backlog", "Support tickets", "Accessibility issues", "Product analytics"] },
          {
            t: "stats",
            label: "What the audit found",
            lead: [
              "Two dev teams were using their own libraries, which made them hard to maintain. More than 40% of interactions, behaviours and states were inconsistent, not just the look.",
              "I ran 6 interviews with designers and engineers, then built the system for them: the components, the tokens, the patterns and the documentation.",
            ],
            items: [
              { value: "167", label: "duplicated components" },
              { value: "42", label: "inconsistent interaction patterns" },
              { value: "19", label: "different button implementations" },
              { value: "Multiple", label: "spacing systems, accessibility inconsistencies and no governance" },
            ],
          },
          // Owner answer, 2026-10-19: why the audit numbers mattered (interaction consistency, not only the look).
          {
            t: "cards",
            label: "Stakeholder needs",
            items: [
              { title: "Design team", body: "A system that is easy to use and meets their needs." },
              { title: "Development team", body: "A system that integrates smoothly with the development process." },
              { title: "Product management", body: "A system that can support product initiatives." },
            ],
          },
        ],
      },
      {
        id: "structure",
        title: "Structure and foundations",
        blocks: [
          { t: "list", label: "What I prioritised", items: ["High-frequency components", "Shared interaction patterns", "Accessibility improvements", "Engineering pain points", "Cross-platform consistency"] },
          { t: "image", img: { src: `${CDN}/698b1ddcdf07b4ad70fda889_Architecture.avif`, alt: "Design system architecture: graphical assets and foundations (design tokens) feed core components and shared team patterns, with documentation as the central source of truth.", w: 2440, h: 708 } },
          { t: "prose", paras: ["I restructured the libraries into a foundation-level hierarchy of colour, typography, spacing and elevation. I layered the tokens: global (raw brand values), semantic (purpose-driven, such as text-primary) and component-level overrides where needed, with clear governance around creating new ones."] },
          // Token chain read from the owner's Figma variables, confirmed by him as Unbounce's system (2026-10-19). blue-500 = #007aff from docs/ds-cover/cover.html.
          {
            t: "tokenChain",
            label: "What a token means",
            steps: [
              { kind: "Core value", name: "blue-500", hint: "What the colour is", swatch: "#007aff" },
              { kind: "Semantic", name: "color/interactive/default", hint: "What the colour means" },
              { kind: "Component", name: "button/primary/bg", hint: "The primary button’s background" },
            ],
            note: "A raw value says what a colour is; a token says what it means. Changing the core value updates every component that uses it.",
          },
          // Owner answers, 2026-10-19 (the option that lost), 2026-11-08 (conflict resolved by reviewing usage) and 2026-11-09 (kept non-conflicting components, replaced the conflicting ones; Storybook helped), kept close to his words and placed where the decision happened.
          {
            t: "decision",
            label: "The decision",
            lead: "The two teams’ components conflicted.",
            options: [
              { tag: "Not chosen", title: "Reuse an existing library", body: "The easiest option, but I disagreed: it should still be used for internal or specific needs." },
              {
                tag: "Chosen",
                title: "Follow best practices",
                points: [
                  "We reviewed how each team’s components were used in the product",
                  "We kept the components that did not conflict, to save time",
                  "We replaced the conflicting ones with the correct components, with Storybook’s help",
                ],
                chosen: true,
              },
            ],
          },
          { t: "prose", paras: ["I gave a junior designer ownership of the colour palette and pattern exploration, reviewing his progress in weekly sessions."] },
          // Owner answer, 2026-10-19: "I built more than 6 patterns." (the "Team Core" layer in the architecture diagram).
          { t: "stats", items: [{ value: "6+", label: "reusable interaction patterns I built on top of the components, for common product flows" }] },
          { t: "plate", variant: "tokens", title: "How the tokens are layered", caption: "Global values feed purpose-driven semantic tokens, with component-level overrides only where needed." },
          { t: "image", img: { src: `${CDN}/6995c9da923e98f49b36d28e_22cb8470e99d6e3e41b01cd98e089299_Semantic.avif`, alt: "A Page Performance card annotated with the semantic colour tokens applied to each element.", w: 2880, h: 1620 } },
        ],
      },
      {
        id: "principles",
        title: "Component principles",
        blocks: [
          {
            t: "cards",
            items: [
              { title: "Reuse over duplication", body: "Prioritise common use cases to maximise adoption." },
              { title: "Extensibility", body: "Support variations through props and configuration, not custom forks." },
              { title: "Accessibility by default", body: "States, interactions and contrast built into the base component." },
              { title: "Design–engineering alignment", body: "Components designed and documented alongside their code counterparts." },
            ],
          },
          { t: "image", img: { src: "buttons-overview.png", alt: "Unbounce design system button overview: the four button types with when to use each, the primary button anatomy, the size of each type, and the three label layouts (icon and text, text and icon, text only) for primary, secondary and text buttons.", w: 2400, h: 2180 } },
          { t: "buttonStates", title: "One button, every state", caption: "The primary button moving through default, hover, focus, pressed and loading, from the component sheet.", note: "The final confirmation is added for the demo and is not part of the sheet." },
        ],
      },
      {
        id: "delivery",
        title: "Engineering partnership and governance",
        blocks: [
          {
            t: "prose",
            paras: [
              "We managed tokens in Token Studio and Storybook and synced them through JSON in version control, creating a shared, source-controlled contract between design and code. Documentation (usage guidance, do and don’t examples, accessibility notes, design and code references side by side) made the system self-serve.",
              "We shared ownership through a transparent contribution and review process: a product need goes through design review and engineering validation before the system changes. So the system grows from real product needs, not to raise the component count.",
            ],
          },
          { t: "tags", label: "Collaboration", items: ["Weekly design system reviews", "Storybook parity reviews", "Implementation QA", "Token synchronisation", "Version and release planning"] },
          { t: "image", img: { src: `${CDN}/6995cc9c7dccba72dbe9c451_14c0e092b6d0a9dfe1ab707080680c6b_Doc%20%7C%20Usage.avif`, alt: "Button documentation: usage guidance for primary, secondary, text and icon buttons, specs, and do and don’t content examples.", w: 2880, h: 2601 } },
        ],
      },
      {
        id: "adoption",
        title: "New designers onboarded in 1 week, not 3",
        blocks: [
          {
            t: "beforeAfter",
            rows: [
              { label: "Component reuse", before: 54, after: 91, unit: "%", better: "up" },
              { label: "Design system adoption", before: 30, after: 85, unit: "%", better: "up" },
              { label: "Accessibility compliance (new UI)", before: 68, after: 96, unit: "%", better: "up" },
              { label: "Design clarification requests per sprint", before: 17, after: 8, unit: "", better: "down" },
              // Owner-confirmed 2026-11-08: 53 duplicated components remained after six months, from the audit's 167 (−68%).
              { label: "Duplicated components", before: 167, after: 53, unit: "", better: "down" },
              { label: "Designer onboarding", before: 3, after: 1, unit: " wk", better: "down" },
            ],
          },
        ],
      },
      {
        id: "results",
        title: "Results after six months",
        blocks: [
          {
            t: "results",
            items: [
              { value: "85", unit: "%", label: "Adoption across product teams", kind: "share" },
              { value: "2", unit: "×", label: "Features shipped per sprint", kind: "multiple", qualifier: "up to" },
              { value: "94", unit: "%", label: "New features built with system components", kind: "share" },
              { value: "−40", unit: "%", label: "UI implementation time", kind: "percent" },
              { value: "−68", unit: "%", label: "Duplicated components, 167 to 53", kind: "percent" },
              // Trimmed 2026-11-08 (owner: "up to 2×" is the delivery claim). Data kept, not shown:
              // 35% faster delivery (same claim as 2×); −48% design clarification meetings (17 → 8 requests is in the table above);
              // −90% UX inconsistencies (overlaps duplicated components); 90% component coverage (91% component reuse is in the table above).
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "unbounce-smart-traffic",
    index: "02",
    company: "Unbounce",
    product: "Smart Traffic",
    title: "More adoption, weekly use and retention for an AI optimiser",
    hook: "AI routing people can understand and trust.",
    dek: "Led design across two squads to make Smart Traffic, the AI that routes each visitor to the landing-page variant most likely to convert, easier to understand, trust and act on.",
    why: "Smart Traffic adoption and retention had to grow while support costs fell. The lever: let customers diagnose performance themselves instead of asking support.",
    part: "I led design across 2 squads: UX research, strategy, design vision, prototyping and testing, and visual design.",
    tags: ["AI", "SaaS", "B2B", "Experimentation"],
    meta: [
      { label: "Company", value: "Unbounce" },
      { label: "Role", value: "Senior Product Designer, leading design across 2 squads" },
      { label: "Duration", value: "2 months" }, // owner, 2026-11-08: Smart Traffic took 2 months from idea to implementation
      { label: "Team", value: "Product manager, front-end and back-end engineers, data analyst, customer success manager" },
      { label: "Scope", value: "UX research, product strategy, design vision, prototyping and testing, visual design" },
    ],
    // Sources: Problem, Synthesis ("whose problem am I solving?"), Design Sprint and Impact sections of the live page.
    // TODO(owner): which alternative direction was rejected, and who had to be convinced (M1, round 4).
    brief: {
      problem: "Small and medium-sized businesses were spending too much time and effort trying to understand how their landing pages were performing.",
      call: "I focused on small and medium businesses rather than larger companies, which already targeted specific customer profiles. I then brought the PM, engineers and customer representatives into the research through a design sprint, so “Reduce cognitive load” became the guiding principle on evidence, not opinion, and we rolled the improvements out incrementally.",
      outcome: "In the month after launch we saw +23% feature adoption among existing customers, with +21% retention and −32% support tickets about understanding Smart Traffic.",
    },
    headline: { value: "+23", unit: "%", label: "Feature adoption", kind: "percent", magnitude: 23, direction: "up" },
    measured: "A/B tests, over the month after launch", // owner-confirmed 2026-09-29; period 2026-11-08
    metrics: [
      { value: "+23", unit: "%", label: "Feature adoption among existing customers", kind: "percent", magnitude: 23, direction: "up" },
      { value: "+17", unit: "%", label: "Weekly active usage of performance insights", kind: "percent", magnitude: 17, direction: "up" },
      { value: "+21", unit: "%", label: "Customer retention", kind: "percent", magnitude: 21, direction: "up" },
      { value: "−32", unit: "%", label: "Support tickets about understanding Smart Traffic", kind: "percent", magnitude: 32, direction: "down" },
    ],
    demo: "smartTraffic",
    cover: {
      src: `${CDN}/698e775ce5806b4da9ef5231_9fda76739ed2eb4ef87921c6cd7076cd_UB%20%7C%20Case%20study%20%7C%20Main.avif`,
      alt: "Unbounce All Pages view with a Page Performance popover comparing a page’s 2% conversion rate with the 5.2% industry average and a 17.1% estimate with Smart Traffic.",
      w: 3240,
      h: 1920,
    },
    source: "https://mickdubik.webflow.io/cs/unbounce-smart-traffic",
    chapters: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          { t: "prose", paras: ["Unbounce helps businesses build landing pages that convert. A page can have variants: versions with, for example, a promo offer, a new headline or a different hero image. Smart Traffic uses AI to send each visitor to the variant that suits them best."] },
          { t: "plate", variant: "traffic", title: "How Smart Traffic works", caption: "A visitor looking for a holiday promo is sent to Variant A, because it leads with a promo offer.", note: "Smart Traffic reads each visitor’s device, location and browser to pick the best match. The visitor, variants and routing are illustrative, not reported data." },
        ],
      },
      {
        id: "goals",
        title: "Business and customer goals",
        blocks: [
          {
            t: "lists",
            groups: [
              {
                label: "Business goals",
                items: [
                  "Increase feature adoption by improving understanding, trust and usage of Smart Traffic as a core optimisation engine.",
                  "Boost retention by helping customers reach faster, clearer wins through insights and benchmarking.",
                  "Differentiate Unbounce as the easiest and smartest landing-page platform through insights, AI-driven optimisation and industry benchmarks.",
                  "Reduce support costs by letting customers self-diagnose performance issues.",
                ],
              },
              {
                label: "Customer goals",
                intro: "Unbounce users, from marketers to small-business owners, needed a product that helped them work smarter and get real results:",
                items: [
                  "Understand what’s working, and why.",
                  "Optimise with less guesswork, even as non-experts.",
                  "Feel supported and guided, with fewer blockers and fewer support tickets.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "problem",
        title: "Problem",
        blocks: [{ t: "statement", text: "Small and medium-sized businesses were spending too much time and effort trying to understand how their landing pages were performing." }],
      },
      {
        id: "research",
        title: "Usage data, interviews and support shadowing",
        blocks: [
          {
            t: "lists",
            groups: [
              { label: "Quantitative", items: ["Feature-usage data analysis", "Drop-off funnel analysis across Smart Traffic", "Heatmaps and click-tracking", "Performance variance by industry"] },
              { label: "Qualitative", items: ["6 one-on-one interviews with marketers, founders and agencies", "Support team shadowing", "Expert review with CRO specialists", "Concept testing with low-fidelity prototypes"] },
            ],
          },
        ],
      },
      {
        id: "personas",
        title: "Three customers, three jobs to be done",
        blocks: [
          {
            t: "personas",
            items: [
              {
                name: "Agile marketer",
                desc: "A hands-on marketing manager or business owner focused on rapid growth, who values tools that simplify finding the best landing pages to scale.",
                jtbd: "Boost landing-page conversion rates to grow the business while spending less time managing campaigns.",
              },
              {
                name: "Strategic advisor",
                desc: "A seasoned freelancer or small-agency owner running campaigns for several clients, who needs clear performance metrics without manual A/B testing.",
                jtbd: "When I deliver a campaign for my client, I want to show them the value of optimised landing pages quickly, so I can save time and strengthen my pitch.",
              },
              {
                name: "Data-driven specialist",
                desc: "A marketing or business-development professional in accounting or insurance, who prioritises benchmarks against the market.",
                jtbd: "When I create landing pages for a lead-generation campaign, I want to compare my performance to industry benchmarks, so I can build more competitive pages.",
              },
            ],
          },
          {
            t: "quotes",
            label: "Questions I heard in research",
            items: [
              "How do I know which landing page version is actually performing the best without digging into endless data?",
              "How can I prove to my manager that optimising our landing pages directly impacts conversions?",
              "Is my landing page competitive compared to others in my industry?",
            ],
          },
        ],
      },
      {
        id: "synthesis",
        title: "Recommendations beat raw metrics",
        blocks: [
          {
            t: "stats",
            viz: "bars",
            items: [
              { value: "4 of 6", label: "interviewees prefer a single source of truth over switching between analytics tools" },
              { value: "80%", label: "of those who try Smart Traffic on a page keep using it" },
              { value: "6 of 6", label: "interviewees want industry benchmarks to validate their decisions" },
              { value: "5 of 6", label: "interviewees respond better to actionable recommendations than to raw metrics" },
            ],
          },
          {
            t: "lists",
            groups: [
              { label: "Focus audience by size", items: ["Small companies (1–10 employees)", "Medium companies (11–49 employees)"] },
              { label: "Focus audience by industry", items: ["E-commerce", "Agencies", "Accounting", "Insurance"] },
            ],
          },
        ],
      },
      {
        id: "principles",
        title: "Reduce cognitive load: the guiding principle",
        blocks: [
          {
            t: "cards",
            numbered: true,
            items: [
              { title: "Reduce cognitive load", body: "Users should understand performance, insights and recommended actions without effort." },
              { title: "Guide, don’t overwhelm", body: "Highlight the next most meaningful action." },
              { title: "Make intelligence feel human", body: "Show impact in real business terms, such as conversions and revenue lift." },
              { title: "Contextual awareness", body: "Optimise campaigns with intuitive, beginner-friendly tools." },
              { title: "Prioritise velocity of action", body: "Every feature should shorten the path from signal to decision to result." },
            ],
          },
        ],
      },
      {
        id: "ideation",
        title: "A design sprint with PM, engineers and customer reps",
        blocks: [
          {
            t: "prose",
            paras: [
              "I ran a Google Design Sprint that brought the product manager, developers and customer representatives directly into the research findings. The direction wasn’t my opinion against theirs; it was what the data showed. That is how we adopted “Reduce cognitive load” as the guiding principle without friction.",
              "I also paired with a junior designer through the sprint sessions, coaching him through the process.",
              // Owner answer, 2026-11-08: he built the prioritisation map and facilitated the workshop where the team agreed.
              "I built a prioritisation map and facilitated the workshop where the team agreed what to do first.",
            ],
          },
          {
            t: "lists",
            groups: [
              { label: "Short-term roadmap", items: ["Offer deeper insights", "Educate users about Smart Traffic", "Give clear information on page performance"] },
              { label: "Long-term roadmap", items: ["Onboarding that shows the power of AI", "Simpler workflows with less friction", "A long-term, personalisation-focused experience plan"] },
            ],
          },
        ],
      },
      {
        id: "hypotheses",
        title: "Hypotheses and trade-offs",
        blocks: [
          {
            t: "hypotheses",
            // H1–H3 all shipped (owner-confirmed 2026-09-29). Reasons from the owner, 2026-11-08; interview shares are out of 6 interviews.
            items: [
              {
                area: "All campaigns (pages)", verdict: { status: "Shipped", reason: "All 6 interviewees wanted industry benchmarks, and all 5 testers felt more confident with the benchmark views." },
                context: "The most visited page: a high-level overview of every campaign.",
                belief: "If we surface core performance metrics up front, users can immediately see how their variants are performing without digging into details.",
                tradeoffs: ["Works well for advanced users, but beginners may feel overwhelmed by raw numbers.", "Less room for contextual insights or recommendations."],
                img: { src: `${CDN}/679c0dfd6623ee3c1d89e28a_7656006668a11082d9709dda30b8442a_UB%20%7C%20Wire%20%7C%20Main.avif`, alt: "Annotated early design of the All Pages list with core performance metrics per page. Callouts: mode badge, performance indicator, industry filter in a Page Performance popover, and performance suggestions.", w: 3066, h: 1537 },
              },
              {
                area: "Campaign page overview", verdict: { status: "Shipped", reason: "Customers got better performance stats over the campaign period. For those who stayed, I added improvement ideas based on the page performance." },
                context: "Detailed page results, with a summary of key changes over a selected period.",
                belief: "Presenting performance over time helps users understand patterns, anomalies and the progress of Smart Traffic’s learning.",
                tradeoffs: ["Time-series data adds complexity.", "Harder to digest quickly for users who prefer simple summaries."],
                img: { src: `${CDN}/679c0f26182e4e103deb7158_9c5a0bd5f20dd298369158547a8d78aa_UB%20_%20Wire%20_%20Campaign.avif`, alt: "Annotated early design of a campaign overview: page statistics and a 7-day rolling conversion-rate chart with a hover tooltip. Callouts: KPI changes, page improvements, daily changes.", w: 3054, h: 1536 },
              },
              {
                area: "Page opportunities", verdict: { status: "Shipped", reason: "5 of 6 interviewees responded better to actionable recommendations than to raw metrics." },
                context: "The steps and actions that help customers improve a page.",
                belief: "If we lead with clear, AI-generated insights and recommendations, users will know what to do faster, improving adoption and confidence.",
                tradeoffs: ["Less granular detail up front; users may need extra clicks to validate an insight.", "Relies heavily on the quality and trustworthiness of the AI explanations."],
                img: { src: `${CDN}/679c0fafdb64f2ed53dc7e1b_60be63704d2dfac49d5610662c86184a_UB%20_%20Wire%20_%20Page.avif`, alt: "Annotated early design of a page’s statistics with a Page Opportunities side panel. Callouts: page opportunities (suggested traffic source) and feature promotion (turn on Smart Traffic).", w: 3054, h: 1536 },
              },
            ],
          },
        ],
      },
      {
        id: "testing",
        title: "Validated: 5 of 5 felt more confident",
        blocks: [
          {
            t: "prose",
            paras: ["I tested usefulness with Maze: internal team reviews, stakeholder alignment, and 5 Unbounce customer success managers, who stood in for customers. The scope covered clarity of Smart Traffic’s value, relevance of the insights, data hierarchy, and page-to-page flow."],
          },
          {
            t: "stats",
            viz: "bars",
            label: "What testing showed",
            items: [
              { value: "5 of 5", label: "felt more confident and better informed with benchmark views" },
              { value: "4 of 5", label: "said they would enable Smart Traffic more confidently" },
              { value: "3 of 5", label: "were more likely to revisit insights weekly" },
              { value: "3 of 5", label: "wanted notifications when performance changes" },
            ],
          },
          {
            t: "gallery",
            compare: true,
            imgs: [
              { src: `${CDN}/678c23f519ea651d96819468_cc7ca262c6c93443226fc48fecd908c8_Unbounce%20_%20Before.avif`, alt: "Before: the All Pages list showed only basic campaign stats.", w: 1157, h: 730, caption: "Before" },
              { src: `${CDN}/678c23f5a272db14db6495d1_1c65762f3dcc36b199e871954fe8ae88_Unbounce%20_%20After.avif`, alt: "After: each page shows a performance rating, with a popover benchmarking its conversion rate against its industry.", w: 1157, h: 730, caption: "After" },
            ],
          },
          { t: "demo", demo: "smartTraffic", caption: "Page Performance, from the list. Each page now gets a rating and a lightbulb; hovering it shows how the page compares with its industry." },
        ],
      },
      {
        id: "results",
        title: "Results",
        blocks: [
          // Owner answer, 2026-11-08: measured for one month after launch. Do not name the months on the page.
          { t: "prose", paras: ["We measured the results with A/B tests over the month after launch."] },
          {
            t: "results",
            lead: 3,
            items: [
              { value: "+23", unit: "%", label: "Feature adoption, through the performance page", kind: "percent" },
              { value: "+21", unit: "%", label: "Customer retention", kind: "percent" },
              { value: "−32", unit: "%", label: "Support tickets about understanding Smart Traffic", kind: "percent" },
              { value: "+17", unit: "%", label: "Weekly active usage of performance insights", kind: "percent" },
              { value: "+34", unit: "%", label: "Users engaging with “Suggested improvements”", kind: "percent" },
              { value: "+20", unit: "%", label: "Pages published with Smart Traffic within 1 month", kind: "percent" },
              { value: "+17", unit: "%", label: "Click-through rate", kind: "percent" },
              { value: "+12", unit: "%", label: "Average session duration", kind: "percent" },
              { value: "60k+", unit: "", label: "Unbounce customers using the AI-driven experiences (company-wide, for scale)", kind: "plain" },
              { value: "2.5", unit: "×", label: "Faster experimentation", kind: "multiple" },
            ],
          },
          {
            t: "gallery",
            wide: true,
            imgs: [
              { src: `${CDN}/66df045af3b7fa626d522a73_Unbounce_Pages_Low.gif`, alt: "Animation of the shipped All Pages view: page rows with visitors, conversions and conversion rate, and performance ratings that open benchmark details.", w: 1440, h: 900, caption: "Compete with top pages in the market" },
              { src: `${CDN}/66df0c0eb2d7178b297450d8_Unbounce_Chart_Low.gif`, alt: "Animation: conversion rates tracked on a timeline, with a downloadable report.", w: 1440, h: 900, caption: "Tracking conversion rates over time" },
            ],
          },
        ],
      },
      {
        id: "next",
        title: "Next steps",
        blocks: [
          {
            t: "list",
            items: [
              "Add real-time session insights (scroll, click, attention).",
              "Enable predictive conversion modelling.",
              "Evolve Smart Traffic explanations with natural-language summaries.",
              "Expand competitive benchmarking.",
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "datarobot-self-service-docs",
    index: "03",
    company: "DataRobot",
    product: "Self-service docs portal",
    title: "A documentation portal that cut support requests by 64%",
    hook: "Docs that let users unblock themselves.",
    dek: "Designed a unified documentation portal for DataRobot’s AI platform, with a clear information architecture, structured articles and interactive code examples, so users could unblock themselves.",
    why: "Repetitive support tickets were driving up support costs. The problem to solve: help customers find answers themselves, so fewer tickets reach support.",
    part: "I covered product strategy, UX research, information architecture, wireframing, prototyping and testing, and visual design.",
    tags: ["AI", "B2B", "SaaS", "Onboarding"],
    meta: [
      { label: "Company", value: "DataRobot" },
      { label: "Role", value: "Product Designer" },
      { label: "Duration", value: "March – August 2021" },
      { label: "Team", value: "Product manager, front-end and back-end engineers, data manager, customer representative manager" },
      { label: "Scope", value: "Product strategy, UX research, information architecture, wireframing, prototyping and testing, visual design" },
    ],
    // Sources: Problem, "Unified platform for all assets", Key lessons ("Strategic MVP launch") and Results on the live page.
    // TODO(owner): the alternative that was rejected (e.g. keeping the three separate tools), and who had to agree (M1).
    brief: {
      problem: "DataRobot users struggled to find clear, actionable guidance when working with the platform.",
      call: "One unified documentation portal in place of three separate development tools, with a single information architecture, structured articles and interactive code samples, and we launched it as a strategic MVP so out-of-scope requests couldn’t derail it.",
      outcome: "We cut support requests by 64%. The non-technical persona reached 80% task success, and the hi-fi prototype scored 78.3 on the SUS.",
    },
    headline: { value: "−64", unit: "%", label: "Support requests", kind: "percent", magnitude: 64, direction: "down" },
    metrics: [
      { value: "−64", unit: "%", label: "Support requests", kind: "percent", magnitude: 64, direction: "down" },
      { value: "78.3", unit: "", label: "SUS usability score for the hi-fi prototype", kind: "score", magnitude: 78.3, benchmark: { value: 68, label: "benchmark avg 68" } },
      { value: "80", unit: "%", label: "Task success, non-technical persona", kind: "share", magnitude: 80 },
      { value: "+41", unit: "%", label: "Documentation engagement in high-value workflows", kind: "percent", magnitude: 41, direction: "up" },
    ],
    demo: "docPortal",
    cover: {
      src: `${CDN}/698e775d80f611baf0219951_b2d2280e122c2037544c651f6e7151f5_DR%20%7C%20Case%20study%20%7C%20Main.avif`,
      alt: "The DataRobot documentation portal home page, with a search field and entry points for UI docs, API docs, tutorials and glossary.",
      w: 2160,
      h: 1280,
    },
    source: "https://mickdubik.webflow.io/cs/datarobot-doc",
    chapters: [
      {
        id: "goals",
        title: "Business goal",
        blocks: [{ t: "statement", text: "Reduce support costs by cutting the volume of repetitive support tickets and lowering operational cost." }],
      },
      {
        id: "customers",
        title: "Customer goals",
        blocks: [{ t: "list", items: ["Complete tasks without support, and unblock themselves.", "Understand how to use complex AI/ML features with confidence."] }],
      },
      {
        id: "problem",
        title: "Problem",
        blocks: [
          { t: "statement", text: "DataRobot users struggled to find clear, actionable guidance when working with the platform." },
          { t: "plate", variant: "portal", title: "Three tools, one portal", caption: "One unified documentation portal in place of three separate development tools, with search and four main pathways." },
        ],
      },
      {
        id: "research",
        title: "20 surveys and 12 interviews on what users needed",
        blocks: [
          { t: "prose", paras: ["We worked as a cross-functional squad (PM, engineers, data, legal) through discover, define and ideate, design, test and handoff. I ran the research, which focused on user goals, pain points in the existing journey, and measuring task success."] },
          {
            t: "stats",
            items: [
              { value: "20", label: "surveys (SurveyMonkey) for quantitative data" },
              { value: "12", label: "user interviews on motivations, needs, goals and pain points" },
              { value: "1", label: "persona, from support requests, interviews and surveys via affinity mapping and JTBD" },
            ],
          },
        ],
      },
      {
        id: "personas",
        title: "The insight seeker: one persona, one job",
        blocks: [
          {
            t: "personas",
            items: [
              {
                name: "Insight seeker",
                desc: "An entrepreneur, consultant, manager or analyst focused on growing their business, who relies on actionable insights and wants to find the right information without building complex models.",
                jtbd: "When I use the app, I want it to guide me to the most relevant insights quickly, so I can confidently make data-driven decisions and focus on my business priorities.",
              },
            ],
          },
        ],
      },
      {
        id: "synthesis",
        title: "86% wanted search, 71% wanted explanations",
        blocks: [
          {
            t: "stats",
            items: [
              { value: "49%", label: "see DataRobot as an advanced app that needs extra information and theory to reach their goals" },
              { value: "71%", label: "feel explanations of how features and functions are used would help a lot" },
              { value: "86%", label: "want search to find results on a specific topic" },
            ],
          },
          { t: "tags", label: "Alignment workshops I facilitated with product, docs, engineering and support", items: ["Shared problem framing", "Documentation audit", "Support ticket insights", "Competitive analysis", "Prioritisation", "North-star vision"] },
        ],
      },
      {
        id: "principles",
        title: "Six principles, from guidance to simplicity",
        blocks: [
          {
            t: "cards",
            items: [
              { title: "Provide guidance", body: "For complex processes and ideas." },
              { title: "Give flexibility", body: "Every model varies in users’ needs and knowledge." },
              { title: "Build confidence", body: "Show the value and power of the platform." },
              { title: "Act as an advocate", body: "Be a fair partner for the customer." },
              { title: "Be transparent", body: "Communicate clearly and truthfully." },
              { title: "Keep it simple", body: "Optimise for easy understanding." },
            ],
          },
          { t: "image", img: { src: `${CDN}/661867028444ce38e1184b79_DataRobot%20Assets.webp`, alt: "The three separate developer documentation sites that the unified portal replaced.", w: 2114, h: 1533, caption: "From three separate development tools to one unified documentation portal." } },
        ],
      },
      {
        id: "testing",
        title: "78.3 on the SUS, above the benchmark of 68",
        blocks: [
          {
            t: "cards",
            label: "Stakeholder feedback that shaped the next iteration",
            items: [
              { title: "Navigation complexity", body: "The sidebar needed too many clicks." },
              { title: "Location clarity", body: "Users needed to know where they were in the portal." },
              { title: "Content structure", body: "At most 3 levels of hierarchy." },
              { title: "Mobile experience", body: "The mobile interface needed a full overhaul." },
            ],
          },
          { t: "prose", paras: ["I tested the hi-fi prototype with 23 participants, and it scored 78.3 on the System Usability Scale, above the benchmark average of 68. Users found it easier to understand how features work, locate information and reach helpful suggestions."] },
        ],
      },
      {
        id: "delivery",
        title: "What we shipped",
        blocks: [
          {
            t: "cards",
            items: [
              { title: "Easy access in the app", body: "A documentation link in the navigation menu." },
              { title: "Contextual documentation", body: "Docs support for every new feature." },
              { title: "Simple entry point", body: "Four main pathways and a powerful search." },
              { title: "Advanced search", body: "Filters by section and category, with result previews." },
              { title: "Rational navigation", body: "A table of contents on every article." },
              { title: "Interactive code samples", body: "Grouped by tabs, easy to copy." },
            ],
          },
          { t: "prose", paras: ["I worked closely with the front-end team, specifying interactions the mockups didn’t cover, and reviewed each development ticket against the design before it went live."] },
          {
            t: "gallery",
            wide: true,
            imgs: [
              { src: `${CDN}/661867028444ce38e1184b80_Doc%20Portal%20_%20Search.webp`, alt: "Search overlay with filters by section (UI docs, API docs, tutorials and more) and a preview of the selected result.", w: 3072, h: 2114, caption: "Advanced search" },
              { src: `${CDN}/661867028444ce38e1184b7f_Doc%20Portal%20_%20Code%20Sample.webp`, alt: "Article page with tabbed Python code samples, section navigation and an on-page table of contents.", w: 3072, h: 1920, caption: "Interactive code samples" },
            ],
          },
        ],
      },
      {
        id: "results",
        title: "Results",
        blocks: [
          {
            t: "results",
            items: [
              { value: "−64", unit: "%", label: "Support requests", kind: "percent" },
              { value: "78.3", unit: "", label: "SUS score, 23 participants (benchmark average 68)", kind: "score" },
              { value: "80", unit: "%", label: "Task success, non-technical persona", kind: "share" },
              { value: "78", unit: "%", label: "Customer satisfaction", kind: "share" },
              { value: "+41", unit: "%", label: "Documentation engagement in high-value workflows", kind: "percent" },
              { value: "480", unit: "", label: "Daily active users on the portal", kind: "plain" },
              { value: "−22", unit: "%", label: "Onboarding time, from simpler deployment and API configuration", kind: "percent" },
              { value: "50k+", unit: "", label: "Customers using the enterprise AI workflows", kind: "plain" },
            ],
          },
          { t: "demo", demo: "docPortal" },
          {
            t: "cards",
            label: "Key lessons",
            items: [
              { title: "Strategic MVP launch", body: "Keeps out-of-scope requests from derailing the project and gets a quality product out on time." },
              { title: "Continuous user testing", body: "Always find ways to collect and listen to user feedback." },
              { title: "Focus on essentials", body: "Short iterations reveal the most effective tactics quickly." },
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "doctor-online-launch",
    index: "04",
    company: "Doctor Online",
    product: "Telemedicine MVP",
    title: "From concept to a top-3 health app in three months",
    hook: "Concept to launch in three months.",
    dek: "As the sole product designer, defined the short- and long-term vision and launched Doctor Online’s MVP: remote consultations, lab tests and treatment plans for patients, and a SaaS workspace for doctors.",
    why: "People needed affordable, professional remote medical consultations. The problem to solve: get the MVP launched so they could have them.",
    part: "As the sole product designer I covered strategy, UX research, flows, wireframes, prototyping and testing, the design system, visual and interaction design, and analytics.",
    tags: ["B2C", "SaaS", "iOS", "Android", "MVP"],
    meta: [
      { label: "Company", value: "Doctor Online" },
      { label: "Role", value: "Product Designer (sole designer)" },
      { label: "Duration", value: "2019 – 2020" },
      { label: "Team", value: "Product manager, mobile, front-end and back-end engineers, data analyst" },
      { label: "Scope", value: "Strategy, UX research, flows, wireframes, prototyping and testing, design system, visual and interaction design, analytics" },
    ],
    // Sources: Key challenges, Customer Experience Map, Results ("Defined short & long-term vision") on the live page.
    // TODO(owner): the direction rejected when the treatment flow changed, and who had to agree (M1).
    brief: {
      problem: "Patients faced long waits and trips to a clinic and hesitated to share health data online, while some doctors were uncomfortable with digital tools.",
      call: "I defined the short- and long-term vision, and used a customer experience map to significantly change the planned treatment flow, removing unnecessary and adverse steps.",
      outcome: "We went from concept to first revenue in 3 months on SaaS, iOS and Android. Consultation completion rose 27%, medicine-ordering time fell 35%, and we reached a top-3 health app in Ukraine’s App Store and 5× monthly active users.",
    },
    headline: { value: "3", unit: " mo", label: "From concept to multi-platform launch", kind: "months", magnitude: 3 },
    metrics: [
      { value: "3", unit: " mo", label: "Concept to first revenue on SaaS, iOS and Android", kind: "months", magnitude: 3 },
      { value: "Top 3", unit: "", label: "Health category, Ukraine App Store", kind: "plain" },
      { value: "5", unit: "×", label: "Monthly active users", kind: "multiple", magnitude: 5, direction: "up" },
      { value: "1M+", unit: "", label: "Downloads", kind: "plain" },
    ],
    demo: "doctorOnline",
    cover: {
      src: `${CDN}/698e775da72d32fd11a4f995_071c6f33ec9baa317cdbfa4347c93869_DO%20%7C%20Case%20study%20%7C%20Main.avif`,
      alt: "A grid of Doctor Online iOS screens: health dashboard, pharmacy map, doctor appointment form, video consultation, prescriptions and lab orders.",
      w: 2160,
      h: 1280,
    },
    source: "https://mickdubik.webflow.io/cs/doctor-online",
    chapters: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          { t: "prose", paras: ["Doctor Online lets patients consult a doctor, order lab tests and get a treatment plan without leaving home, giving people fast, affordable care while helping doctors understand and act on what patients need."] },
          { t: "plate", variant: "care", title: "The patient journey", caption: "What the product lets a patient do, as described in the case overview." },
        ],
      },
      {
        id: "goals",
        title: "Business goal",
        blocks: [{ t: "statement", text: "Launch the Doctor Online MVP, providing affordable, professional remote medical consultations." }],
      },
      {
        id: "customers",
        title: "Customer goals",
        blocks: [{ t: "statement", text: "Get quick, reliable consultations, complete necessary tests and receive effective treatment plans, conveniently and affordably." }],
      },
      {
        id: "problem",
        title: "Key challenges",
        blocks: [
          {
            t: "cards",
            items: [
              { title: "Patients: urgent accessibility", body: "Long waits, stressful scheduling and travel to a clinic, even when in pain." },
              { title: "Patients: lack of trust", body: "Hesitation to share health data online, and a need for reassurance about doctors’ credentials." },
              { title: "Doctors: digital confidence", body: "Some doctors were uncomfortable using digital tools for daily tasks." },
            ],
          },
        ],
      },
      {
        id: "research",
        title: "No direct competitor, so I profiled adjacent products",
        blocks: [
          { t: "prose", paras: ["I ran interviews and surveys with 11 patients and 7 doctors, which produced three target profiles. I developed the treatment flow from 0 to 1. A customer experience map led me to change the planned flow significantly, removing unnecessary and adverse steps. I built the information architecture from a content audit, competitor analysis and card sorting, and validated it with tree testing. With no direct competitor in the market, I profiled adjacent medical products and ran a SWOT analysis."] },
          { t: "tags", label: "Methods", items: ["Interviews", "Surveys", "Customer experience map", "Content audit", "Competitor profiles + SWOT", "Card sorting", "Tree testing"] },
          { t: "image", img: { src: `${CDN}/672537a9bd626ca5f8f5952f_CEM.avif`, alt: "Customer experience map across six touchpoints, from deciding to start to leaving a review, showing patient thoughts, feelings and experience ratings at each stage.", w: 3304, h: 1618 } },
        ],
      },
      {
        id: "synthesis",
        title: "Patients want a second opinion; doctors lack time",
        blocks: [
          {
            t: "cards",
            items: [
              { title: "Patients want multiple opinions", body: "Extra opinions reassure them, but visiting several clinics costs a lot of time." },
              { title: "Patients want to choose their doctor", body: "Many prefer the same doctor, and value knowing if a doctor has seen similar cases." },
              { title: "Doctors lack time and support", body: "They want more control and system support for accurate diagnoses and treatment." },
              { title: "Doctors struggle with workload", body: "Back-to-back consultations and admin make it hard to focus on patients." },
            ],
          },
        ],
      },
      {
        id: "delivery",
        title: "Design and delivery",
        blocks: [
          { t: "prose", paras: ["I focused the wireframes on making key medical actions easy to reach: scheduling a consultation with the context doctors need, real-time chat, and a doctor’s workspace for managing several consultations at once. Visual design moved from mood boards and a UI kit to the first style guide. I collaborated with 1 business analyst and 4 engineers, and also produced marketing visuals and videos."] },
          { t: "demo", demo: "doctorOnline" },
          { t: "image", img: { src: `${CDN}/679d1569238ea17a52d53d2e_DO%20_%20Wire%20_%20Doc%20Workspace.avif`, alt: "Wireframe of the doctor’s workspace: consultation queue, chat and patient card side by side.", w: 2712, h: 1716, caption: "Doctor’s workspace wireframe" } },
          { t: "image", img: { src: `${CDN}/6724f7f0c55742cdb3238f9d_Web%20Screens.avif`, alt: "Screens from the doctor SaaS platform: consultations, video call, lab results, reviews and profile settings.", w: 3840, h: 1905, caption: "SaaS platform for doctors" } },
          { t: "prose", paras: ["After launch I tracked goals with Google’s HEART framework to keep design decisions data-driven."] },
          // Owner answers, 2026-11-08: 4.6 rating, 32% returning, 54% ordered lab tests in the treatment flow, 22% second consultation.
          // 50K+ users is from the CV ("telemedicine and e-pharmacy features for 50K + users"); it is not labelled as MAU because the CV gives no MAU number.
          {
            t: "stats",
            label: "What the HEART metrics showed",
            stack: true,
            items: [
              { value: "50K+", label: "users of the telemedicine and e-pharmacy features" },
              { value: "4.6", label: "app rating in the app stores" },
              { value: "32%", label: "returning customers" },
              { value: "22%", label: "booked a second consultation" },
              { value: "54%", label: "ordered lab tests in the treatment flow" },
            ],
          },
        ],
      },
      {
        id: "results",
        title: "Results",
        blocks: [
          {
            t: "results",
            items: [
              { value: "3", unit: " mo", label: "Concept to first revenue on SaaS, iOS and Android", kind: "months" },
              { value: "Top 3", unit: "", label: "Health category, Ukraine App Store", kind: "plain" },
              { value: "+27", unit: "%", label: "Consultation completion", kind: "percent" },
              { value: "−35", unit: "%", label: "Medicine-ordering time", kind: "percent" },
              { value: "5", unit: "×", label: "Monthly active users", kind: "multiple" },
              { value: "1M+", unit: "", label: "Downloads", kind: "plain" },
              { value: "831", unit: "", label: "Screens I designed", kind: "plain" },
            ],
          },
          {
            t: "cards",
            label: "Reflections",
            items: [
              { title: "Startup pace", body: "As the sole designer, I learned to prioritise hard and to hold a whole view of mobile and web, from experience to strategy." },
              { title: "The power of communication", body: "I worked directly with engineers, PMs and founders and learned the constraints early, which minimised rework." },
              { title: "User-centred iteration", body: "We listened to user feedback and kept the team aligned, which kept the project on track." },
            ],
          },
        ],
      },
    ],
  },
];

export const getCase = (slug: string) => caseStudies.find((c) => c.slug === slug);
