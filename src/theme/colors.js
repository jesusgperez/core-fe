// Central color palette — edit here to change colors site-wide.
// Tailwind reads this file via tailwind.config.js.
// Components use the Tailwind class names generated from these values.
// To override a specific component, pass explicit classes (e.g. via customStyles).

export const colors = {
  // Brand
  primary:    "#2563EB",
  secondary:  "#25EBAD",
  terciary:   "#EBAD25",
  cuaternary: "#EB2563",
  selection:  "#6b95f1",
  analogous:  "#25c6eb",

  // Semantic / status
  success:    "#4ade80",  // green — confirm/continue actions
  danger:     "#ef4444",  // red   — error text, destructive actions
  warning:    "#fed7aa",  // orange — close / caution actions
  disabled:   "#d1d5db",  // gray-300 — disabled button background
  muted:      "#6b7280",  // gray-500 — disabled button text
}
