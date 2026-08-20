import React, { useState } from "react"
import { ShieldCheck, Mail, ArrowRight, KeyRound, Loader2 } from "lucide-react"
import { C } from "../brand.js"
import { update, uid, personByEmail, getState } from "../lib/store.js"
import { verifyAdminCode, isAllowedDomain, entityFromEmail, nameFromEmail, normalizeEmail } from "../lib/auth.js"
import { Wordmark } from "../components/ui.jsx"

/* Two doors, no role choice at the door:
   — work email: the registry decides who you are (tier, EA, entity);
     unknown addresses on an allowed domain join as Standard employees.
   — concierge team code: admin access.
   Guests never see this screen at all — they get a no-login link. */

export default function Login() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [mode, setMode] = useState("email") // email | admin
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const signInEmail = () => {
    setError("")
    const e = normalizeEmail(email)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setError("That doesn't look like an email address.")
      return
    }
    const s = getState()
    const known = personByEmail(s, e)
    if (known) {
      update(() => ({ session: { userId: known.id } }))
      return
    }
    if (!isAllowedDomain(e, s.allowedDomains)) {
      setError("This email domain doesn't have access. Use your Constructor work email, or ask the concierge team to add your domain.")
      return
    }
    // First sign-in on an allowed domain: register as a Standard employee.
    const person = {
      id: uid(), email: e, name: nameFromEmail(e), role: "employee",
      level: "Employee", entity: entityFromEmail(e), managerEmail: "",
    }
    update((st) => ({ people: [...st.people, person], session: { userId: person.id } }))
  }

  const signInAdmin = async () => {
    setError("")
    setBusy(true)
    try {
      if (await verifyAdminCode(code)) {
        const s = getState()
        const admin = s.people.find((p) => p.role === "admin")
        if (admin) {
          update(() => ({ session: { userId: admin.id } }))
        } else {
          // The registry can end up with no admin (edited away). The code is
          // the source of authority here, so restore the team account rather
          // than locking the team out — and never impersonate a traveller.
          const fresh = { id: uid(), email: "concierge@constructor.org", name: "Concierge team", role: "admin", level: "Employee", entity: "Constructor Knowledge" }
          update((st) => ({ people: [...st.people, fresh], session: { userId: fresh.id } }))
        }
      } else {
        setError("That code isn't right. Check with the concierge team.")
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: C.navy }}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-10">
        <Wordmark dark sub="Travel & Concierge" />
        <h1 className="mt-8 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
          Everything you need before, during and after a trip —{" "}
          <span style={{ color: C.blue }}>and an honest answer about who decides.</span>
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "#9FB6D4" }}>
          The concierge team curates and routes. It never approves and never books — this app tells you
          exactly what to request, from whom, and what to attach.
        </p>

        <div className="mt-10 w-full max-w-md rounded-xl2 bg-white p-6 shadow-pop">
          {mode === "email" ? (
            <>
              <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                <Mail size={15} style={{ color: C.confident }} /> Sign in with your work email
              </div>
              <p className="mt-1 text-xs" style={{ color: C.muted }}>
                Your email decides what you see — entity, travel tier and assistant access are already set up for you.
              </p>
              <input
                type="email"
                autoFocus
                className="mt-3 w-full rounded-lg px-3 py-3 text-sm outline-none transition focus:border-[#00B2FF]"
                style={{ border: `1px solid ${C.rule}`, color: C.ink }}
                placeholder="you@constructor.university"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signInEmail()}
              />
              <button
                onClick={signInEmail}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-black text-white transition hover:opacity-90"
                style={{ backgroundColor: C.confident }}
              >
                Continue <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                <KeyRound size={15} style={{ color: C.confident }} /> Concierge team access
              </div>
              <p className="mt-1 text-xs" style={{ color: C.muted }}>
                Enter the team access code to open the admin panel.
              </p>
              <input
                type="password"
                autoFocus
                className="mt-3 w-full rounded-lg px-3 py-3 text-sm outline-none transition focus:border-[#00B2FF]"
                style={{ border: `1px solid ${C.rule}`, color: C.ink }}
                placeholder="Access code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !busy && signInAdmin()}
              />
              <button
                onClick={signInAdmin}
                disabled={busy}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: C.navy }}
              >
                {busy ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />} Open admin panel
              </button>
            </>
          )}

          {error && (
            <p className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold" style={{ backgroundColor: "#FDECE9", color: "#A81000" }}>
              {error}
            </p>
          )}

          <button
            onClick={() => { setMode(mode === "email" ? "admin" : "email"); setError("") }}
            className="mt-4 w-full text-center text-xs font-bold"
            style={{ color: C.confident }}
          >
            {mode === "email" ? "Concierge team? Sign in with the access code →" : "← Back to work email sign-in"}
          </button>
        </div>

        <div className="mt-8 flex max-w-md items-start gap-2 text-xs leading-relaxed" style={{ color: "#9FB6D4" }}>
          <ShieldCheck size={14} className="mt-0.5 shrink-0" />
          <span>
            External guests never sign in — they receive a personal link with everything they need.
            Company SSO replaces this screen in the production phase.
          </span>
        </div>
      </div>
      <div className="py-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#4A628F" }}>
        Constructing the future
      </div>
    </div>
  )
}
