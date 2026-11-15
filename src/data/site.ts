// Site-wide facts. Sources: /PRODUCT.md and the owner's live site https://mickdubik.webflow.io
// (principles copy, availability line and resume link are taken from the live home page).

export const contact = {
  email: "nikolay.dubik@gmail.com",
  linkedin: "https://www.linkedin.com/in/mickdubik/",
  // The owner's own published resume link, taken from the live site footer.
  // TODO(owner): optionally self-host as Core/public/resume.pdf and point this at it.
  resume: "https://drive.google.com/file/d/1azvDcO4QFqG3YoP_bYAnjQJtBfIr19O2/view?usp=sharing",
  // The owner's 15-minute booking page (Cal.com), given by the owner 2026-10-21.
  booking: "https://cal.com/mickdubik/15min?overlayCalendar=true",
};

export const mailto = (subject = "Project enquiry") =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;

// Owner answer 2026-09-30 (wording revised in round 9): used in the hero, footer, case pages and JSON-LD.
export const availability = "Open to new projects in 2027";

export const role = "Senior Product Designer"; // owner-confirmed 2026-09-29; replaces "Lead Product Designer"

// Footer line that backs the contact hook ("Bring me the problem. I'll bring the numbers.") with the direction of the
// numbers, and points to "The record" list beside it:
// adoption +23% (Smart Traffic), retention +21% / churn −21% (Smart Traffic), support requests −64% (DataRobot), all sourced.
// [before, emphasised, after]
export const positioning = ["Adoption up. Retention up. Support load down. ", "All on the record.", ""] as const;

export const topics = ["AI", "SaaS", "B2B", "B2C", "Product Design", "Design Systems", "Development"];

// `sub` is the one line under each figure in the home "Why me" bento. Every claim comes from the case data (60k+ Unbounce AI customers, 50k+ DataRobot
// customers, the case industries, the client logos). Proposed 2026-10-24: owner to approve the wording.
export const stats = [
  { id: "customers", value: "2m+", label: "Customers and still counting", sub: "People using the products I’ve designed, including 60k+ on Unbounce’s AI tools and 50k+ on DataRobot." },
  { id: "years", value: "8", label: "Years of experience", sub: "Designing SaaS and AI products, from first MVPs to enterprise design systems." },
  { id: "projects", value: "50+", label: "Projects completed", sub: "B2B SaaS, AI, telemedicine and consumer products." },
  { id: "clients", value: "30", label: "Global clients", sub: "Teams like Unbounce, DataRobot, LG and ZiiP." },
];

export const principles = [
  {
    title: "Design strategy",
    body: "Align product vision, roadmap and UX by framing problems clearly, prioritising opportunities and defining measurable success criteria for each initiative.",
  },
  {
    title: "Data-informed decisions",
    body: "Combine qualitative research with product analytics and experimentation to validate ideas, de-risk bets and iterate on features that move retention, activation and revenue.",
  },
  {
    title: "Team leadership",
    body: "Lead cross-functional squads (product, engineering, data, marketing) through decisions with clear communication, shared context and fast, aligned execution.",
  },
  {
    title: "Systems and velocity",
    body: "Build and evolve design systems that increase delivery speed and consistency, so teams ship more experiments and features per sprint without sacrificing quality.",
  },
  {
    title: "Mentorship",
    body: "Help designers grow and contribute to design culture by sharing practices around experimentation, systems thinking and storytelling with data.",
  },
  {
    title: "AI-augmented workflow",
    body: "Claude works beside me every day, as a coworker and an assistant: it helps synthesise research, speed up iteration and turn ideas into decisions faster, with the judgment calls kept human.",
    highlight: true,
    href: "#ai-workflow",
  },
];


// Client logos: owner-approved 2026-09-29, hot-linked from the owner's Webflow CDN. TODO(owner): self-host.
// (The portrait is self-hosted since round 6: src/assets/home/portrait.png via components/Portrait.astro.)
const CDN = "https://cdn.prod.website-files.com/661867028444ce38e1184ac0";

