import React from "react"
import { Car, Bed, Phone, CalendarDays, Plane } from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { fmtDate } from "../../lib/policy.js"
import { Wordmark } from "../../components/ui.jsx"

/* The guest page. No login, no app install, no account — a link sent by
   the concierge team or an EA. Driver, hotel, agenda, one number.
   Deliberately spare: a board member opens this on a phone, in a car. */

export default function GuestPage({ id }) {
  const s = useStore()
  const g = s.guestLinks.find((x) => x.id === id)

  if (!g) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center" style={{ backgroundColor: C.navy }}>
        <Wordmark dark sub="Guest services" />
        <p className="max-w-sm text-sm" style={{ color: "#9FB6D4" }}>
          This guest link is no longer active. Please contact your host, or the number you were given.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.paper }}>
      <header className="px-6 pb-16 pt-8" style={{ backgroundColor: C.navy }}>
        <div className="mx-auto max-w-md">
          <Wordmark dark sub="Guest services" />
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#7FD4FF" }}>Welcome</p>
          <h1 className="mt-1 text-3xl font-black leading-tight text-white">{g.guest}</h1>
          <p className="mt-1 text-sm" style={{ color: "#9FB6D4" }}>
            {g.city}{g.arrive ? ` · ${fmtDate(g.arrive)}` : ""}{g.host ? ` · hosted by ${g.host}` : ""}
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-10 max-w-md space-y-4 px-4 pb-12">
        {/* One number — the most important thing on the page */}
        <a
          href={`tel:${g.contact.replace(/[^+\d]/g, "")}`}
          className="flex items-center justify-center gap-2 rounded-xl2 py-4 text-base font-black text-white shadow-pop"
          style={{ backgroundColor: C.confident }}
        >
          <Phone size={18} /> {g.contact}
        </a>

        {(g.driver?.name || g.flight) && (
          <div className="rounded-xl2 bg-white p-5 shadow-card" style={{ border: `1px solid ${C.rule}` }}>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest" style={{ color: C.confident }}>
              <Car size={13} /> Your arrival
            </div>
            {g.flight && (
              <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: C.ink }}>
                <Plane size={14} style={{ color: C.muted }} /> {g.flight}
              </div>
            )}
            {g.driver?.name && (
              <div className="mt-3 rounded-lg p-4" style={{ backgroundColor: C.paper }}>
                <div className="text-sm" style={{ color: C.muted }}>Your driver will meet you inside arrivals with a name board.</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black" style={{ color: C.navy }}>{g.driver.name}</span>
                  <span className="rounded-md px-2 py-1 font-mono text-sm font-black" style={{ backgroundColor: "#fff", color: C.navy, border: `1px solid ${C.rule}` }}>
                    {g.driver.plate}
                  </span>
                </div>
                {g.driver.phone && (
                  <a href={`tel:${g.driver.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm font-bold" style={{ color: C.confident }}>
                    {g.driver.phone}
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {g.hotel && (
          <div className="rounded-xl2 bg-white p-5 shadow-card" style={{ border: `1px solid ${C.rule}` }}>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest" style={{ color: C.confident }}>
              <Bed size={13} /> Your hotel
            </div>
            <div className="mt-2 text-sm font-semibold leading-relaxed" style={{ color: C.ink }}>{g.hotel}</div>
          </div>
        )}

        {g.agenda?.length > 0 && (
          <div className="rounded-xl2 bg-white p-5 shadow-card" style={{ border: `1px solid ${C.rule}` }}>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest" style={{ color: C.confident }}>
              <CalendarDays size={13} /> Your programme
            </div>
            <div className="mt-3 space-y-3">
              {g.agenda.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-20 shrink-0 text-sm font-black" style={{ color: C.confident }}>{a.time}</div>
                  <div className="text-sm leading-relaxed" style={{ color: C.ink }}>{a.item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {g.notes && (
          <div className="rounded-xl2 p-4 text-sm leading-relaxed" style={{ backgroundColor: "#E6F6FF", color: C.confident, border: "1px solid #B8E4FF" }}>
            {g.notes}
          </div>
        )}

        <p className="pt-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.muted }}>
          Constructor · Constructing the future
        </p>
      </main>
    </div>
  )
}
