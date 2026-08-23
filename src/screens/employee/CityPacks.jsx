import React, { useState } from "react"
import {
  MapPin, Car, Stethoscope, Baby, Utensils, Info, Bed, Dumbbell, CloudSun,
  ChevronRight, BookOpen, Landmark, Coins, Clock, ExternalLink, Wind, Droplets,
  Plug, Languages, GlassWater, Siren, FileDown, Compass, Globe2, Wrench, Package, CheckCircle2, Link as LinkIcon,
} from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { RATE_CURRENCIES } from "../../data/cities.js"
import { MODES, PARTNER_SECTIONS, PRACTICAL_FACTS, RELOCATION_FACTS, forAudience } from "../../data/packSections.js"
import { useWeather, useRates, useCityImage, useLocalTime, convert, fmtRate } from "../../lib/live.js"
import { Card, Pill, SectionTitle, Label, Banner, DesignatedArea } from "../../components/ui.jsx"

const NEAR_ICON = { Food: Utensils, Shop: MapPin, Health: Stethoscope, Work: Info, Move: Dumbbell, Transport: Car, Service: Info, Wellbeing: Dumbbell }

function TwoCol({ rows }) {
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold" style={{ color: C.ink }}>{r[0]}</span>
          <span className="text-right text-xs" style={{ color: C.muted }}>{r[1]}</span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero — real photo (Wikipedia lead image), local time, live temp    */
/* ------------------------------------------------------------------ */

function CityHero({ name, d }) {
  const img = useCityImage(d.wikiTitle)
  const wx = useWeather(d.lat, d.lon)
  const time = useLocalTime(d.tz)
  return (
    <div className="relative overflow-hidden rounded-xl2 shadow-card" style={{ backgroundColor: C.navy, minHeight: 220 }}>
      {img?.src && (
        <img src={img.src} alt={`${name} — city view`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,32,77,0.92) 0%, rgba(0,32,77,0.35) 55%, rgba(0,32,77,0.15) 100%)" }} />
      <div className="relative flex min-h-[220px] flex-col justify-end p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Pill tone="info">{d.tag}</Pill>
            <h3 className="mt-2 text-3xl font-black text-white">{name}</h3>
            <div className="text-sm font-semibold" style={{ color: "#BFE4FF" }}>{d.country}</div>
          </div>
          <div className="flex items-center gap-3">
            {time && (
              <div className="rounded-lg px-3 py-2 text-right backdrop-blur" style={{ backgroundColor: "rgba(255,255,255,0.14)" }}>
                <div className="flex items-center gap-1.5 text-lg font-black text-white"><Clock size={15} /> {time}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#BFE4FF" }}>local time</div>
              </div>
            )}
            {wx && (
              <div className="rounded-lg px-3 py-2 text-right backdrop-blur" style={{ backgroundColor: "rgba(255,255,255,0.14)" }}>
                <div className="flex items-center gap-1.5 text-lg font-black text-white"><CloudSun size={15} /> {wx.temp}°</div>
                <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#BFE4FF" }}>{wx.label}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {img?.page && (
        <a href={img.page} target="_blank" rel="noreferrer" className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-semibold text-white/70 backdrop-blur hover:text-white" style={{ backgroundColor: "rgba(0,32,77,0.4)" }}>
          Photo: Wikipedia
        </a>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Live weather card                                                  */
/* ------------------------------------------------------------------ */

function WeatherCard({ d }) {
  const wx = useWeather(d.lat, d.lon)
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
          <CloudSun size={15} style={{ color: C.confident }} /> Weather now
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.green }}>● live</span>
      </div>
      {wx === null && <div className="py-4 text-center text-xs" style={{ color: C.muted }}>Loading current conditions…</div>}
      {wx === undefined && <div className="py-4 text-center text-xs" style={{ color: C.muted }}>Weather is unavailable right now — check again once you're online.</div>}
      {wx && (
        <>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-black" style={{ color: C.navy }}>{wx.temp}°C</div>
              <div className="text-sm font-semibold" style={{ color: C.muted }}>{wx.label} · feels like {wx.feels}°</div>
            </div>
            <div className="space-y-1 text-right text-xs" style={{ color: C.muted }}>
              <div className="flex items-center justify-end gap-1"><Wind size={12} /> {wx.wind} km/h</div>
              <div className="flex items-center justify-end gap-1"><Droplets size={12} /> {wx.humidity}%</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 border-t pt-3" style={{ borderColor: C.rule }}>
            {wx.days.slice(0, 4).map((day, i) => (
              <div key={day.date} className="text-center">
                <div className="text-[10px] font-bold uppercase" style={{ color: C.muted }}>
                  {i === 0 ? "Today" : new Date(day.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short" })}
                </div>
                <div className="mt-0.5 text-sm font-black" style={{ color: C.navy }}>{day.max}°</div>
                <div className="text-xs" style={{ color: C.muted }}>{day.min}°</div>
                {day.rain != null && day.rain > 20 && <div className="text-[9px] font-semibold" style={{ color: C.confident }}>{day.rain}% rain</div>}
              </div>
            ))}
          </div>
          <div className="mt-2 text-right text-[9px]" style={{ color: C.muted }}>Open-Meteo · updates every 30 min</div>
        </>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Currency card — local vs EUR / USD / CHF / TRY, live               */
/* ------------------------------------------------------------------ */

function CurrencyCard({ d }) {
  const fx = useRates()
  const local = d.currency
  const others = RATE_CURRENCIES.filter((c) => c !== local)
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
          <Coins size={15} style={{ color: C.confident }} /> {d.currencyName} ({local})
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.green }}>● live</span>
      </div>
      {fx === null && <div className="py-4 text-center text-xs" style={{ color: C.muted }}>Loading exchange rates…</div>}
      {fx === undefined && <div className="py-4 text-center text-xs" style={{ color: C.muted }}>Rates are unavailable right now.</div>}
      {fx && (
        <>
          <div className="space-y-2">
            {others.map((cur) => (
              <div key={cur} className="flex items-baseline justify-between border-b pb-2 last:border-0" style={{ borderColor: C.rule }}>
                <span className="text-sm font-semibold" style={{ color: C.ink }}>1 {cur}</span>
                <span className="text-sm font-black" style={{ color: C.confident }}>{fmtRate(convert(fx, cur, local))} {local}</span>
              </div>
            ))}
            {local !== "EUR" && (
              <div className="flex items-baseline justify-between rounded-lg px-2 py-1.5" style={{ backgroundColor: C.paper }}>
                <span className="text-xs font-semibold" style={{ color: C.muted }}>100 {local}</span>
                <span className="text-xs font-black" style={{ color: C.navy }}>{fmtRate(100 * (convert(fx, local, "EUR") ?? 0))} EUR</span>
              </div>
            )}
          </div>
          <div className="mt-2 text-right text-[9px]" style={{ color: C.muted }}>
            {fx.updated ? `Rates: ${fx.updated.slice(0, 16)}` : "Daily reference rates"} · indicative, not a trading rate
          </div>
        </>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared renderers for registry-driven content                       */
/* ------------------------------------------------------------------ */

/* Researched items: { text, src }[] — every line shows where it came from. */
function FactList({ items, emptyTitle }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg px-3 py-2.5 text-xs leading-relaxed" style={{ backgroundColor: C.paper, color: C.muted }}>
        {emptyTitle || "Being verified"} — the concierge team adds this once it has been checked against an official source. Nothing is invented to fill the gap.
      </div>
    )
  }
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="text-sm leading-relaxed" style={{ color: C.ink }}>
          {it.text}{" "}
          {it.src && (
            <a href={it.src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-[11px] font-semibold align-baseline" style={{ color: C.confident }}>
              <LinkIcon size={10} /> source
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}

function FactCard({ def, items, emptyTitle }) {
  const Icon = def.icon
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
        <Icon size={15} style={{ color: C.confident }} /> {def.title}
      </div>
      <FactList items={items} emptyTitle={emptyTitle} />
    </Card>
  )
}

function PartnerCard({ def, rows, city }) {
  const Icon = def.icon
  const tuple3 = def.cols.length === 3
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
        <Icon size={15} style={{ color: C.confident }} /> {def.title}
      </div>
      {rows && rows.length > 0 ? (
        <div className="space-y-2.5">
          {rows.map((r, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold" style={{ color: C.ink }}>{r[0]}</span>
                {tuple3 && <span className="shrink-0 text-sm font-black" style={{ color: C.confident }}>{r[1]}</span>}
              </div>
              <div className="text-[11px]" style={{ color: C.muted }}>{tuple3 ? r[2] : r[1]}</div>
            </div>
          ))}
        </div>
      ) : (
        <DesignatedArea icon={Icon} title={`${def.title} — ${city}`} body={def.empty} />
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Sub-pages                                                          */
/* ------------------------------------------------------------------ */

function PackPage({ city, d, mode, family, setFamily, hotelIdx, setHotelIdx }) {
  const sections = forAudience(PARTNER_SECTIONS, mode)
    .filter((s) => s.key !== "transfers")
    .filter((s) => s.key !== "family" || mode === "relocate" || family)
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <WeatherCard d={d} />
        <CurrencyCard d={d} />
      </div>

      {mode === "relocate" && (
        <Card tone="vip">
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <CheckCircle2 size={15} style={{ color: C.confident }} /> Your first ninety days in {city} — in order
          </div>
          <ol className="space-y-3">
            {RELOCATION_FACTS.map((def, i) => (
              <li key={def.key} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white" style={{ backgroundColor: C.navy }}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black" style={{ color: C.navy }}>{def.title}</div>
                  <div className="mt-1"><FactList items={d.relocation?.[def.key]} emptyTitle="Being verified" /></div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Facts on arrival */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Info size={15} style={{ color: C.confident }} /> Good to know
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2.5"><Languages size={14} className="mt-0.5 shrink-0" style={{ color: C.confident }} /><span style={{ color: C.ink }}>{d.language}</span></div>
            <div className="flex items-start gap-2.5"><Plug size={14} className="mt-0.5 shrink-0" style={{ color: C.confident }} /><span style={{ color: C.ink }}>{d.plugs}</span></div>
            <div className="flex items-start gap-2.5"><GlassWater size={14} className="mt-0.5 shrink-0" style={{ color: C.confident }} /><span style={{ color: C.ink }}>{d.water}</span></div>
            <div className="flex items-start gap-2.5"><Siren size={14} className="mt-0.5 shrink-0" style={{ color: C.red }} /><span style={{ color: C.ink }}>Emergency {d.emergency} · Police {d.police}</span></div>
          </div>
          <div className="mt-3 border-t pt-3" style={{ borderColor: C.rule }}>
            <TwoCol rows={d.essentials || []} />
          </div>
        </Card>

        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Car size={15} style={{ color: C.confident }} /> Getting around — official links
          </div>
          <div className="space-y-2">
            {(d.transport || []).map(([label, url], i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50" style={{ border: `1px solid ${C.rule}`, color: C.confident }}>
                {label} <ExternalLink size={13} />
              </a>
            ))}
          </div>
          <div className="mt-3 border-t pt-3" style={{ borderColor: C.rule }}>
            {d.transfers.length > 0 ? (
              <>
                <div className="mb-2 text-xs font-black uppercase tracking-wide" style={{ color: C.confident }}>Partner transfer rates — fixed, billed to the entity</div>
                <div className="space-y-2.5">
                  {d.transfers.map((t, i) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold" style={{ color: C.ink }}>{t[0]}</span>
                        <span className="shrink-0 text-sm font-black" style={{ color: C.confident }}>{t[1]}</span>
                      </div>
                      <div className="text-[11px]" style={{ color: C.muted }}>{t[2]}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <DesignatedArea icon={Car} title="Partner transfer rates"
                body="Fixed airport-transfer prices, billed monthly to the entity, are being negotiated. The rate card appears here when the partner is signed — until then, use the official links above." />
            )}
          </div>
        </Card>
      </div>

      {/* Where to stay */}
      <div>
        <Label>{mode === "relocate" ? "Where to stay while you settle" : "Where to stay"}</Label>
        {d.hotels.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {d.hotels.map((h, i) => (
              <Card key={i} onClick={() => setHotelIdx(hotelIdx === i ? null : i)} className={hotelIdx === i ? "!shadow-pop" : ""}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                      <Bed size={15} style={{ color: C.confident }} /> {h.name}
                    </div>
                    <div className="mt-0.5 text-xs" style={{ color: C.muted }}>{[h.area, h.address].filter(Boolean).join(" · ")}</div>
                    {h.note && <div className="mt-1 text-xs leading-relaxed" style={{ color: C.muted }}>{h.note}</div>}
                  </div>
                  <ChevronRight size={16} className="mt-1 shrink-0" style={{ color: C.blue, transform: hotelIdx === i ? "rotate(90deg)" : "none" }} />
                </div>
                {hotelIdx === i && (h.near || []).length > 0 && (
                  <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: C.rule }}>
                    {h.near.map((p, j) => {
                      const Icon = NEAR_ICON[p[1]] || Info
                      return (
                        <div key={j} className="flex items-start gap-2.5">
                          <Icon size={14} className="mt-0.5 shrink-0" style={{ color: C.confident }} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-sm font-semibold" style={{ color: C.ink }}>{p[0]}</span>
                              <span className="shrink-0 text-[11px] font-bold" style={{ color: C.confident }}>{p[2] === 0 ? "in-house" : `${p[2]} min`}</span>
                            </div>
                            <div className="text-[11px]" style={{ color: C.muted }}>{p[3]}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                {hotelIdx === i && (h.near || []).length === 0 && (
                  <div className="mt-3 border-t pt-3" style={{ borderColor: C.rule }}>
                    <DesignatedArea icon={MapPin} title="What's nearby" body="Walking-distance restaurants, pharmacies, gyms and services around this address are added by the concierge team." />
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <DesignatedArea icon={Bed} title="Accommodation partners"
            body={`Partner hotels and corporate apartments in ${city} — with corporate rates and what's within walking distance of each door — appear here as the concierge team signs them.`} />
        )}
      </div>

      {mode === "visit" && (
        <>
          <button
            onClick={() => setFamily(!family)}
            className="flex w-full items-center justify-between rounded-xl2 px-4 py-3 text-sm font-bold transition"
            style={family
              ? { backgroundColor: "#E6F6FF", color: C.confident, border: `1.5px solid ${C.blue}` }
              : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}
          >
            <span className="flex items-center gap-2"><Baby size={16} /> Family mode — travelling with children</span>
            <span>{family ? "On" : "Off"}</span>
          </button>
          {family && (
            <Banner tone="info" icon={Baby} title="What family mode covers">
              Paediatric care, child seats on transfers and the family layer below. Family passports need the same
              six-month expiry check as yours — children's expire faster.
            </Banner>
          )}
        </>
      )}

      {/* Partner network, by audience */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((def) => (
          <PartnerCard key={def.key} def={def} rows={d[def.key]} city={city} />
        ))}
      </div>
    </>
  )
}

function PracticalPage({ city, d }) {
  return (
    <>
      <Banner tone="info" icon={Wrench} title={`The things that go wrong on day one in ${city}`}>
        Each line was checked against an official or operator source — the link is next to it. If something has
        changed, tell the concierge team and it is corrected for everyone.
      </Banner>
      <div className="grid gap-4 sm:grid-cols-2">
        {PRACTICAL_FACTS.map((def) => (
          <FactCard key={def.key} def={def} items={d.practical?.[def.key]} emptyTitle="Being verified" />
        ))}
      </div>
    </>
  )
}

function CountryPage({ city, d }) {
  const p = d.countryProfile
  const block = (title, Icon, paras) => (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
        <Icon size={15} style={{ color: C.confident }} /> {title}
      </div>
      <div className="space-y-3">
        {(paras || []).map((t, i) => <p key={i} className="text-sm leading-relaxed" style={{ color: C.ink }}>{t}</p>)}
      </div>
    </Card>
  )
  return (
    <>
      {p ? (
        <>
          {block(`${d.country} — geography`, Globe2, p.geography)}
          {block(`${d.country} — history`, Landmark, p.history)}
          {block(`${d.country} — culture & etiquette`, BookOpen, p.culture)}
        </>
      ) : (
        <DesignatedArea icon={Globe2} title="Country profile" body={`A geography, history and culture profile for ${d.country || city} is added by the concierge team.`} />
      )}
      {(d.history || []).length > 0 && block(`${city} — the city's story`, BookOpen, d.history)}
      {(d.funFacts || []).length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {d.funFacts.map((f, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg p-3 text-xs leading-relaxed" style={{ backgroundColor: "#E6F6FF", color: C.confident }}>
              <Landmark size={13} className="mt-0.5 shrink-0" /> {f}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function PlacesPage({ city, d }) {
  const places = d.places || []
  return (
    <>
      <Banner tone="neutral" icon={Compass} title={`Places to visit in ${city}`}>
        General recommendations for a free afternoon or a weekend — well-known sights, not partner venues. Partner
        restaurants and offers are on the Pack and Offers pages.
      </Banner>
      {places.length === 0 ? (
        <DesignatedArea icon={Compass} title="Places to visit" body="Sightseeing suggestions for this city are added by the concierge team." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {places.map(([name, note], i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black" style={{ backgroundColor: "#E6F6FF", color: C.confident }}>{i + 1}</span>
                <div>
                  <div className="text-sm font-black" style={{ color: C.navy }}>{name}</div>
                  <div className="mt-0.5 text-xs leading-relaxed" style={{ color: C.muted }}>{note}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */

const PAGES = [
  ["pack", "Pack", Package],
  ["practical", "Practical", Wrench],
  ["country", "Country & culture", Globe2],
  ["places", "Places to visit", Compass],
]

export default function CityPacks({ user }) {
  const s = useStore()
  const names = Object.keys(s.cities)
  const myTrip = s.trips.find((t) => t.userId === user?.id && t.end >= new Date().toISOString().slice(0, 10))
  const [city, setCity] = useState(myTrip?.city && s.cities[myTrip.city] ? myTrip.city : names[0])
  const [mode, setMode] = useState("visit")
  const [page, setPage] = useState("pack")
  const [hotelIdx, setHotelIdx] = useState(null)
  const [family, setFamily] = useState(Boolean(myTrip?.family))
  const d = s.cities[city]

  const pdfHref = `#/pack/${encodeURIComponent(city)}/${mode}`

  return (
    <div className="space-y-5">
      <SectionTitle sub="One pack per city, two versions: what a visitor needs for a week, and what a colleague needs for a move. Live weather and rates, checked facts with sources, and the partner network as the concierge team signs it.">
        City packs
      </SectionTitle>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {names.map((n) => (
          <button
            key={n}
            onClick={() => { setCity(n); setHotelIdx(null); setPage("pack") }}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-bold transition"
            style={city === n
              ? { backgroundColor: C.navy, color: "#fff" }
              : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}
          >
            {n}
          </button>
        ))}
      </div>

      <CityHero name={city} d={d} />

      <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{d.intro}</p>

      {/* Audience + PDF */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full p-1" style={{ backgroundColor: "#fff", border: `1px solid ${C.rule}` }} role="tablist" aria-label="Pack version">
          {MODES.map(([k, label, hint]) => (
            <button key={k} role="tab" aria-selected={mode === k} title={hint} onClick={() => setMode(k)}
              className="rounded-full px-4 py-1.5 text-sm font-bold transition"
              style={mode === k ? { backgroundColor: C.navy, color: "#fff" } : { color: C.muted }}>
              {label}
            </button>
          ))}
        </div>
        <a href={pdfHref} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black text-white transition hover:opacity-90"
          style={{ backgroundColor: C.confident }}>
          <FileDown size={15} /> Download {MODES.find(([k]) => k === mode)[1].toLowerCase()} pack (PDF)
        </a>
      </div>
      <p className="-mt-2 text-xs" style={{ color: C.muted }}>{MODES.find(([k]) => k === mode)[2]}</p>

      {/* Pages within the city */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b" style={{ borderColor: C.rule }}>
        {PAGES.map(([k, label, Icon]) => (
          <button key={k} onClick={() => setPage(k)}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-bold transition"
            style={{ color: page === k ? C.navy : C.muted, borderBottom: `3px solid ${page === k ? C.blue : "transparent"}`, marginBottom: "-1px" }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {page === "pack" && <PackPage city={city} d={d} mode={mode} family={family} setFamily={setFamily} hotelIdx={hotelIdx} setHotelIdx={setHotelIdx} />}
      {page === "practical" && <PracticalPage city={city} d={d} />}
      {page === "country" && <CountryPage city={city} d={d} />}
      {page === "places" && <PlacesPage city={city} d={d} />}

      <div className="text-[11px]" style={{ color: C.muted }}>
        {d.owner} · last updated {d.updatedAt} · Weather: Open-Meteo · Rates: ECB-derived daily reference · Photo: Wikipedia · Facts verified against the linked sources
      </div>
    </div>
  )
}
