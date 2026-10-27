import React, { useEffect, useMemo } from "react"
import { Printer, ArrowLeft } from "lucide-react"
import { C } from "../brand.js"
import { useStore } from "../lib/store.js"
import { POLICY_VERSION } from "../lib/policy.js"
import { MODES, PARTNER_SECTIONS, PRACTICAL_FACTS, RELOCATION_FACTS, forAudience } from "../data/packSections.js"
import { perDiemFor } from "../data/perdiem.js"
import { QR } from "../components/ui.jsx"
import { useCityImage } from "../lib/live.js"

/* The downloadable pack. One printable page-flow per city and audience,
   rendered from the same records as the app, so it can never drift from
   what the screen shows. "Download PDF" = the browser's own Save-as-PDF:
   no library, no server, works on a static host, and the result is a
   real vector PDF with selectable text and clickable sources.

   Two audiences, decided by the registry in data/packSections.js:
   visiting packs skip the relocation layer entirely; relocation packs
   skip offsite/event suppliers. */

const A4 = { maxWidth: "190mm" }

function PrintPhoto({ title, caption }) {
  const img = useCityImage(title)
  if (!img?.thumb) return null
  return (
    <figure className="float-right ml-3 mb-1 w-[58mm]" style={{ breakInside: "avoid" }}>
      <img src={img.thumb} alt={caption || title} className="w-full rounded" style={{ maxHeight: "42mm", objectFit: "cover" }} />
      <figcaption className="text-[8.5px]" style={{ color: C.muted }}>{caption} · Wikipedia</figcaption>
    </figure>
  )
}

function H2({ children }) {
  return (
    <h2 className="mt-6 mb-2 text-[13px] font-black uppercase tracking-[0.12em]" style={{ color: C.confident, breakAfter: "avoid" }}>
      {children}
    </h2>
  )
}

function Row({ a, b, c }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b py-1.5 text-[11.5px]" style={{ borderColor: C.rule, breakInside: "avoid" }}>
      <span className="font-semibold" style={{ color: C.ink }}>{a}{c ? <span className="font-normal" style={{ color: C.muted }}> — {c}</span> : null}</span>
      {b && <span className="shrink-0 text-right" style={{ color: C.muted }}>{b}</span>}
    </div>
  )
}

