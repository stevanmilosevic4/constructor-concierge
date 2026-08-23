import React, { useState } from "react"
import {
  Plane, Bed, Car, Sparkles, CalendarDays, ShieldCheck, Receipt, MapPin, Users,
  Home, Building2, HelpCircle, ArrowLeft, ArrowRight, Copy, Check, Mail,
  AlertTriangle, CircleCheck, Route, Paperclip, Scale, Info,
} from "lucide-react"
import { C, TONE } from "../../brand.js"
import { REQUEST_TYPES, composeEmail, mailtoLink } from "../../lib/policy.js"
import { update, uid } from "../../lib/store.js"
import { Card, Pill, SectionTitle, Btn, Label, inputCls, inputStyle, Step, Banner, Rule } from "../../components/ui.jsx"

const ICONS = { Plane, Bed, Car, Sparkles, CalendarDays, ShieldCheck, Receipt, MapPin, Users, Home, Building2, HelpCircle }

const STATUS_META = {
  go: { tone: "good", icon: CircleCheck, label: "Clear route" },
  gate: { tone: "warn", icon: AlertTriangle, label: "Needs a decision first" },
  stop: { tone: "stop", icon: AlertTriangle, label: "The policy answers this" },
  route: { tone: "info", icon: Route, label: "Routed to its owner" },
}

/* ------------------------------------------------------------------ */

function QuestionField({ q, value, onChange, answers }) {
  if (q.type === "deadline") {
    const any = value === "anytime"
    const specific = value && value !== "anytime" ? value : ""
    const [d, t] = specific.split("T")
    const date = d || answers?.departure || ""
    const set = (nd, nt) => onChange(`${nd || ""}T${nt || ""}`)
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <button onClick={() => onChange("anytime")} className="flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition"
            style={any ? { backgroundColor: C.confident, color: "#fff", border: `1px solid ${C.confident}` } : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}>
            Anytime
          </button>
          <button onClick={() => set(date, t || "")} className="flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition"
            style={value && !any ? { backgroundColor: C.confident, color: "#fff", border: `1px solid ${C.confident}` } : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}>
            By a specific time
          </button>
        </div>
        {value && !any && (
          <div className="flex gap-2">
            <input type="date" className={inputCls} style={inputStyle} value={date} onChange={(e) => set(e.target.value, t)} aria-label="Landing date" />
            <input type="time" className={inputCls} style={inputStyle} value={t || ""} onChange={(e) => set(date, e.target.value)} aria-label="Latest landing time" />
          </div>
        )}
        {q.hint && <div className="text-xs" style={{ color: C.muted }}>{q.hint}</div>}
      </div>
    )
  }
  if (q.type === "date")
    return <input type="date" className={inputCls} style={inputStyle} value={value || ""} onChange={(e) => onChange(e.target.value)} />
  if (q.type === "text")
    return <input type="text" className={inputCls} style={inputStyle} placeholder={q.placeholder || ""} value={value || ""} onChange={(e) => onChange(e.target.value)} />
  if (q.type === "yesno")
    return (
      <div className="flex gap-2">
        {["yes", "no"].map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className="flex-1 rounded-lg px-3 py-2.5 text-sm font-bold capitalize transition"
            style={value === v
              ? { backgroundColor: C.confident, color: "#fff", border: `1px solid ${C.confident}` }
              : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}
          >
            {v}
          </button>
        ))}
      </div>
    )
  if (q.type === "choice")
    return (
      <div className="space-y-2">
        {q.options.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className="block w-full rounded-lg px-3.5 py-2.5 text-left transition"
            style={value === o.v
              ? { backgroundColor: "#E6F6FF", border: `1.5px solid ${C.blue}` }
              : { backgroundColor: "#fff", border: `1px solid ${C.rule}` }}
          >
            <div className="text-sm font-bold" style={{ color: C.navy }}>{o.label}</div>
            {o.hint && <div className="text-xs" style={{ color: C.muted }}>{o.hint}</div>}
          </button>
        ))}
      </div>
    )
  return null
}

/* ------------------------------------------------------------------ */

