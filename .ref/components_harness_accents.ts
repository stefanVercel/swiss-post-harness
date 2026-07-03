/**
 * Light-theme accents for the /harness explainer.
 *
 * The harness route uses the global Transfermarkt `--tm-*` light palette. These
 * are the per-persona accent colours (drawn straight from the brand tokens) used
 * to colour-code the three audiences across the convergence diagram and the
 * interactive run. No dark values live here.
 */

export interface Accent {
  /** Solid accent — carries white text or draws lines/borders. */
  readonly color: string;
  /** Low-chroma wash — sits under text, never carries it. */
  readonly soft: string;
}

export const PERSONA_ACCENT: Record<string, Accent> = {
  fan: { color: "var(--tm-blue)", soft: "var(--tm-accent-soft)" },
  scout: { color: "var(--tm-red)", soft: "#fdecec" },
  internal: { color: "#1c7d1c", soft: "#e9f4e9" },
};

/** The "future agents" placeholder — neutral, dashed, deliberately quiet. */
export const FUTURE_ACCENT: Accent = {
  color: "var(--tm-text-muted)",
  soft: "var(--tm-table-header-bg)",
};
