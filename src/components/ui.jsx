/* Shared UI — every visual primitive in one place so the brand stays
   consistent. Colors come from src/brand.js (the WCAG web palette). */

import React, { useMemo } from "react"
import { C, TONE } from "../brand.js"
import { qrMatrix } from "../lib/qr.js"

export function Pill({ children, tone = "info", className = "" }) {
  const t = TONE[tone] || TONE.info
  return (
    <span
      className={"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide " + className}
      style={{ backgroundColor: t.bg, color: t.fg, border: `1px solid ${t.bd}` }}
    >
      {children}
    </span>
  )
}

export function Card({ children, className = "", tone, onClick, as }) {
  const Tag = as || (onClick ? "button" : "div")
  const t = tone ? TONE[tone] : null
  return (
    <Tag
      onClick={onClick}
      className={
        "block w-full rounded-xl2 bg-white p-5 text-left shadow-card " +
        (onClick ? "transition hover:-translate-y-0.5 hover:shadow-pop " : "") +
        className
      }
      style={{ border: `1px solid ${t ? t.bd : C.rule}`, ...(t ? { backgroundColor: t.bg } : {}) }}
    >
      {children}
    </Tag>
  )
}

export function SectionTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold leading-tight" style={{ color: C.navy }}>{children}</h2>
      {sub && <p className="mt-1 text-sm" style={{ color: C.muted }}>{sub}</p>}
    </div>
  )
}

export function Label({ children }) {
  return (
    <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest" style={{ color: C.confident }}>
      {children}
    </span>
  )
}

export const inputCls =
  "w-full rounded-lg bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#00B2FF]"
export const inputStyle = { border: `1px solid ${C.rule}`, color: C.ink }

export function Btn({ children, kind = "primary", className = "", ...rest }) {
  const styles = {
    primary: { backgroundColor: C.navy, color: "#fff" },
    blue: { backgroundColor: C.confident, color: "#fff" },
    ghost: { backgroundColor: "#fff", color: C.navy, border: `1px solid ${C.rule}` },
    danger: { backgroundColor: C.red, color: "#fff" },
    yellow: { backgroundColor: C.yellow, color: C.ink },
  }[kind]
  return (
    <button
      className={
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition hover:opacity-90 active:scale-[0.99] disabled:opacity-40 " +
        className
      }
      style={styles}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Rule({ className = "" }) {
  return <hr className={"border-0 " + className} style={{ height: 1, backgroundColor: C.rule }} />
}

export function KV({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="shrink-0 text-xs font-semibold" style={{ color: C.muted }}>{k}</span>
      <span className="text-right text-sm font-medium" style={{ color: C.ink }}>{v}</span>
    </div>
  )
}

export function QR({ text, size = 120 }) {
  const m = useMemo(() => qrMatrix(text), [text])
  if (!m) return <div className="text-xs" style={{ color: C.muted }}>Link too long to encode</div>
  const n = m.length, q = 2, total = n + q * 2
  const rects = []
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (m[r][c]) rects.push(<rect key={r + "-" + c} x={c + q} y={r + q} width={1} height={1} fill={C.navy} />)
  return (
    <svg viewBox={`0 0 ${total} ${total}`} width={size} height={size} shapeRendering="crispEdges" role="img" aria-label="QR code">
      <rect x="0" y="0" width={total} height={total} fill="#fff" />
      {rects}
    </svg>
  )
}

/* The wordmark. The real logotype is a protected asset — we set the name
   in the corporate typeface with the tagline, which the guidelines allow
   for internal digital surfaces, rather than redrawing the logomark. */
export function Wordmark({ dark = false, sub = "Travel & Concierge" }) {
  return (
    <div className="leading-none">
      <div className="text-lg font-black tracking-tight" style={{ color: dark ? "#fff" : C.navy }}>
        constructor
      </div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: dark ? "#7FD4FF" : C.confident }}>
        {sub}
      </div>
    </div>
  )
}

export function Empty({ icon: Icon, title, body, children }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl2 border border-dashed px-6 py-12 text-center" style={{ borderColor: C.rule }}>
      {Icon && <Icon size={28} style={{ color: C.muted }} />}
      <div className="text-sm font-bold" style={{ color: C.navy }}>{title}</div>
      {body && <p className="max-w-sm text-sm" style={{ color: C.muted }}>{body}</p>}
      {children}
    </div>
  )
}

/* Numbered process step, matching the process-map look. */
export function Step({ n, title, body, tone }) {
  const stop = tone === "stop"
  return (
    <div className="flex gap-3">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
        style={{ backgroundColor: stop ? C.red : C.confident }}
      >
        {n}
      </div>
      <div className="pb-4">
        <div className="text-sm font-bold" style={{ color: stop ? "#A81000" : C.navy }}>{title}</div>
        <p className="mt-0.5 text-sm leading-relaxed" style={{ color: C.muted }}>{body}</p>
      </div>
    </div>
  )
}

export function Banner({ tone = "info", icon: Icon, title, children }) {
  const t = TONE[tone]
  return (
    <div className="rounded-xl2 p-4" style={{ backgroundColor: t.bg, border: `1px solid ${t.bd}` }}>
      <div className="flex items-start gap-3">
        {Icon && <Icon size={18} className="mt-0.5 shrink-0" style={{ color: t.fg }} />}
        <div>
          {title && <div className="text-sm font-bold" style={{ color: t.fg }}>{title}</div>}
          {children && <div className="mt-0.5 text-sm leading-relaxed" style={{ color: t.fg }}>{children}</div>}
        </div>
      </div>
    </div>
  )
}
