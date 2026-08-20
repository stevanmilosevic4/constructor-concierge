import React from "react"
import { Inbox } from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { Card, SectionTitle, Pill, Empty } from "../../components/ui.jsx"

export default function Requests() {
  const s = useStore()
  return (
    <div className="space-y-5">
      <SectionTitle sub="Every request the guidance engine has answered, and where it was routed. This is visibility, not a work queue — the app already told the traveller what to do and who decides. Nothing here waits for concierge approval, because concierge approval does not exist.">
        Requests
      </SectionTitle>

      {s.requests.length === 0 ? (
        <Empty icon={Inbox} title="No requests yet" body="When travellers use the request flow, the answers they were given appear here." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="text-left text-[11px] font-black uppercase tracking-wide" style={{ color: C.muted }}>
                  <th className="pb-2 pr-4">When</th>
                  <th className="pb-2 pr-4">Who</th>
                  <th className="pb-2 pr-4">Request</th>
                  <th className="pb-2 pr-4">Gates hit</th>
                  <th className="pb-2">Routed to</th>
                </tr>
              </thead>
              <tbody>
                {s.requests.map((r) => (
                  <tr key={r.id} className="border-t align-top" style={{ borderColor: C.rule }}>
                    <td className="whitespace-nowrap py-2.5 pr-4 text-xs" style={{ color: C.muted }}>
                      {new Date(r.created).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-2.5 pr-4 font-bold" style={{ color: C.navy }}>{r.userName}</td>
                    <td className="py-2.5 pr-4" style={{ color: C.ink }}>
                      {r.label}{r.dest ? <span style={{ color: C.muted }}> — {r.dest}</span> : null}
                    </td>
                    <td className="py-2.5 pr-4">
                      {r.gates.length === 0
                        ? <Pill tone="good">Clear</Pill>
                        : <div className="flex flex-wrap gap-1">{r.gates.map((g, i) => <Pill key={i} tone="warn">{g}</Pill>)}</div>}
                    </td>
                    <td className="py-2.5 text-xs font-semibold" style={{ color: C.confident }}>{r.routedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
