import React, { useState } from "react"
import {
  MapPin, Car, Stethoscope, Baby, Utensils, Info, Bed, Footprints, Dumbbell,
  CloudSun, ChevronRight,
} from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { Card, Pill, SectionTitle, Label, Rule, Banner } from "../../components/ui.jsx"

const NEAR_ICON = { Food: Utensils, Shop: MapPin, Health: Stethoscope, Work: Info, Move: Footprints, Transport: Car, Service: Info, Wellbeing: Dumbbell }

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

export default function CityPacks({ user }) {
  const s = useStore()
  const names = Object.keys(s.cities)
  const myTrip = s.trips.find((t) => t.userId === user?.id && t.end >= new Date().toISOString().slice(0, 10))
  const [city, setCity] = useState(myTrip?.city || names[0])
  const [hotelIdx, setHotelIdx] = useState(myTrip?.city ? myTrip.hotelIdx : null)
  const [family, setFamily] = useState(Boolean(myTrip?.family))
  const d = s.cities[city]
  const hotel = hotelIdx !== null ? d.hotels[hotelIdx] : null

  return (
    <div className="space-y-5">
      <SectionTitle sub="One pack per city: transfers at fixed prices, partner hotels, health, family, and what's actually near your door once you pick where you're staying.">
        City packs
      </SectionTitle>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {names.map((n) => (
          <button
            key={n}
            onClick={() => { setCity(n); setHotelIdx(n === myTrip?.city ? myTrip.hotelIdx : null) }}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-bold transition"
            style={city === n
              ? { backgroundColor: C.navy, color: "#fff" }
              : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}
          >
            {n}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black" style={{ color: C.navy }}>{city}</h3>
              <Pill tone="info">{d.tag}</Pill>
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: C.muted }}>{d.intro}</p>
          </div>
          {d.weather && (
            <div className="rounded-xl2 px-4 py-3 text-right" style={{ backgroundColor: "#E6F6FF" }}>
              <div className="flex items-center justify-end gap-1.5 text-xl font-black" style={{ color: C.confident }}>
                <CloudSun size={18} /> {d.weather.tempNow}
              </div>
              <div className="max-w-[180px] text-[11px] font-semibold leading-snug" style={{ color: C.confident }}>
                {d.weather.range} · {d.weather.summary}
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 text-[11px]" style={{ color: C.muted }}>{d.owner} · last updated {d.updatedAt}</div>
      </Card>

      {/* Hotels — pick one to unlock nearby */}
      <div>
        <Label>Where are you staying? Pick it — the pack rebuilds around your door</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {d.hotels.map((h, i) => (
            <Card key={i} onClick={() => setHotelIdx(hotelIdx === i ? null : i)}
              className={hotelIdx === i ? "!shadow-pop" : ""}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                    <Bed size={15} style={{ color: C.confident }} /> {h.name}
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: C.muted }}>{h.area} · {h.address}</div>
                  <div className="mt-1 text-xs leading-relaxed" style={{ color: C.muted }}>{h.note}</div>
                </div>
                <ChevronRight size={16} className="mt-1 shrink-0 transition" style={{ color: C.blue, transform: hotelIdx === i ? "rotate(90deg)" : "none" }} />
              </div>
              {hotelIdx === i && (
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
            </Card>
          ))}
        </div>
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
        <Banner tone="info" icon={Baby} title="What changes with family mode">
          Child seats are requested by default on every partner transfer — free and guaranteed on request.
          The family layer below covers schools, kindergartens and paediatric care. Family passports need the
          same six-month expiry check as yours — children's expire faster.
        </Banner>
      )}

      {/* The pack itself */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Car size={15} style={{ color: C.confident }} /> Fixed transfer rates
          </div>
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
          <Rule className="my-3" />
          <p className="text-[11px] leading-relaxed" style={{ color: C.muted }}>
            Published prices mean nobody adjudicates the cost. Billed monthly to the entity — you pay nothing and file no claim.
          </p>
        </Card>

        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Stethoscope size={15} style={{ color: C.confident }} /> Health
          </div>
          <TwoCol rows={d.health} />
          {family && (
            <>
              <Rule className="my-3" />
              <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                <Baby size={15} style={{ color: C.confident }} /> Family
              </div>
              <TwoCol rows={d.family} />
            </>
          )}
        </Card>

        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Utensils size={15} style={{ color: C.confident }} /> Eating & hosting
          </div>
          <TwoCol rows={d.eat} />
        </Card>

        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Dumbbell size={15} style={{ color: C.confident }} /> Wellbeing — gym, padel, tennis, spa
          </div>
          <TwoCol rows={d.wellbeing || []} />
        </Card>

        <Card className="sm:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Info size={15} style={{ color: C.confident }} /> Essentials
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <TwoCol rows={d.essentials} />
          </div>
        </Card>
      </div>
    </div>
  )
}