// All logos are single-colour (#01070F) on a 204×64 canvas, so they sit as one consistent ink row.
// Round 7: each logo carries a one-line context caption (owner answers 2026-09-30 for LG, InDevLab, Milistan,
// w.tech; PRODUCT.md for the rest) and links to its case study where one exists. This replaced the separate
// clients list, which repeated the logos and the case list.
// Round 11: optical size normalisation. `box` is each mark's ink bounding box inside its 204×64 source canvas
// (measured by scripts/measure-logos.mjs) and `s` the scale that gives every mark roughly the same visual area
// (target 4300px², capped at 196×58px): s = min(√(4300 / (w·h)), 196 / w, 58 / h).
export type LogoBox = { x: number; y: number; w: number; h: number; s: number };
export const logos: { name: string; src: string; note: string; box: LogoBox; links?: { label: string; href: string }[] }[] = [
  { name: "ZiiP", box: { x: 69.1, y: 11.5, w: 65.5, h: 40.4, s: 1.275 }, src: `${CDN}/69a744dcf2a36bbb199d4fa8_Logo%20%7C%20ZiiP.svg`, note: "Current role", links: [{ label: "Current role", href: "#current" }] },
  { name: "Unbounce", box: { x: 25.6, y: 21.8, w: 154, h: 30.4, s: 0.958 }, src: `${CDN}/69a744d9ca43cda3d8debdb6_Logo%20%7C%20Unbounce.svg`, note: "Enterprise design system and Smart Traffic", links: [{ label: "Smart Traffic", href: "/work/unbounce-smart-traffic" }, { label: "Design system", href: "/work/unbounce-design-system" }] },
  { name: "DataRobot", box: { x: 28, y: 23, w: 148.8, h: 17.8, s: 1.274 }, src: `${CDN}/69a744d9c6f08b62f563ae54_Logo%20%7C%20DataRobot.svg`, note: "Self-service docs portal", links: [{ label: "Self-service docs portal", href: "/work/datarobot-self-service-docs" }] },
  { name: "LG", box: { x: 64, y: 17.5, w: 71, h: 34.6, s: 1.323 }, src: `${CDN}/69a744d95863b7cc5e2decfa_Logo%20%7C%20Lg.svg`, note: "Shop web & mobile experience" },
  { name: "InDevLab", box: { x: 64, y: 9, w: 90.4, h: 36, s: 1.149 }, src: `${CDN}/69a744d9412b072236b85429_Logo%20%7C%20IDL.svg`, note: "Variety of projects" },
  { name: "Doctor Online", box: { x: 59.1, y: 18.6, w: 92.3, h: 26.8, s: 1.318 }, src: `${CDN}/69a744d9bef203dedb2de431_Logo%20%7C%20DO.svg`, note: "Telemedicine MVP in 3 months", links: [{ label: "Telemedicine MVP in 3 months", href: "/work/doctor-online-launch" }] },
  { name: "[10]props", box: { x: 47.5, y: 19.8, w: 115.7, h: 26.4, s: 1.186 }, src: `${CDN}/69a744d9e7f8a250686ce080_Logo%20%7C%2010%20props.svg`, note: "Activation & bet completion" },
  { name: "Milistan", box: { x: 44.7, y: 11, w: 115.3, h: 43, s: 0.931 }, src: `${CDN}/69a744d9d2bd92afd3f92768_Logo%20%7C%20Mili.svg`, note: "Website" },
  { name: "w.tech", box: { x: 50.1, y: 20.1, w: 104.4, h: 23.9, s: 1.313 }, src: `${CDN}/69a744daac4bc5f594718f68_Logo%20%7C%20w.tech.svg`, note: "Brand style guide & assets" },
];

// Current role. SOURCE: owner's CV "Mick Dubik - Senior Product Designer" (Base), via
// Core/docs/content/owner-answers-2026-09-29.md. Verbatim facts only; no images or process details exist,
// so there is no case page: the card offers the full case study on request.
export const current = {
  company: "ZiiP",
  role: "Senior Product Designer",
  period: "Nov 2023 – present",
  // Punchy line for the card, a compression of the summary below (strategy and UX vision defined, design delivery led).
  headline: "Logistics SaaS, from strategy to delivery.",
  summary: "Partnered with executive stakeholders to define product strategy and UX vision for a logistics SaaS and mobile platform. Led design delivery with 7 developers and mentored 2 designers.",
  metrics: [
    { value: "+40", unit: "%", label: "Courier route efficiency", how: "Research, workflow mapping and usability testing.", kind: "percent" as const, magnitude: 40, direction: "up" as const },
    { value: "+31", unit: "%", label: "Task success", how: "User interviews, journey mapping, rapid prototyping and iterative testing.", kind: "percent" as const, magnitude: 31, direction: "up" as const },
    { value: "−60", unit: "%", label: "Design-to-development handoff", how: "The company’s first design system: 32 unique components and 8 reusable patterns.", kind: "percent" as const, magnitude: 60, direction: "down" as const },
    { value: "−71", unit: "%", label: "Engineering rework", how: "Design delivery with 7 developers, from first spec through post-launch optimisation.", kind: "percent" as const, magnitude: 71, direction: "down" as const },
  ],
};