export default function PackPrint({ city, mode }) {
  const s = useStore()
  const d = s.cities[city]
  const modeDef = MODES.find(([k]) => k === mode) || MODES[0]
  const auto = !window.location.hash.includes("noprint")

  useEffect(() => {
    document.title = `${city} — ${modeDef[1]} pack · Constructor`
    if (!auto) return
    const t = setTimeout(() => window.print(), 900)
    return () => clearTimeout(t)
  }, [city, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Sources are numbered in document order — collected up front, so the
     list at the end can never miss a footnote. */
  const sources = useMemo(() => {
    const list = []
    const add = (items) => (items || []).forEach((it) => { if (it.src && !list.includes(it.src)) list.push(it.src) })
    if (d) {
      if (mode === "relocate") RELOCATION_FACTS.forEach((def) => add(d.relocation?.[def.key]))
      PRACTICAL_FACTS.forEach((def) => add(d.practical?.[def.key]))
    }
    return { list, idx: (url) => (url ? list.indexOf(url) + 1 : null) }
  }, [d, mode])

  if (!d) {
    return (
      <div className="p-10 text-sm" style={{ color: C.muted }}>
        No pack exists for "{city}". <a href="#/" style={{ color: C.confident }}>Back to the app</a>
      </div>
    )
  }

  const partner = forAudience(PARTNER_SECTIONS, mode)
  const filled = partner.filter((p) => (d[p.key] || []).length > 0)
  const pending = partner.filter((p) => (d[p.key] || []).length === 0)
  const cp = d.countryProfile
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

  const Facts = ({ defs, data }) => (
    <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {defs.map((def) => {
        const items = data?.[def.key] || []
        return (
          <div key={def.key} style={{ breakInside: "avoid" }}>
            <div className="text-[11px] font-black" style={{ color: C.navy }}>{def.title}</div>
            {items.length === 0 ? (
              <div className="text-[10.5px] italic" style={{ color: C.muted }}>Being verified — not yet in the pack.</div>
            ) : (
              <ul className="mt-0.5 space-y-1">
                {items.map((it, i) => (
                  <li key={i} className="text-[11px] leading-snug" style={{ color: C.ink }}>
                    {it.text}
                    {it.live && <span className="ml-1 font-bold" style={{ color: C.confident }}>→ {it.live}</span>}
                    {it.src && <sup className="ml-0.5 font-bold" style={{ color: C.confident }}>{sources.idx(it.src)}</sup>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Screen-only toolbar */}
      <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 px-5 py-3" style={{ backgroundColor: C.navy }}>
        <a href="#/" className="inline-flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white"><ArrowLeft size={15} /> Back to the app</a>
        <div className="text-xs" style={{ color: "#9FB6D4" }}>In the print dialog choose <b className="text-white">Save as PDF</b>. A4, portrait.</div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black" style={{ backgroundColor: C.blue, color: C.navy }}>
          <Printer size={15} /> Save as PDF
        </button>
      </div>

      <div className="mx-auto px-6 py-8" style={A4}>
        {/* Masthead */}
        <div className="flex items-end justify-between border-b-4 pb-3" style={{ borderColor: C.navy }}>
          <div>
            <div className="text-xl font-black leading-none" style={{ color: C.navy }}>constructor</div>
            <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: C.confident }}>Travel &amp; Concierge</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: C.muted }}>{modeDef[1]} pack</div>
            <div className="text-[10px]" style={{ color: C.muted }}>Generated {today}</div>
          </div>
        </div>

        <h1 className="mt-5 text-3xl font-black leading-tight" style={{ color: C.navy }}>{city}</h1>
        <div className="text-sm font-semibold" style={{ color: C.confident }}>{d.country} · {modeDef[2]}</div>
        <p className="mt-3 text-[12px] leading-relaxed" style={{ color: C.ink }}>{d.intro}</p>

        {/* At a glance */}
        <H2>At a glance</H2>
        <div className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
          <Row a="Emergency" b={`${d.emergency}${d.police ? ` · Police ${d.police}` : ""}`} />
          <Row a="Currency" b={`${d.currencyName} (${d.currency})`} />
          <Row a="Time zone" b={d.tz} />
          <Row a="Language" b={d.language} />
          <Row a="Plugs" b={d.plugs} />
          <Row a="Water" b={d.water} />
          {(() => { const pd = perDiemFor(d.country); return pd.known
            ? <Row a="Per diem (company rate)" b={pd.rate != null ? `${pd.rate} ${pd.currency}/day` : "Rate pending — concierge@constructor.org"} />
            : null })()}
          {(d.essentials || []).filter((r) => !["currency", "emergency", "time zone", "language", "plugs", "water"].includes(String(r[0]).toLowerCase())).map((r, i) => <Row key={i} a={r[0]} b={r[1]} />)}
        </div>

        {mode === "relocate" && (
          <>
            <H2>Your first ninety days — in order</H2>
            <ol className="space-y-2.5">
              {RELOCATION_FACTS.map((def, i) => {
                const items = d.relocation?.[def.key] || []
                return (
                  <li key={def.key} className="flex gap-2.5" style={{ breakInside: "avoid" }}>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ backgroundColor: C.navy }}>{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11.5px] font-black" style={{ color: C.navy }}>{def.title}</div>
                      {items.length === 0 ? (
                        <div className="text-[10.5px] italic" style={{ color: C.muted }}>Being verified — not yet in the pack.</div>
                      ) : items.map((it, j) => (
                        <div key={j} className="text-[11px] leading-snug" style={{ color: C.ink }}>
                          {it.text}
                          {it.live && <span className="ml-1 font-bold" style={{ color: C.confident }}>→ {it.live}</span>}
                          {it.src && <sup className="ml-0.5 font-bold" style={{ color: C.confident }}>{sources.idx(it.src)}</sup>}
                        </div>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ol>
          </>
        )}

        <H2>Practical — what goes wrong on day one</H2>
        <Facts defs={PRACTICAL_FACTS} data={d.practical} />

        <H2>Getting around</H2>
        {(d.transport || []).map(([label, url], i) => (
          <Row key={i} a={label} b={url.replace(/^https?:\/\//, "")} />
        ))}
        {d.transfers.length > 0 && (
          <>
            <div className="mt-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: C.muted }}>Partner transfer rate card — fixed, billed to the entity</div>
            {d.transfers.map((t, i) => <Row key={i} a={t[0]} b={t[1]} c={t[2]} />)}
          </>
        )}

        {d.hotels.length > 0 && (
          <>
            <H2>{mode === "relocate" ? "Where to stay while you settle" : "Where to stay"}</H2>
            {d.hotels.map((h, i) => (
              <div key={i} className="mb-2" style={{ breakInside: "avoid" }}>
                <div className="text-[11.5px] font-black" style={{ color: C.navy }}>{h.name}</div>
                <div className="text-[10.5px]" style={{ color: C.muted }}>{[h.area, h.address, h.addressLocal, h.url && h.url.replace(/^https?:\/\//, "")].filter(Boolean).join(" · ")}</div>
                {h.note && <div className="text-[10.5px]" style={{ color: C.ink }}>{h.note}</div>}
                {(h.near || []).length > 0 && (
                  <div className="mt-0.5 text-[10.5px]" style={{ color: C.muted }}>
                    Nearby: {h.near.map((p) => `${p[0]} (${p[2] === 0 ? "in-house" : `${p[2]} min`})`).join(" · ")}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {filled.length > 0 && (
          <>
            <H2>Partner network</H2>
            <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {filled.map((def) => (
                <div key={def.key} style={{ breakInside: "avoid" }}>
                  <div className="text-[11px] font-black" style={{ color: C.navy }}>{def.title}</div>
                  {d[def.key].map((r, i) => (
                    def.cols.length === 3 ? <Row key={i} a={r[0]} b={r[1]} c={r[2]} /> : <Row key={i} a={r[0]} b={r[1]} />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {d.offers.length > 0 && (
          <>
            <H2>Offers &amp; codes</H2>
            <div className="grid gap-3 sm:grid-cols-2">
              {d.offers.map((o) => (
                <div key={o.code} className="flex items-start gap-3 rounded-lg p-2.5" style={{ border: `1px solid ${C.rule}`, breakInside: "avoid" }}>
                  <QR text={o.code} size={64} />
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-black" style={{ color: C.navy }}>{o.name} <span className="font-normal" style={{ color: C.muted }}>· {o.cat}</span></div>
                    <div className="text-[11px]" style={{ color: C.ink }}>{o.offer}</div>
                    <div className="text-[10px]" style={{ color: C.muted }}>{o.how}</div>
                    <div className="font-mono text-[10.5px] font-bold" style={{ color: C.confident }}>{o.code}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {pending.length > 0 && (
          <p className="mt-4 rounded-lg px-3 py-2 text-[10.5px] leading-snug" style={{ backgroundColor: C.paper, color: C.muted, breakInside: "avoid" }}>
            <b>Being negotiated for {city}:</b> {pending.map((p) => p.title.toLowerCase()).join(" · ")}. These appear in the app the moment a partner is signed — nothing is listed until it is real.
          </p>
        )}

        {d.wallet && (d.wallet.hotelLocal || d.wallet.driver?.phone || d.wallet.fixedFare || d.wallet.insurance) && (
          <>
            <H2>Offline wallet card</H2>
            {d.wallet.hotelLocal && <Row a="Hotel address, local script" b={d.wallet.hotelLocal} />}
            {d.wallet.driver?.phone && <Row a={d.wallet.driver.name || "Driver / dispatch"} b={d.wallet.driver.phone} />}
            {d.wallet.fixedFare && <Row a="Fixed fares" b={d.wallet.fixedFare} />}
            {d.wallet.insurance && <Row a="Insurance" b={d.wallet.insurance} />}
          </>
        )}

        {(d.places || []).length > 0 && (
          <>
            <H2>Places to visit</H2>
            <div className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
              {d.places.map(([name, note], i) => (
                <div key={i} className="text-[11px] leading-snug" style={{ breakInside: "avoid" }}>
                  <span className="font-black" style={{ color: C.navy }}>{i + 1}. {name}</span>{" "}
                  <span style={{ color: C.muted }}>{note}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {cp && (
          <>
            <H2>{d.country} — geography, history, culture</H2>
            {["geography", "history", "culture"].map((k) => (
              <div key={k} className="mb-3" style={{ overflow: "hidden" }}>
                <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: C.muted }}>{k}</div>
                {cp.images?.[k] && <PrintPhoto title={cp.images[k][0]} caption={cp.images[k][1]} />}
                {cp[k].map((t, i) => <p key={i} className="mt-1 text-[11px] leading-relaxed" style={{ color: C.ink }}>{t}</p>)}
              </div>
            ))}
          </>
        )}

        {(d.history || []).length > 0 && (
          <>
            <H2>{city} — the city's story</H2>
            {d.history.map((t, i) => <p key={i} className="mb-1.5 text-[11px] leading-relaxed" style={{ color: C.ink }}>{t}</p>)}
          </>
        )}

        {sources.list.length > 0 && (
          <>
            <H2>Sources</H2>
            <ol className="space-y-0.5">
              {sources.list.map((u, i) => (
                <li key={u} className="break-all text-[9.5px] leading-snug" style={{ color: C.muted }}>
                  <span className="font-bold" style={{ color: C.confident }}>{i + 1}.</span>{" "}
                  <a href={u} style={{ color: C.muted }}>{u}</a>
                </li>
              ))}
            </ol>
          </>
        )}

        <div className="mt-8 border-t pt-3 text-[9.5px] leading-snug" style={{ borderColor: C.rule, color: C.muted }}>
          {d.owner} · pack content last updated {d.updatedAt} · facts verified against the linked sources at the date shown; figures that change (prices, fares, fees) are not printed — the numbered source is the live page.
          Rules derived from the {POLICY_VERSION}; where this pack differs from the policy, the policy governs.
          The concierge team informs and routes — it never approves and never books. Sightseeing notes are general
          recommendations, not endorsements. <span className="font-bold uppercase tracking-[0.18em]" style={{ color: C.navy }}>Constructing the future</span>
        </div>
      </div>

      <style>{`
        @page { size: A4 portrait; margin: 14mm 12mm; }
        @media print {
          html, body { background: #fff !important; }
          a { text-decoration: none; }
          h1, h2 { break-after: avoid; }
        }
      `}</style>
    </div>
  )
}
