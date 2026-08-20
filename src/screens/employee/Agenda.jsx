import React, { useState } from "react"
import { CalendarDays, Plus, Trash2, Pencil, FileText, X, Check } from "lucide-react"
import { C } from "../../brand.js"
import { useStore, update, uid } from "../../lib/store.js"
import { fmtDate } from "../../lib/policy.js"
import { Card, SectionTitle, Btn, Label, inputCls, inputStyle, Empty, Pill } from "../../components/ui.jsx"

const blank = () => ({ day: "", time: "", title: "", place: "", brief: "" })

function MeetingForm({ initial, onSave, onCancel }) {
  const [m, setM] = useState(initial)
  const set = (k) => (e) => setM((x) => ({ ...x, [k]: e.target.value }))
  const ok = m.day && m.time && m.title
  return (
    <Card>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Date *</Label><input type="date" className={inputCls} style={inputStyle} value={m.day} onChange={set("day")} /></div>
        <div><Label>Time *</Label><input type="time" className={inputCls} style={inputStyle} value={m.time} onChange={set("time")} /></div>
        <div className="sm:col-span-2"><Label>Meeting *</Label><input className={inputCls} style={inputStyle} placeholder="Title" value={m.title} onChange={set("title")} /></div>
        <div className="sm:col-span-2"><Label>Place</Label><input className={inputCls} style={inputStyle} placeholder="Where" value={m.place} onChange={set("place")} /></div>
        <div className="sm:col-span-2">
          <Label>Brief</Label>
          <textarea rows={3} className={inputCls} style={inputStyle}
            placeholder="Context, names, dietary notes, what to have in the car…"
            value={m.brief} onChange={set("brief")} />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Btn disabled={!ok} onClick={() => onSave(m)}><Check size={14} /> Save</Btn>
        <Btn kind="ghost" onClick={onCancel}><X size={14} /> Cancel</Btn>
      </div>
    </Card>
  )
}

export default function Agenda({ user }) {
  const s = useStore()
  const isEa = user.role === "ea"
  const principal = (isEa && s.people.find((u) => u.email === user.assistsEmail)) || user
  const canEdit = isEa || user.role === "employee"
  const [editing, setEditing] = useState(null) // "new" | meeting id
  const meetings = s.meetings
    .filter((m) => m.userId === principal.id)
    .sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time))

  const days = meetings.reduce((acc, m) => {
    (acc[m.day] = acc[m.day] || []).push(m)
    return acc
  }, {})

  const save = (m, id) => {
    update((st) => ({
      meetings: id
        ? st.meetings.map((x) => (x.id === id ? { ...x, ...m, by: user.name } : x))
        : [...st.meetings, { ...m, id: uid(), userId: principal.id, by: user.name }],
    }))
    setEditing(null)
  }
  const remove = (id) => update((st) => ({ meetings: st.meetings.filter((x) => x.id !== id) }))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle
          sub={isEa
            ? `You are managing ${principal.name}'s agenda. Everything you add — meetings and briefs — appears in their app immediately.`
            : "Your agenda for the trip. Your assistant can add meetings and briefs here on your behalf."}>
          {isEa ? `${principal.name} — agenda` : "Agenda"}
        </SectionTitle>
        {canEdit && editing === null && (
          <Btn kind="blue" onClick={() => setEditing("new")}><Plus size={15} /> Add meeting</Btn>
        )}
      </div>

      {isEa && <Pill tone="vip">Assistant view — writing as {user.name}</Pill>}

      {editing === "new" && <MeetingForm initial={blank()} onSave={(m) => save(m)} onCancel={() => setEditing(null)} />}

      {meetings.length === 0 && editing === null && (
        <Empty icon={CalendarDays} title="Nothing scheduled" body="Meetings added here — by you or your assistant — build the trip agenda day by day." />
      )}

      {Object.entries(days).map(([day, list]) => (
        <div key={day}>
          <div className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: C.confident }}>
            {fmtDate(day)}
          </div>
          <div className="space-y-3">
            {list.map((m) =>
              editing === m.id ? (
                <MeetingForm key={m.id} initial={m} onSave={(x) => save(x, m.id)} onCancel={() => setEditing(null)} />
              ) : (
                <Card key={m.id}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 shrink-0 text-lg font-black" style={{ color: C.confident }}>{m.time}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-black" style={{ color: C.navy }}>{m.title}</div>
                      {m.place && <div className="text-xs" style={{ color: C.muted }}>{m.place}</div>}
                      {m.brief && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg p-3 text-xs leading-relaxed"
                          style={{ backgroundColor: C.paper, color: C.ink }}>
                          <FileText size={13} className="mt-0.5 shrink-0" style={{ color: C.confident }} />
                          <span><span className="font-bold" style={{ color: C.confident }}>Brief:</span> {m.brief}</span>
                        </div>
                      )}
                      <div className="mt-1.5 text-[10px]" style={{ color: C.muted }}>added by {m.by}</div>
                    </div>
                    {canEdit && (
                      <div className="flex shrink-0 gap-1">
                        <button onClick={() => setEditing(m.id)} aria-label="Edit" className="rounded-md p-1.5 transition hover:bg-slate-100">
                          <Pencil size={14} style={{ color: C.muted }} />
                        </button>
                        <button onClick={() => remove(m.id)} aria-label="Delete" className="rounded-md p-1.5 transition hover:bg-red-50">
                          <Trash2 size={14} style={{ color: C.red }} />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
