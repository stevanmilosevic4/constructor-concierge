import React from "react"
import { ShieldCheck, User, Crown, UserCog, Headset, ArrowRight } from "lucide-react"
import { C } from "../brand.js"
import { DEMO_USERS, update } from "../lib/store.js"
import { Wordmark, Pill } from "../components/ui.jsx"

const ROLE_META = {
  employee: { icon: User, label: "Employee", blurb: "Request, book within policy, see your city pack" },
  vip: { icon: Crown, label: "Executive", blurb: "Executive tier — guest links, EA delegation, protocol" },
  ea: { icon: UserCog, label: "Executive assistant", blurb: "Manage the principal's agenda, briefs and guests" },
  admin: { icon: Headset, label: "Concierge team", blurb: "Cities, partners, offers, guest links, broadcasts" },
}

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: C.navy }}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-10">
        <Wordmark dark sub="Travel & Concierge" />
        <h1 className="mt-8 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
          Everything you need before, during and after a trip —{" "}
          <span style={{ color: C.blue }}>and an honest answer about who decides.</span>
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "#9FB6D4" }}>
          The concierge team curates and routes. It never approves and never books — so this app tells you
          exactly what to request, from whom, and what to attach. concierge.weareconstructor.org
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {DEMO_USERS.map((u) => {
            const meta = ROLE_META[u.role]
            const Icon = meta.icon
            return (
              <button
                key={u.id}
                onClick={() => update(() => ({ session: { userId: u.id } }))}
                className="group flex items-center gap-4 rounded-xl2 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#E6F6FF" }}>
                  <Icon size={20} style={{ color: C.confident }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-black" style={{ color: C.navy }}>{u.name}</span>
                    {u.role === "vip" && <Pill tone="vip">VIP</Pill>}
                  </div>
                  <div className="truncate text-xs font-semibold" style={{ color: C.confident }}>{meta.label}</div>
                  <div className="mt-0.5 truncate text-xs" style={{ color: C.muted }}>{meta.blurb}</div>
                </div>
                <ArrowRight size={16} className="shrink-0 transition group-hover:translate-x-0.5" style={{ color: C.blue }} />
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs" style={{ color: "#9FB6D4" }}>
          <ShieldCheck size={14} />
          Prototype sign-in. Production uses company SSO — employees and executives with their Constructor account,
          guests with a no-login link.
        </div>
      </div>
      <div className="py-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#4A628F" }}>
        Constructing the future
      </div>
    </div>
  )
}
