import React, { useEffect, useState } from "react"
import {
  Plane, MapPin, Receipt, CalendarDays, Tag, Wallet, Wrench, LayoutDashboard,
  Inbox, Building2, Link2, Users, UserCog, Megaphone, LogOut, LifeBuoy, Phone, X,
} from "lucide-react"
import { C } from "./brand.js"
import { useStore, update, currentUser } from "./lib/store.js"
import { CONTACTS, isVip } from "./lib/policy.js"
import { Wordmark, Btn, Pill } from "./components/ui.jsx"

import Login from "./screens/Login.jsx"
import Home from "./screens/employee/Home.jsx"
import Request from "./screens/employee/Request.jsx"
import CityPacks from "./screens/employee/CityPacks.jsx"
import Offers from "./screens/employee/Offers.jsx"
import Agenda from "./screens/employee/Agenda.jsx"
import Expenses from "./screens/employee/Expenses.jsx"
import WalletScreen from "./screens/employee/Wallet.jsx"
import Tools from "./screens/employee/Tools.jsx"
import Dashboard from "./screens/admin/Dashboard.jsx"
import Requests from "./screens/admin/Requests.jsx"
import CityEditor from "./screens/admin/CityEditor.jsx"
import GuestLinks from "./screens/admin/GuestLinks.jsx"
import Groups from "./screens/admin/Groups.jsx"
import Broadcasts from "./screens/admin/Broadcasts.jsx"
import People from "./screens/admin/People.jsx"
import GuestPage from "./screens/guest/GuestPage.jsx"
import PackPrint from "./screens/PackPrint.jsx"

/* ------------------------------------------------------------------ */
/*  Help — one tap to the concierge emergency line, from anywhere.     */
/* ------------------------------------------------------------------ */

function HelpButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Help — concierge emergency line"
        className="no-print fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-pop transition hover:scale-105"
        style={{ backgroundColor: C.red }}
      >
        <LifeBuoy size={26} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-xl2 bg-white p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="text-lg font-black" style={{ color: C.navy }}>Need help now?</div>
              <button onClick={() => setOpen(false)} aria-label="Close"><X size={18} style={{ color: C.muted }} /></button>
            </div>
            <p className="mt-1 text-sm" style={{ color: C.muted }}>
              The concierge line is staffed for travel emergencies — lost documents, missed connections, hospitalisation, anything urgent on the road.
            </p>
            <a href={`tel:${CONTACTS.concierge.phone.replace(/\s/g, "")}`} className="mt-4 flex items-center justify-center gap-2 rounded-lg py-3.5 text-base font-black text-white" style={{ backgroundColor: C.red }}>
              <Phone size={18} /> {CONTACTS.concierge.phone}
            </a>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span style={{ color: C.muted }}>Concierge team</span><a className="font-semibold" style={{ color: C.confident }} href={`mailto:${CONTACTS.concierge.email}`}>{CONTACTS.concierge.email}</a></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Mobility (visas)</span><a className="font-semibold" style={{ color: C.confident }} href={`mailto:${CONTACTS.mobility.email}`}>{CONTACTS.mobility.email}</a></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Finance</span><a className="font-semibold" style={{ color: C.confident }} href={`mailto:${CONTACTS.finance.email}`}>{CONTACTS.finance.email}</a></div>
            </div>
            <p className="mt-4 text-xs" style={{ color: C.muted }}>
              Local emergency numbers are on your Travel wallet screen — they work when this app does not.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */

function Shell({ user }) {
  const admin = user.role === "admin"
  const ea = user.role === "ea"
  const s = useStore()

  const tabs = admin
    ? [
        ["dash", "Dashboard", LayoutDashboard, Dashboard],
        ["requests", "Requests", Inbox, Requests],
        ["cities", "Cities & partners", Building2, CityEditor],
        ["guests", "Guest links", Link2, GuestLinks],
        ["groups", "Group trips", Users, Groups],
        ["broadcast", "Pack updates", Megaphone, Broadcasts],
        ["people", "People & access", UserCog, People],
      ]
    : ea
      ? [
          ["agenda", "Principal's agenda", CalendarDays, Agenda],
          ["cities", "City packs", MapPin, CityPacks],
          ["offers", "Partner offers", Tag, Offers],
          ["guests", "Guest links", Link2, GuestLinks],
        ]
      : [
          ["home", "My trip", Plane, Home],
          ["request", "Request", Inbox, Request],
          ["cities", "City packs", MapPin, CityPacks],
          ["offers", "Offers", Tag, Offers],
          ["agenda", "Agenda", CalendarDays, Agenda],
          ["expenses", "Expenses", Receipt, Expenses],
          ["wallet", "Wallet", Wallet, WalletScreen],
          ["tools", "Tools", Wrench, Tools],
        ]

  const [tab, setTab] = useState(tabs[0][0])
  const Active = (tabs.find(([k]) => k === tab) || tabs[0])[3]

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.paper }}>
      <header className="no-print" style={{ backgroundColor: C.navy }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Wordmark dark sub={admin ? "Concierge · Admin" : ea ? "Concierge · Assistant" : "Travel & Concierge"} />
          <div className="flex items-center gap-3">
            {isVip(user.level) && <Pill tone="vip">Executive</Pill>}
            <div className="text-right leading-tight">
              <div className="text-sm font-bold text-white">{user.name}</div>
              <div className="text-[11px]" style={{ color: "#7FD4FF" }}>{user.role === "admin" ? user.email : `${user.level} · ${user.entity}`}</div>
            </div>
            <button
              onClick={() => update(() => ({ session: null }))}
              aria-label="Sign out"
              className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <nav className="no-print sticky top-0 z-30 bg-white" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3">
          {tabs.map(([k, lab, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className="flex items-center gap-2 whitespace-nowrap px-3.5 py-3 text-sm font-bold transition"
              style={{
                color: tab === k ? C.navy : C.muted,
                borderBottom: `3px solid ${tab === k ? C.blue : "transparent"}`,
                marginBottom: "-1px",
              }}
            >
              <Icon size={15} /> {lab}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-5">
        <Active user={user} goTab={setTab} />
      </main>

      {!admin && <HelpButton />}

      <footer className="mx-auto max-w-6xl px-5 pb-24 pt-6 text-xs leading-relaxed" style={{ color: C.muted }}>
        Rules derived from the Global Travel &amp; Expense Policy v1 (4 September 2025). Where this app differs from the
        policy, the policy governs. The concierge team informs and routes — it never approves and never books.
        City content, partners and offer codes are sample data pending the vendor network.
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function App() {
  const s = useStore()
  const user = currentUser(s)
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // Guest links work with no login at all — that is their entire point.
  const guestMatch = hash.match(/^#\/guest\/(.+)$/)
  if (guestMatch) return <GuestPage id={guestMatch[1]} />

  if (!user) return <Login />

  // Printable pack — signed-in only (it carries partner rates and codes).
  const packMatch = hash.match(/^#\/pack\/([^/]+)\/(visit|relocate)/)
  if (packMatch) return <PackPrint city={decodeURIComponent(packMatch[1])} mode={packMatch[2]} />

  return <Shell user={user} />
}
