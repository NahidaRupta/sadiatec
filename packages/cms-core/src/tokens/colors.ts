export const neutralScale = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
  950: "#020617",
} as const

export const semanticColors = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  text: "var(--color-text)",
  muted: "var(--color-muted)",
  error: "var(--color-error)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
} as const

export const colors = {
  neutral: neutralScale,
  ...semanticColors,
} as const
