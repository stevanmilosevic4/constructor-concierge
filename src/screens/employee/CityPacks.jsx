import React, { useState } from "react"
import {
  MapPin, Car, Stethoscope, Baby, Utensils, Info, Bed, Dumbbell, CloudSun,
  ChevronRight, BookOpen, Landmark, Coins, Clock, ExternalLink, Wind, Droplets,
  Plug, Languages, GlassWater, Siren,
} from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { RATE_CURRENCIES } from "../../data/cities.js"
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

export default function CityPacks({ user }) {
  const s = useStore()
  const names = Object.keys(s.cities)
  const myTrip = s.trips.find((t) => t.userId === user?.id && t.end >= new Date().toISOString().slice(0, 10))
  const [city, setCity] = useState(myTrip?.city && s.cities[myTrip.city] ? myTrip.city : names[0])
  const [hotelIdx, setHotelIdx] = useState(null)
  const [family, setFamily] = useState(Boolean(myTrip?.family))
  const [showHistory, setShowHistory] = useState(false)
  const d = s.cities[city]

  return (
    <div className="space-y-5">
      <SectionTitle sub="One pack per city: live weather and rates, the facts you need on arrival, and the partner network — hotels, transfers, restaurants, discounts — as the concierge team signs it.">
        City packs
      </SectionTitle>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {names.map((n) => (
          <button
            key={n}
            onClick={() => { setCity(n); setHotelIdx(null); setShowHistory(false) }}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <WeatherCard d={d} />
        <CurrencyCard d={d} />
      </div>

      {/* Discover — history & fun facts, real content to read on the plane */}
      <Card>
        <button onClick={() => setShowHistory(!showHistory)} className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <BookOpen size={15} style={{ color: C.confident }} /> Discover {city} — history & fun facts
          </div>
          <ChevronRight size={16} style={{ color: C.blue, transform: showHistory ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
        </button>
        {showHistory && (
          <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor: C.rule }}>
            {(d.history || []).map((p, i) => (
              <p key={i} className="text-sm leading-relaxed" style={{ color: C.ink }}>{p}</p>
            ))}
            {(d.funFacts || []).length > 0 && (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {d.funFacts.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg p-3 text-xs leading-relaxed" style={{ backgroundColor: "#E6F6FF", color: C.confident }}>
                    <Landmark size={13} className="mt-0.5 shrink-0" /> {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

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
        <Label>Where to stay</Label>
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

      {/* Family mode */}
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
          Schools, kindergartens, paediatric care and child seats on transfers. Family passports need the same
          six-month expiry check as yours — children's expire faster. The family layer for {city} is populated
          by the concierge team below.
        </Banner>
      )}

      {/* Partner areas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Stethoscope size={15} style={{ color: C.confident }} /> Health
          </div>
          {d.health.length > 0 ? <TwoCol rows={d.health} /> :
            <DesignatedArea icon={Stethoscope} title="Medical partners" body="English-speaking clinics, priority appointments and direct-billing arrangements are added here as they're agreed." />}
          {family && (
            <div className="mt-3 border-t pt-3" style={{ borderColor: C.rule }}>
              <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                <Baby size={15} style={{ color: C.confident }} /> Family
              </div>
              {d.family.length > 0 ? <TwoCol rows={d.family} /> :
                <DesignatedArea icon={Baby} title="Family layer" body="International schools with admissions contacts, kindergartens with typical waiting times, and paediatric partners are added here." />}
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Utensils size={15} style={{ color: C.confident }} /> Eating & hosting
          </div>
          {d.eat.length > 0 ? <TwoCol rows={d.eat} /> :
            <DesignatedArea icon={Utensils} title="Restaurant partners" body="Vetted places for client dinners and everyday lunches — with group rates where agreed — are added here." />}
        </Card>

        <Card className="sm:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Dumbbell size={15} style={{ color: C.confident }} /> Wellbeing — gym, padel, tennis, spa
          </div>
          {d.wellbeing.length > 0 ? <TwoCol rows={d.wellbeing} /> :
            <DesignatedArea icon={Dumbbell} title="Wellbeing partners" body="Gyms, padel and tennis courts, pools and spas at partner rates are added here as agreements are signed." />}
        </Card>
      </div>

      <div className="text-[11px]" style={{ color: C.muted }}>
        {d.owner} · last updated {d.updatedAt} · Weather: Open-Meteo · Rates: ECB-derived daily reference · Photo: Wikipedia
      </div>
    </div>
  )
}