// How AI fits into the practice. Generic best practice (owner answer 3): no invented case or artifact.
// Ten stages, owner order (2026-11-12). The one figure is the owner's own (aiImpact below).
export const aiWorkflow = [
  {
    stage: "Problem",
    ai: "Pressure-tests the brief: surfaces assumptions, missing context and the questions I should ask before any design starts.",
    me: "I talk to the people involved, decide which problem is worth solving and agree how we will know it worked.",
    out: "Problem statement and success measures",
  },
  {
    stage: "Research synthesis",
    ai: "Clusters interview notes, support tickets and survey answers into draft themes, pulls candidate quotes and flags where sources disagree.",
    me: "I read the raw sources, check every theme against the evidence, and decide which problems matter to the business. Client data stays in tools the client has approved.",
    out: "Insight map with every quote traceable to its source",
  },
  {
    stage: "Exploring ideas",
    ai: "Widens the option space: alternative flows, edge cases, and the strongest argument against the direction I’m leaning towards.",
    me: "I choose which directions are worth prototyping, weighing strategy, constraints and what the team can ship.",
    out: "Two or three directions with explicit trade-offs",
  },
  {
    stage: "Judgement",
    ai: "Lines each option up against the research and the success measures, and points out gaps in my reasoning.",
    me: "I make the call, refine the direction with what the evidence shows and write down why. Nothing gets built before this.",
    out: "Chosen direction with the reasons behind it",
  },
  {
    stage: "Prototyping",
    ai: "Turns flows into working coded prototypes with realistic data, so tests run on something that behaves like the product.",
    me: "I decide what to test and at what fidelity.",
    out: "Testable prototype and a test plan",
  },
  {
    stage: "Testing",
    ai: "Drafts test scripts and tasks, transcribes sessions and groups what people said and did into draft findings.",
    me: "I run the sessions, read the raw results and decide what they mean for the design.",
    out: "Findings ranked by impact",
  },
  {
    stage: "Specs and documentation",
    ai: "Drafts the brief, acceptance criteria, state and edge-case lists, and keeps component documentation in step with the designs.",
    me: "I review them with engineering and own the final spec. Nothing ships on an unreviewed draft.",
    out: "Living spec engineers can build from",
  },
  {
    stage: "Design system",
    ai: "Checks new screens against existing components and tokens, flags one-off styles and drafts usage notes for whatever changes.",
    me: "I decide what becomes a component or a pattern and what stays a one-off, and I own the naming and the tokens.",
    out: "Components and tokens engineers reuse",
  },
  {
    stage: "QA",
    ai: "Checks builds against the spec: missing states, copy, and accessibility basics such as contrast, labels and focus order.",
    me: "I set severity, decide what blocks release and sign off.",
    out: "Prioritised issue list and release sign-off",
  },
  {
    stage: "Iteration",
    ai: "Reads usage data, feedback and support tickets after release and suggests what to fix or try next.",
    me: "I decide what is worth another round. Then the loop starts again from the problem.",
    out: "Next priorities, fed back into the problem",
  },
];

// Side figures next to the workflow (owner, 2026-11-10). TODO(owner): the baseline for 60–70% (faster than the same
// work done without AI? measured on which tasks?) so the label can say it.
export const aiImpact = [
  { kind: "AI", figure: "60–70%", label: "faster execution with AI", note: "AI reduces repetitive work." },
  { kind: "Human", figure: "", label: "Better decisions and outcomes", note: "Humans increase high-value impact." },
];


// Exploration (owner, 2026-10-26): images, animations and prototypes, shown after Clients. Each item carries only what
// the owner gave. The section ships only once it holds 3+ items (owner); until then it shows in dev only.
// `embed`: an animation file in public/exploration/, played inline (once, then it rests). `href`: a prototype link.
export const explorations: { title: string; kind: string; year: string; embed?: string; href?: string; bare?: boolean; contained?: boolean }[] = [
  {
    title: "ZiiP loading state",
    kind: "Animation",
    year: "2024",
    embed: "/exploration/ziip-loading.html?embed",
  },
  {
    // Rebuilt from the owner's Figma file "Paywall" (frame "Flow animation (happy path)"). Year: 2026 is read from the
    // dates in the screens (Nov 11 and Nov 13, a Wednesday and a Friday in 2026); the owner has not confirmed it yet.
    title: "Paywall for Fit Coach",
    kind: "Paywall flow",
    year: "2026",
    // Same frame and inset screen as the ZiiP tile (owner, 2026-11-12); the phone sits centred inside it. `bare`/`&fill` are no longer used.
    embed: "/exploration/paywall-flow.html?embed",
    contained: true, // a phone screen inside the tile: the container gets a tinted background (owner, 2026-11-12)
  },
];
// Shown in production with two items: the owner said "Publish everything" on 2026-11-12, which overrides the earlier "wait for 3+ items" rule (rules/visual.md).
export const showExploration = true;
