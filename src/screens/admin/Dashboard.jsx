import React from "react"
import { Inbox, Building2, Link2, Users, Megaphone, Scale } from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { ROUTING_MATRIX, POLICY_VERSION } from "../../lib/policy.js"
import { Card, SectionTitle, Banner, Pill } from "../../components/ui.jsx"

export default function Dashboard() {
  const s = useStore()
  const stats = [
    ["Requests logged", s.requests.length, Inbox],
    ["Cities live", Object.keys(s.cities).length, Building2],
    ["Guest links active", s.guestLinks.length, Link2],
    ["Group trips", s.groupTrips.length, Users],
    ["Pack updates pushed", s.broadcasts.length, Megaphone],
  ]

  return (
    <div className="space-y-6">
      <SectionTitle sub={`Concierge operations. Source of truth: ${POLICY_VERSION}.`}>Dashboard</SectionTitle>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map(([label, n, Icon]) => (
          <Card key={label} className="!p-4">
            <Icon size={16} style={{ color: C.confident }} />
            <div className="mt-2 text-2xl font-black" style={{ color: C.navy }}>{n}</div>
            <div className="text-[11px] font-semibold leading-tight" style={{ color: C.muted }}>{label}</div>
          </Card>
        ))}
      </div>

      <Banner tone="stop" icon={Scale} title="The line to hold">
        The concierge team never becomes the approver and never becomes the booker. Every request either has an
        answer already written down, or an owner it belongs to. Exceptions are escalated — never granted, by anyone
        on this team, at any seniority of asker. The first senior person who says “just book it for me” starts the slide.
      </Banner>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-black" style={{ color: C.navy }}>The routing matrix — the escalation rule in practice</div>
          <Pill tone="neutral">Matrix §7</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[11px] font-black uppercase tracking-wide" style={{ color: C.muted }}>
                <th className="pb-2 pr-4">Request received</th>
                <th className="pb-2 pr-4">Concierge does</th>
                <th className="pb-2 pr-4">Does not</th>
                <th className="pb-2">Route to</th>
              </tr>
            </thead>
            <tbody>
              {ROUTING_MATRIX.map((r, i) => (
                <tr key={i} className="border-t align-top" style={{ borderColor: C.rule }}>
                  <td className="py-2.5 pr-4 font-bold" style={{ color: C.navy }}>{r.req}</td>
                  <td className="py-2.5 pr-4" style={{ color: "#00654C" }}>{r.does}</td>
                  <td className="py-2.5 pr-4" style={{ color: "#A81000" }}>{r.doesNot}</td>
                  <td className="py-2.5 font-semibold" style={{ color: C.confident }}>{r.route}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
