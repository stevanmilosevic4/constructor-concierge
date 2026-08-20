import React, { useState } from "react"
import { Users, Plus, Trash2, Globe, Check, X, Pencil } from "lucide-react"
import { C } from "../../brand.js"
import { useStore, update, uid } from "../../lib/store.js"
import { LEVELS, isVip } from "../../lib/policy.js"
import { normalizeEmail, entityFromEmail, nameFromEmail } from "../../lib/auth.js"
import { Card, SectionTitle, Btn, Label, inputCls, inputStyle, Pill, Banner } from "../../components/ui.jsx"

/* The People registry: the answer to "how do we tell an executive from a
   regular traveller" — not a choice at the login screen, but a fact the
   concierge team sets here, once, per person. Everyone else who signs in
   with an allowed work email is simply a Standard employee. */

const ROLES = [
  ["employee", "Traveller"],
  ["ea", "Executive assistant"],
  ["admin", "Concierge team"],
]

const blank = () => ({ email: "", name: "", role: "employee", level: "Employee", entity: "", managerEmail: "", assistsEmail: "" })

function PersonForm({ initial, people, onSave, onCancel }) {
  const [p, setP] = useState(initial)
  const set = (k) => (e) => setP((x) => ({ ...x, [k]: e.target.value }))
  const executives = people.filter((x) => isVip(x.level))
  const ok = p.email.includes("@") && p.name
  return (
    <Card>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Work email *</Label><input className={inputCls} style={inputStyle} value={p.email} onChange={set("email")} placeholder="name@constructor.org"
          onBlur={() => setP((x) => ({ ...x, name: x.name || nameFromEmail(x.email), entity: x.entity || entityFromEmail(x.email) }))} /></div>
        <div><Label>Name *</Label><input className={inputCls} style={inputStyle} value={p.name} onChange={set("name")} /></div>
        <div>
          <Label>Role</Label>
          <select className={inputCls} style={inputStyle} value={p.role} onChange={set("role")}>
            {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <Label>Level — sets the travel tier</Label>
          <select className={inputCls} style={inputStyle} value={p.level} onChange={set("level")}>
            {Object.keys(LEVELS).map((l) => <option key={l}>{l}{isVip(l) ? " · Executive tier" : ""}</option>)}
          </select>
        </div>
        <div><Label>Entity</Label><input className={inputCls} style={inputStyle} value={p.entity} onChange={set("entity")} placeholder="Derived from email if empty" /></div>
        <div><Label>Line manager email</Label><input className={inputCls} style={inputStyle} value={p.managerEmail || ""} onChange={set("managerEmail")} /></div>
        {p.role === "ea" && (
          <div className="sm:col-span-2">
            <Label>Assists (principal)</Label>
            <select className={inputCls} style={inputStyle} value={p.assistsEmail || ""} onChange={set("assistsEmail")}>
              <option value="">Choose the executive…</option>
              {executives.map((x) => <option key={x.id} value={x.email}>{x.name} — {x.email}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <Btn disabled={!ok} onClick={() => onSave({ ...p, email: normalizeEmail(p.email), entity: p.entity || entityFromEmail(p.email) })}><Check size={14} /> Save</Btn>
        <Btn kind="ghost" onClick={onCancel}><X size={14} /> Cancel</Btn>
      </div>
    </Card>
  )
}

export default function People({ user }) {
  const s = useStore()
  const [editing, setEditing] = useState(null) // "new" | person id
  const [domains, setDomains] = useState(s.allowedDomains.join(", "))
  const [domainsSaved, setDomainsSaved] = useState(false)

  const save = (p, id) => {
    update((st) => ({
      people: id
        ? st.people.map((x) => (x.id === id ? { ...x, ...p } : x))
        : [...st.people, { ...p, id: uid() }],
    }))
    setEditing(null)
  }
  const remove = (id) => {
    if (id === user.id) return // don't delete yourself
    update((st) => ({ people: st.people.filter((x) => x.id !== id) }))
  }
  const saveDomains = () => {
    const list = domains.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean)
    update(() => ({ allowedDomains: list }))
    setDomainsSaved(true)
    setTimeout(() => setDomainsSaved(false), 1500)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle sub="Who is who. Everyone signing in with an allowed work email is a Standard traveller by default — this table is where you mark executives, assistants and the team itself. Nobody chooses a tier at the door.">
          People & access
        </SectionTitle>
        {editing === null && <Btn kind="blue" onClick={() => setEditing("new")}><Plus size={15} /> Add person</Btn>}
      </div>

      {editing === "new" && <PersonForm initial={blank()} people={s.people} onSave={(p) => save(p)} onCancel={() => setEditing(null)} />}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[11px] font-black uppercase tracking-wide" style={{ color: C.muted }}>
                <th className="pb-2 pr-4">Person</th>
                <th className="pb-2 pr-4">Role</th>
                <th className="pb-2 pr-4">Level / tier</th>
                <th className="pb-2 pr-4">Entity</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {s.people.map((p) => (
                <tr key={p.id} className="border-t align-top" style={{ borderColor: C.rule }}>
                  <td className="py-2.5 pr-4">
                    <div className="font-bold" style={{ color: C.navy }}>{p.name}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{p.email}</div>
                    {p.role === "ea" && p.assistsEmail && (
                      <div className="text-[11px]" style={{ color: C.confident }}>assists {s.people.find((x) => x.email === p.assistsEmail)?.name || p.assistsEmail}</div>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    {p.role === "admin" ? <Pill tone="stop">Concierge team</Pill> : p.role === "ea" ? <Pill tone="info">Assistant</Pill> : <Pill tone="neutral">Traveller</Pill>}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span style={{ color: C.ink }}>{p.level}</span>{" "}
                    {isVip(p.level) && <Pill tone="vip">Executive</Pill>}
                  </td>
                  <td className="py-2.5 pr-4 text-xs" style={{ color: C.muted }}>{p.entity}</td>
                  <td className="py-2.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(p.id)} aria-label={`Edit ${p.name}`} className="rounded-md p-1.5 transition hover:bg-slate-100"><Pencil size={14} style={{ color: C.muted }} /></button>
                      {p.id !== user.id && (
                        <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="rounded-md p-1.5 transition hover:bg-red-50"><Trash2 size={14} style={{ color: C.red }} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && editing !== "new" && (
        <PersonForm initial={s.people.find((x) => x.id === editing)} people={s.people} onSave={(p) => save(p, editing)} onCancel={() => setEditing(null)} />
      )}

      <Card>
        <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
          <Globe size={15} style={{ color: C.confident }} /> Allowed sign-in domains
        </div>
        <p className="mb-2 text-xs" style={{ color: C.muted }}>
          Anyone with an email on these domains can sign in as a Standard traveller — they appear in the table above on first sign-in.
        </p>
        <div className="flex gap-2">
          <input className={inputCls} style={inputStyle} value={domains} onChange={(e) => setDomains(e.target.value)} />
          <Btn onClick={saveDomains}>{domainsSaved ? <Check size={14} /> : null} {domainsSaved ? "Saved" : "Save"}</Btn>
        </div>
      </Card>

      <Banner tone="info" icon={Users} title="How access works">
        Travellers and executives sign in with their work email — tier and delegation come from this table, never
        from a choice at the login screen. The concierge team signs in with the team access code. External guests
        never sign in: they get a personal guest link. In the production phase, company SSO replaces the email step
        and this table maps onto directory groups.
      </Banner>
    </div>
  )
}