function Outcome({ type, answers, outcome, user, onBack }) {
  const meta = STATUS_META[outcome.status] || STATUS_META.route
  const Icon = meta.icon
  const t = TONE[meta.tone]
  const [copied, setCopied] = useState(false)
  const mail = outcome.approvals?.length || outcome.sendTo ? composeEmail(type, answers, outcome, user) : null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${mail.to.join(", ")}\nCc: ${mail.cc.join(", ")}\nSubject: ${mail.subject}\n\n${mail.body}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard blocked */ }
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: C.confident }}>
        <ArrowLeft size={15} /> Ask something else
      </button>

      {/* Verdict */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: t.bg }}>
            <Icon size={20} style={{ color: t.fg }} />
          </div>
          <div>
            <Pill tone={meta.tone}>{meta.label}</Pill>
            <h3 className="mt-1.5 text-lg font-black leading-snug" style={{ color: C.navy }}>{outcome.headline}</h3>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: C.muted }}>{outcome.lede}</p>
            {outcome.hardRule && (
              <p className="mt-2 text-sm font-bold" style={{ color: "#A81000" }}>{outcome.hardRule}</p>
            )}
            {outcome.levelNote && (
              <p className="mt-2 text-xs leading-relaxed" style={{ color: C.confident }}>{outcome.levelNote}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Gates */}
      {outcome.gates?.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {outcome.gates.map((g) => (
            <Card key={g.id} tone={g.tone === "stop" ? "stop" : "warn"}>
              <div className="text-xs font-black uppercase tracking-wide" style={{ color: TONE[g.tone === "stop" ? "stop" : "warn"].fg }}>
                Decision gate
              </div>
              <div className="mt-1 text-sm font-black" style={{ color: C.navy }}>{g.label}</div>
              {g.detail && <div className="mt-0.5 text-xs font-semibold" style={{ color: C.muted }}>{g.detail}</div>}
              <div className="mt-2 text-xs leading-relaxed" style={{ color: C.ink }}>{g.rule}</div>
              <div className="mt-2 text-xs" style={{ color: C.muted }}>
                <span className="font-bold" style={{ color: C.navy }}>Decided by:</span> {g.decidedBy}
                {g.email && <> · <a className="font-semibold" style={{ color: C.confident }} href={`mailto:${g.email}`}>{g.email}</a></>}
              </div>
              {g.provide && (
                <div className="mt-1 text-xs" style={{ color: C.muted }}>
                  <span className="font-bold" style={{ color: C.navy }}>You provide:</span> {g.provide}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Warnings */}
      {outcome.warnings?.map((w, i) => (
        <Banner key={i} tone="stop" icon={AlertTriangle}>{w}</Banner>
      ))}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Steps */}
        {outcome.steps?.length > 0 && (
          <Card>
            <div className="mb-3 text-sm font-black" style={{ color: C.navy }}>What you do, in order</div>
            {outcome.steps.map((st, i) => <Step key={i} n={st.n} title={st.title} body={st.body} tone={st.tone} />)}
          </Card>
        )}

        <div className="space-y-4">
          {/* Approvers */}
          {outcome.approvals?.length > 0 && (
            <Card>
              <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                <Scale size={15} style={{ color: C.confident }} /> Who decides
              </div>
              {outcome.approvals.map((a, i) => (
                <div key={i} className="border-b py-2 last:border-0" style={{ borderColor: C.rule }}>
                  <div className="text-sm font-bold" style={{ color: C.navy }}>{a.who}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{a.why}</div>
                  <div className="text-xs font-semibold" style={{ color: C.confident }}>{a.email}</div>
                </div>
              ))}
            </Card>
          )}

          {/* Attachments */}
          {outcome.attach?.length > 0 && (
            <Card>
              <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
                <Paperclip size={15} style={{ color: C.confident }} /> Attach to the request
              </div>
              <ul className="space-y-1.5">
                {outcome.attach.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: C.ink }}>
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: C.green }} /> {a}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* GDPR / good news notes */}
          {outcome.goodNews && <Banner tone="good" icon={CircleCheck}>{outcome.goodNews}</Banner>}
          {outcome.gdpr && <Banner tone="info" icon={Info}>{outcome.gdpr}</Banner>}
        </div>
      </div>

      {/* Ready-made email */}
      {mail && mail.to.length > 0 && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
              <Mail size={15} style={{ color: C.confident }} /> Your request, already written
            </div>
            <div className="flex gap-2">
              <Btn kind="ghost" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}</Btn>
              <Btn kind="blue" onClick={() => { window.location.href = mailtoLink(mail) }}>
                <Mail size={14} /> Open in mail
              </Btn>
            </div>
          </div>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg p-4 text-xs leading-relaxed" style={{ backgroundColor: C.paper, color: C.ink, border: `1px solid ${C.rule}` }}>
{`To:      ${mail.to.join(", ")}
Cc:      ${mail.cc.join(", ") || "—"}
Subject: ${mail.subject}

${mail.body}`}
          </pre>
        </Card>
      )}

      {/* The line */}
      {outcome.concierge && (
        <Card tone="neutral">
          <div className="text-xs font-black uppercase tracking-wide" style={{ color: C.muted }}>The concierge team's part</div>
          <div className="mt-2 grid gap-3 text-sm sm:grid-cols-3">
            <div><span className="font-bold" style={{ color: "#00654C" }}>Does:</span> <span style={{ color: C.ink }}>{outcome.concierge.does}</span></div>
            <div><span className="font-bold" style={{ color: "#A81000" }}>Does not:</span> <span style={{ color: C.ink }}>{outcome.concierge.doesNot}</span></div>
            <div><span className="font-bold" style={{ color: C.confident }}>Routes to:</span> <span style={{ color: C.ink }}>{outcome.concierge.routeTo}</span></div>
          </div>
          {outcome.policyRefs?.length > 0 && (
            <div className="mt-2 text-[11px]" style={{ color: C.muted }}>Source: {outcome.policyRefs.join(" · ")}</div>
          )}
        </Card>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function Request({ user }) {
  const [typeId, setTypeId] = useState(null)
  const [answers, setAnswers] = useState({})
  const [outcome, setOutcome] = useState(null)
  const type = REQUEST_TYPES.find((r) => r.id === typeId)

  const reset = () => { setTypeId(null); setAnswers({}); setOutcome(null) }

  const submit = () => {
    const res = type.resolve(answers, user)
    setOutcome(res)
    // Log it for the concierge team — visibility, not approval.
    update((s) => ({
      requests: [
        {
          id: uid(), userId: user.id, userName: user.name, type: type.id, label: type.label,
          dest: answers.destination || answers.what || "", created: new Date().toISOString(),
          status: "routed", gates: (res.gates || []).map((g) => g.label),
          routedTo: res.concierge?.routeTo || "—",
        },
        ...s.requests,
      ],
    }))
  }

  if (outcome) return <Outcome type={type} answers={answers} outcome={outcome} user={user} onBack={reset} />

  if (type) {
    const incomplete = (q, v) => !v || (q.type === "deadline" && v !== "anytime" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v))
    const missing = type.questions.filter((q) => q.required && incomplete(q, answers[q.id]))
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <button onClick={reset} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: C.confident }}>
          <ArrowLeft size={15} /> All requests
        </button>
        <SectionTitle sub={type.blurb}>{type.label}</SectionTitle>
        <Card>
          <div className="space-y-4">
            {type.questions.map((q) => (
              <div key={q.id}>
                <Label>{q.label}{q.required && <span style={{ color: C.red }}> *</span>}</Label>
                {q.hint && <p className="mb-1.5 text-xs" style={{ color: C.muted }}>{q.hint}</p>}
                <QuestionField q={q} value={answers[q.id]} answers={answers} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
              </div>
            ))}
          </div>
          <Rule className="my-4" />
          <Btn className="w-full" disabled={missing.length > 0} onClick={submit}>
            Tell me exactly what to do <ArrowRight size={15} />
          </Btn>
          {missing.length > 0 && (
            <p className="mt-2 text-center text-xs" style={{ color: C.muted }}>
              {missing.length} required field{missing.length > 1 ? "s" : ""} to go
            </p>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <SectionTitle sub="Pick what you need. The app answers with the exact route: what to do, who decides, what to attach — and the email already written. The concierge team informs and routes; it never approves and never books.">
        I want to…
      </SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REQUEST_TYPES.map((r) => {
          const Icon = ICONS[r.icon] || HelpCircle
          return (
            <Card key={r.id} onClick={() => setTypeId(r.id)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#E6F6FF" }}>
                <Icon size={18} style={{ color: C.confident }} />
              </div>
              <div className="mt-3 text-sm font-black leading-snug" style={{ color: C.navy }}>{r.label}</div>
              <div className="mt-1 text-xs leading-relaxed" style={{ color: C.muted }}>{r.blurb}</div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
