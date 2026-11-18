// Story types for the community Astro framework, which exports the renderer but not Meta or StoryObj.
// Props are read from the component's own signature, so args are still checked against it.
import type { AstroRenderer } from "@storybook-astro/framework";
import type { ComponentAnnotations, StoryAnnotations } from "storybook/internal/types";

// The Astro framework also accepts `slots` as an arg (slot name to markup).
type Slots = { slots?: Record<string, unknown> };
type PropsOf<C> = C extends (props: infer P, ...rest: any[]) => any ? P : Record<string, unknown>;

export type Meta<C = unknown> = ComponentAnnotations<AstroRenderer, PropsOf<C> & Slots> & { component?: C };
export type StoryObj<M = unknown> = StoryAnnotations<AstroRenderer, (M extends { component?: infer C } ? PropsOf<C> : Record<string, unknown>) & Slots>;
