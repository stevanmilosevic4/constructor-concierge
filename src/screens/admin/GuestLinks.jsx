import React, { useState } from "react"
import { Link2, Plus, Copy, Check, Trash2, ExternalLink, X } from "lucide-react"
import { C } from "../../brand.js"
import { useStore, update, uid } from "../../lib/store.js"
import { fmtDate } from "../../lib/policy.js"
import { Card, SectionTitle, Btn, Label, inputCls, inputStyle, QR, Banner, Empty } from "../../components/ui.jsx"

const blank = () => ({
  guest: "", host: "", city: "", arrive: "", flight: "",
  driver: { name: "", plate: "", phone: "" },
  hotel: "", contact: "", agenda: [], notes: "", agendaText: "",
})

export default function GuestLinks({ user }) {
  const s = useStore()
  const [draft, setDraft] = useState(null)
  const [copied, setCopied] = useState("")

  const urlFor = (id) => `${window.location.origin}${window.location.pathname}#/guest/${id}`

  const copy = async (id) => {
    try {
      await navigator.clipboard.writeText(urlFor(id))
      setCopied(id)
      setTimeout(() => setCopied(""), 1500)
    } catch { /* blocked */ }
  }

  const save = () => {
    const agenda = (draft.agendaText || "")
      .split("\n").map((l) => l.trim()).filter(Boolean)
      .map((l) => {
        const idx = l.indexOf(" ")
        return idx > 0 ? { time: l.slice(0, idx), item: l.slice(idx + 1) } : { time: "", item: l }
      })
    update((st) => ({ guestLinks: [{ ...draft, agenda, id: uid() }, ...st.guestLinks] }))
    setDraft(null)
  }

  const remove = (id) => update((st) => ({ guestLinks: st.guestLinks.filter((g) => g.id !== id) }))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle sub="A no-login page for an external guest: driver name and plate, hotel, agenda, one contact number. The single highest-impact thing for board members and speakers — nobody asks a guest to install anything.">
          Guest links
        </SectionTitle>
        {!draft && <Btn kind="blue" onClick={() => setDraft(blank())}><Plus size={15} /> New guest link</Btn>}
      </div>

      {draft && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-black" style={{ color: C.navy }}>New guest link</div>
            <button onClick={() => setDraft(null)} aria-label="Cancel"><X size={16} style={{ color: C.muted }} /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Guest name *</Label><input className={inputCls} style={inputStyle} value={draft.guest} onChange={(e) => setDraft({ ...draft, guest: e.target.value })} /></div>
            <div><Label>Hosted by</Label><input className={inputCls} style={inputStyle} placeholder="Office of the CEO" value={draft.host} onChange={(e) => setDraft({ ...draft, host: e.target.value })} /></div>
            <div><Label>City *</Label><input className={inputCls} style={inputStyle} value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} /></div>
            <div><Label>Arrival date</Label><input type="date" className={inputCls} style={inputStyle} value={draft.arrive} onChange={(e) => setDraft({ ...draft, arrive: e.target.value })} /></div>
            <div><Label>Flight</Label><input className={inputCls} style={inputStyle} placeholder="LH 2442 → BRE 17:35" value={draft.flight} onChange={(e) => setDraft({ ...draft, flight: e.target.value })} /></div>
            <div><Label>Hotel</Label><input className={inputCls} style={inputStyle} value={draft.hotel} onChange={(e) => setDraft({ ...draft, hotel: e.target.value })} /></div>
            <div><Label>Driver name</Label><input className={inputCls} style={inputStyle} value={draft.driver.name} onChange={(e) => setDraft({ ...draft, driver: { ...draft.driver, name: e.target.value } })} /></div>
            <div><Label>Plate</Label><input className={inputCls} style={inputStyle} value={draft.driver.plate} onChange={(e) => setDraft({ ...draft, driver: { ...draft.driver, plate: e.target.value } })} /></div>
            <div><Label>Driver phone</Label><input className={inputCls} style={inputStyle} value={draft.driver.phone} onChange={(e) => setDraft({ ...draft, driver: { ...draft.driver, phone: e.target.value } })} /></div>
            <div><Label>One contact number *</Label><input className={inputCls} style={inputStyle} placeholder="Guest hotline" value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} /></div>
            <div className="sm:col-span-2">
              <Label>Agenda — one line per item, time first</Label>
              <textarea rows={4} className={inputCls} style={inputStyle} placeholder={"17:35 Arrival — driver meets inside arrivals\n19:30 Dinner with the president"} value={draft.agendaText} onChange={(e) => setDraft({ ...draft, agendaText: e.target.value })} />
            </div>
            <div className="sm:col-span-2"><Label>Notes for the guest</Label><input className={inputCls} style={inputStyle} placeholder="Vegetarian. Return transfer booked for 14:00." value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></div>
          </div>
          <div className="mt-4">
            <Btn disabled={!draft.guest || !draft.city || !draft.contact} onClick={save}><Check size={14} /> Create link</Btn>
          </div>
        </Card>
      )}

      {s.guestLinks.length === 0 && !draft && (
        <Empty icon={Link2} title="No guest links yet" body="Create one per external guest — they get a clean page with everything they need and nothing they don't." />
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        {s.guestLinks.map((g) => (
          <Card key={g.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black" style={{ color: C.navy }}>{g.guest}</div>
                <div className="text-xs" style={{ color: C.muted }}>
                  {g.city} · {g.arrive ? fmtDate(g.arrive) : "date tbc"} {g.flight ? `· ${g.flight}` : ""}
                </div>
                <div className="mt-1 text-xs" style={{ color: C.muted }}>{g.hotel}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Btn kind="ghost" onClick={() => copy(g.id)}>
                    {copied === g.id ? <Check size={13} /> : <Copy size={13} />} {copied === g.id ? "Copied" : "Copy link"}
                  </Btn>
                  <Btn kind="ghost" onClick={() => { window.location.hash = `#/guest/${g.id}` }}>
                    <ExternalLink size={13} /> Preview
                  </Btn>
                  {user.role === "admin" && (
                    <Btn kind="ghost" onClick={() => remove(g.id)}><Trash2 size={13} style={{ color: C.red }} /></Btn>
                  )}
                </div>
              </div>
              <div className="shrink-0 rounded-lg bg-white p-1" style={{ border: `1px solid ${C.rule}` }}>
                <QR text={urlFor(g.id)} size={88} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Banner tone="info" title="Data protection">
        A guest page holds personal data — name, movements, dietary needs. Share the link only with the guest and
        the people running their visit, and delete it when the visit is over. Preference records for recurring VIPs
        are kept only with the guest's knowledge.
      </Banner>
    </div>
  )
}
