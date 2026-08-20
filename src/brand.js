/* =====================================================================
   Constructor brand tokens.
   Source: Brand_Identity_Style_Guide.pdf, chapter 1 (Corporate colors,
   Corporate font). The guide states that the ALTERNATIVE WEB COLORS are
   required on web for WCAG compliance — so this app uses those values,
   not the Pantone/print set.
   ===================================================================== */

export const C = {
  // Main
  blue: "#00B2FF",       // Blue
  navy: "#00204D",       // Navy Blue
  red: "#EB1700",        // Diversity Red
  // Accent
  confident: "#01388C",  // Confident Blue
  yellow: "#FFC700",     // Yellow
  green: "#00D19E",      // Green
  // Neutral
  ink: "#141414",        // Black
  paper: "#F9F9F9",      // Light Grey
  // Derived neutrals (not in the guide — tints of the brand neutrals,
  // kept here so no component invents its own grey).
  rule: "#D9E1EC",
  muted: "#5B6B82",
  white: "#FFFFFF",
}

/* Tints used for status surfaces. Each pairs with a dark foreground that
   clears 4.5:1 against it. */
export const TONE = {
  info:    { bg: "#E6F6FF", fg: "#01388C", bd: "#B8E4FF" },
  good:    { bg: "#E2FAF3", fg: "#00654C", bd: "#A8EFDA" },
  warn:    { bg: "#FFF6D9", fg: "#7A5A00", bd: "#FFE494" },
  stop:    { bg: "#FDECE9", fg: "#A81000", bd: "#FBC9C1" },
  neutral: { bg: "#F1F4F9", fg: "#5B6B82", bd: "#D9E1EC" },
  vip:     { bg: "#EDF1FA", fg: "#00204D", bd: "#C5D3EC" },
}

export const TAGLINE = "Constructing the future"
