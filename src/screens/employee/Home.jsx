import React from "react"
import {
  Plane, MapPin, CloudSun, Megaphone, Users, ArrowRight, Bed, CalendarDays,
  Wallet, Sparkles, Link2, UserCog,
} from "lucide-react"
import { C } from "../../brand.js"
import { useStore, colleaguesInTown, upcomingBroadcasts } from "../../lib/store.js"
import { fmtDate, isVip } from "../../lib/policy.js"
import { Card, Pill, SectionTitle, Btn, KV, Banner, Empty } from "../../components/ui.jsx"

export default function Home({ user, goTab }) {
  const s = useStore()
  const trips = s.trips
    .filter((t) => t.userId === user.id)
    .sort((a, b) => a.start.localeCompare(b.start))
  const next = trips.find((t) => t.end >= new Date().toISOString().slice(0, 10)) || trips[0]
  const city = next ? s.cities[next.city] : null
  const hotel = city?.hotels?.[next?.hotelIdx ?? 0]
  const nearby = colleaguesInTown(s, user)
  const updates = upcomingBroadcasts(s, user)
  const myMeetings = s.meetings.filter((m) => m.userId === user.id).slice(0, 2)
  const ea = s.people.find((u) => u.role === "ea" && u.assistsEmail === user.email)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle sub={next ? "Your next trip, and everything already arranged around it." : "No trips yet — start with a request."}>
          Welcome back, {user.name.split(" ")[0]}
        </SectionTitle>
        <Btn kind="blue" onClick={() => goTab("request")}>
          I want to request something <ArrowRight size={15} />
        </Btn>
      </div>

      {updates.map((b) => (
        <Banner key={b.id} tone="warn" icon={Megaphone} title={`${b.city} pack updated`}>
          {b.text}
        </Banner>
      ))}

      {!next && (
        <Empty icon={Plane} title="Nothing booked yet" body="Once a trip is booked it appears here with the hotel, the wallet and everything nearby. Start by requesting a flight — the app tells you the exact route.">
          <Btn onClick={() => goTab("request")}>Plan a trip</Btn>
        </Empty>
      )}

      {next && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* The trip card */}
          <Card className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Pill tone="info"><Plane size={11} /> {next.end >= new Date().toISOString().slice(0, 10) ? "Upcoming trip" : "Past trip"}</Pill>
                <h3 className="mt-2 text-2xl font-black" style={{ color: C.navy }}>{next.city}</h3>
                <div className="text-sm font-semibold" style={{ color: C.muted }}>
                  {fmtDate(next.start)} → {fmtDate(next.end)} · {next.purpose}
                </div>
              </div>
              {city?.weather && (
                <div className="rounded-xl2 px-4 py-3 text-right" style={{ backgroundColor: "#E6F6FF" }}>
                  <div className="flex items-center justify-end gap-1.5 text-2xl font-black" style={{ color: C.confident }}>
                    <CloudSun size={22} /> {city.weather.tempNow}
                  </div>
                  <div className="text-[11px] font-semibold" style={{ color: C.confident }}>{city.weather.range} · {city.weather.summary}</div>
                </div>
              )}
            </div>

            {hotel && (
              <div className="mt-4 rounded-xl2 p-4" style={{ backgroundColor: C.paper }}>
                <div className="flex items-start gap-3">
                  <Bed size={18} className="mt-0.5 shrink-0" style={{ color: C.confident }} />
                  <div className="min-w-0">
                    <div className="text-sm font-black" style={{ color: C.navy }}>{hotel.name}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{hotel.address} · {hotel.area}</div>
                    <div className="mt-1 text-xs" style={{ color: C.muted }}>{hotel.note}</div>
                  </div>
                </div>
                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                  {hotel.near.slice(0, 5).map((p, i) => (
                    <div key={i} className="shrink-0 rounded-lg bg-white px-3 py-2" style={{ border: `1px solid ${C.rule}` }}>
                      <div className="text-xs font-bold" style={{ color: C.navy }}>{p[0]}</div>
                      <div className="text-[11px]" style={{ color: C.muted }}>{p[1]} · {p[2]} min walk</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {city?.weather?.advice && (
              <p className="mt-3 text-xs leading-relaxed" style={{ color: C.muted }}>{city.weather.advice}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Btn kind="ghost" onClick={() => goTab("cities")}><MapPin size={14} /> Open the {next.city} pack</Btn>
              <Btn kind="ghost" onClick={() => goTab("wallet")}><Wallet size={14} /> Travel wallet</Btn>
              <Btn kind="ghost" onClick={() => goTab("offers")}><Sparkles size={14} /> Partner offers</Btn>
            </div>
          </Card>

          {/* Side column */}
          <div className="space-y-4">
            <Card>
              <div className="mb-1 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                <Users size={15} style={{ color: C.confident }} /> Who else is in town
              </div>
              {nearby.length === 0 && (
                <p className="text-xs" style={{ color: C.muted }}>
                  No colleagues overlap with your trips right now. Opt-in sharing — manage it under Tools.
                </p>
              )}
              {nearby.map((n, i) => (
                <div key={i} className="mt-2 rounded-lg p-3" style={{ backgroundColor: C.paper }}>
                  <div className="text-sm font-bold" style={{ color: C.navy }}>{n.who.name}</div>
                  <div className="text-xs" style={{ color: C.muted }}>
                    {n.overlapCity} · {fmtDate(n.trip.start)} → {fmtDate(n.trip.end)}
                  </div>
                  <div className="mt-0.5 text-[11px]" style={{ color: C.confident }}>
                    Same city, same dates — share the car, or the dinner.
                  </div>
                </div>
              ))}
            </Card>

            {myMeetings.length > 0 && (
              <Card onClick={() => goTab("agenda")}>
                <div className="mb-1 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                  <CalendarDays size={15} style={{ color: C.confident }} /> Next on the agenda
                </div>
                {myMeetings.map((m) => (
                  <div key={m.id} className="mt-2 text-sm">
                    <span className="font-bold" style={{ color: C.confident }}>{m.time}</span>{" "}
                    <span style={{ color: C.ink }}>{m.title}</span>
                    <div className="text-xs" style={{ color: C.muted }}>{fmtDate(m.day)} · {m.place}</div>
                  </div>
                ))}
              </Card>
            )}

            {isVip(user.level) && (
              <Card tone="vip">
                <div className="mb-1 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                  <Sparkles size={15} /> Executive tier
                </div>
                <div className="space-y-2 text-xs leading-relaxed" style={{ color: C.navy }}>
                  {ea && (
                    <div className="flex items-center gap-2">
                      <UserCog size={13} /> {ea.name} manages your agenda and briefs.
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Link2 size={13} /> Guest links for external visitors — ask the concierge team or your EA.
                  </div>
                  <div>Airport fast-track and protocol support are arranged per city — see Offers.</div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {trips.length > 1 && (
        <Card>
          <div className="mb-2 text-sm font-black" style={{ color: C.navy }}>All trips</div>
          <div className="divide-y" style={{ borderColor: C.rule }}>
            {trips.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2.5">
                <div>
                  <span className="text-sm font-bold" style={{ color: C.navy }}>{t.city}</span>{" "}
                  <span className="text-xs" style={{ color: C.muted }}>{t.purpose}</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: C.muted }}>{fmtDate(t.start)} → {fmtDate(t.end)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
