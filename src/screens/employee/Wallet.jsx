import React, { useState } from "react"
import { Wallet, Phone, MapPin, Car, ShieldCheck, Printer, WifiOff, Siren } from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { fmtDate } from "../../lib/policy.js"
import { SectionTitle, Btn, Banner, Empty } from "../../components/ui.jsx"

/* The travel wallet: one screen that still works with no signal and no
   roaming. Everything on it is plain text — no lookups, no network calls
   — and it prints onto one card-sized page. Partner fields (driver,
   fixed fares, insurance) are populated by the concierge team; the
   emergency numbers are real today. */

const NotSet = ({ children }) => (
  <span className="text-xs italic" style={{ color: C.muted }}>{children || "To be added by the concierge team"}</span>
)

export default function WalletScreen({ user }) {
  const s = useStore()
  const myTrips = s.trips.filter((t) => t.userId === user.id && s.cities[t.city])
  const [tripId, setTripId] = useState(myTrips.find((t) => t.end >= new Date().toISOString().slice(0, 10))?.id || myTrips[0]?.id)
  const trip = myTrips.find((t) => t.id === tripId)
  const city = trip ? s.cities[trip.city] : null
  const hotel = city?.hotels?.[trip.hotelIdx ?? 0]
  const w = city?.wallet || {}

  if (!trip || !city) {
    return (
      <div className="space-y-5">
        <SectionTitle sub="One offline screen: hotel address in local script, driver number, fixed transfer price, emergency numbers, insurance policy.">Travel wallet</SectionTitle>
        <Empty icon={Wallet} title="No trip to build a wallet for" body="Once a trip is booked, the wallet assembles itself from the city pack — and works with no signal." />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-end justify-between gap-3">
        <SectionTitle sub="Everything below is plain text, loads from the device, and works with no signal and no roaming. Print it and it fits a jacket pocket.">
          Travel wallet
        </SectionTitle>
        <div className="flex items-center gap-2">
          {myTrips.length > 1 && (
            <select
              className="rounded-lg px-3 py-2 text-sm font-bold"
              style={{ border: `1px solid ${C.rule}`, color: C.navy }}
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
            >
              {myTrips.map((t) => <option key={t.id} value={t.id}>{t.city} · {fmtDate(t.start)}</option>)}
            </select>
          )}
          <Btn kind="ghost" onClick={() => window.print()}><Printer size={14} /> Print</Btn>
        </div>
      </div>

      <div className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-xl2 shadow-pop" style={{ border: `1px solid ${C.rule}` }}>
          <div className="p-5" style={{ backgroundColor: C.navy }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#7FD4FF" }}>Travel wallet · offline</div>
                <div className="mt-1 text-2xl font-black text-white">{trip.city}</div>
                <div className="text-xs font-semibold" style={{ color: "#9FB6D4" }}>
                  {fmtDate(trip.start)} → {fmtDate(trip.end)} · {user.name}
                </div>
              </div>
              <WifiOff size={22} style={{ color: "#7FD4FF" }} />
            </div>
          </div>

          <div className="space-y-4 bg-white p-5">
            {/* Hotel in local script */}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest" style={{ color: C.confident }}>
                <MapPin size={12} /> Hotel — show this to any driver
              </div>
              {hotel ? (
                <>
                  <div className="mt-1 text-sm font-bold" style={{ color: C.navy }}>{hotel.name}</div>
                  <div className="mt-1 rounded-lg p-3 text-base font-semibold leading-snug" style={{ backgroundColor: C.paper, color: C.ink }}>
                    {hotel.addressLocal || hotel.address}
                  </div>
                </>
              ) : (
                <div className="mt-1 rounded-lg border border-dashed p-3" style={{ borderColor: C.rule }}>
                  <NotSet>Your hotel appears here once accommodation partners for {trip.city} are added and your stay is booked.</NotSet>
                </div>
              )}
            </div>

            {/* Driver + fixed fare */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ border: `1px solid ${C.rule}` }}>
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest" style={{ color: C.confident }}>
                  <Car size={12} /> Driver
                </div>
                {w.driver?.phone ? (
                  <>
                    <div className="mt-1 text-sm font-bold" style={{ color: C.navy }}>{w.driver.name}</div>
                    <a href={`tel:${w.driver.phone.replace(/\s/g, "")}`} className="text-sm font-black" style={{ color: C.confident }}>
                      {w.driver.phone}
                    </a>
                  </>
                ) : <div className="mt-1"><NotSet /></div>}
              </div>
              <div className="rounded-lg p-3" style={{ border: `1px solid ${C.rule}` }}>
                <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: C.confident }}>Fixed fare</div>
                {w.fixedFare ? (
                  <>
                    <div className="mt-1 text-sm font-semibold leading-snug" style={{ color: C.ink }}>{w.fixedFare}</div>
                    <div className="mt-0.5 text-[10px]" style={{ color: C.muted }}>Never metered. Billed to the entity.</div>
                  </>
                ) : <div className="mt-1"><NotSet /></div>}
              </div>
            </div>

            {/* Emergency row — real numbers, always present */}
            <div className="flex items-stretch gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-lg p-3" style={{ backgroundColor: "#FDECE9", border: "1px solid #FBC9C1" }}>
                <Siren size={18} style={{ color: "#A81000" }} />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#A81000" }}>Emergency</div>
                  <div className="text-lg font-black" style={{ color: "#A81000" }}>{city.emergency}</div>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3 rounded-lg p-3" style={{ backgroundColor: C.paper, border: `1px solid ${C.rule}` }}>
                <Phone size={18} style={{ color: C.confident }} />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: C.confident }}>Police</div>
                  <div className="text-lg font-black" style={{ color: C.navy }}>{city.police}</div>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest" style={{ color: C.confident }}>
                <ShieldCheck size={12} /> Insurance
              </div>
              {w.insurance
                ? <div className="mt-1 text-sm font-semibold" style={{ color: C.ink }}>{w.insurance}</div>
                : <div className="mt-1"><NotSet>Group policy number and assistance line — added by the concierge team.</NotSet></div>}
            </div>

            {w.embassyNote && (
              <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ backgroundColor: C.paper, color: C.muted }}>
                {w.embassyNote}
              </div>
            )}

            <div className="border-t pt-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ borderColor: C.rule, color: C.muted }}>
              Constructor · Travel &amp; Concierge
            </div>
          </div>
        </div>
      </div>

      <div className="no-print mx-auto max-w-lg">
        <Banner tone="info" icon={WifiOff} title="Why this screen exists">
          Hotel address in the local script (worth its weight in Istanbul and São Paulo), the driver's number,
          the fixed transfer price so nobody can renegotiate it, emergency numbers and the insurance policy —
          with no signal and no roaming required. Open it once on wifi and it stays.
        </Banner>
      </div>
    </div>
  )
}
