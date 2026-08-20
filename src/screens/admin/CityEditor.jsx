import React, { useState } from "react"
import { Plus, Trash2, Tag, Building2, Save } from "lucide-react"
import { C } from "../../brand.js"
import { useStore, update } from "../../lib/store.js"
import { Card, SectionTitle, Btn, Label, inputCls, inputStyle, Pill, Banner } from "../../components/ui.jsx"

/* The admin edits structured records, and the traveller-facing pack is
   generated from them — the strategy note's cure for stale documents.
   The app "remembers": everything saved here persists and shows for
   every traveller immediately. */

const OFFER_CATS = ["Stay", "Transfer", "Eat", "Health", "Wellbeing", "Airport", "Transport", "Shop", "Service"]

const blankOffer = { name: "", cat: "Stay", offer: "", how: "", code: "" }

export default function CityEditor() {
  const s = useStore()
  const names = Object.keys(s.cities)
  const [city, setCity] = useState(names[0])
  const [offer, setOffer] = useState(blankOffer)
  const [newCity, setNewCity] = useState("")
  const d = s.cities[city]

  const setField = (k) => (e) => {
    const v = e.target.value
    update((st) => ({ cities: { ...st.cities, [city]: { ...st.cities[city], [k]: v, updatedAt: new Date().toISOString().slice(0, 10) } } }))
  }

  const addOffer = () => {
    if (!offer.name || !offer.offer || !offer.code) return
    update((st) => ({
      cities: {
        ...st.cities,
        [city]: { ...st.cities[city], offers: [...st.cities[city].offers, offer], updatedAt: new Date().toISOString().slice(0, 10) },
      },
    }))
    setOffer(blankOffer)
  }

  const removeOffer = (code) => {
    update((st) => ({
      cities: { ...st.cities, [city]: { ...st.cities[city], offers: st.cities[city].offers.filter((o) => o.code !== code) } },
    }))
  }

  const addCity = () => {
    const n = newCity.trim()
    if (!n || s.cities[n]) return
    update((st) => ({
      cities: {
        ...st.cities,
        [n]: {
          tag: "New", country: "", currency: "", emergency: "112", police: "", tz: "",
          owner: "Concierge team · review quarterly", updatedAt: new Date().toISOString().slice(0, 10),
          intro: "", weather: null, wallet: null,
          transfers: [], health: [], family: [], eat: [], wellbeing: [], essentials: [], hotels: [], offers: [],
        },
      },
    }))
    setCity(n)
    setNewCity("")
  }

  return (
    <div className="space-y-5">
      <SectionTitle sub="One record per vendor, one sheet per city, a named owner and a review date — the pack the traveller sees is generated from this. Add a partner or a discount here and every traveller has it immediately; the app remembers.">
        Cities & partners
      </SectionTitle>

      <div className="flex flex-wrap items-center gap-2">
        {names.map((n) => (
          <button key={n} onClick={() => setCity(n)}
            className="rounded-full px-4 py-2 text-sm font-bold transition"
            style={city === n ? { backgroundColor: C.navy, color: "#fff" } : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}>
            {n}
          </button>
        ))}
        <div className="flex items-center gap-1">
          <input className={inputCls + " !w-36"} style={inputStyle} placeholder="Add city…" value={newCity}
            onChange={(e) => setNewCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCity()} />
          <Btn kind="ghost" onClick={addCity}><Plus size={14} /></Btn>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Building2 size={15} style={{ color: C.confident }} /> {city}
          </div>
          <Pill tone="neutral">{d.owner} · updated {d.updatedAt}</Pill>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div><Label>Tag</Label><input className={inputCls} style={inputStyle} value={d.tag} onChange={setField("tag")} /></div>
          <div><Label>Country</Label><input className={inputCls} style={inputStyle} value={d.country || ""} onChange={setField("country")} /></div>
          <div><Label>Currency</Label><input className={inputCls} style={inputStyle} value={d.currency || ""} onChange={setField("currency")} /></div>
          <div className="sm:col-span-3">
            <Label>Intro — the first thing a traveller reads</Label>
            <textarea rows={2} className={inputCls} style={inputStyle} value={d.intro} onChange={setField("intro")} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
          <Tag size={15} style={{ color: C.confident }} /> Offers & partnerships in {city}
        </div>

        <div className="space-y-2">
          {d.offers.map((o) => (
            <div key={o.code} className="flex items-start justify-between gap-3 rounded-lg p-3" style={{ backgroundColor: C.paper }}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: C.navy }}>{o.name}</span>
                  <Pill tone="info">{o.cat}</Pill>
                  <span className="font-mono text-[11px] font-bold" style={{ color: C.confident }}>{o.code}</span>
                </div>
                <div className="mt-0.5 text-xs" style={{ color: C.ink }}>{o.offer}</div>
                <div className="text-[11px]" style={{ color: C.muted }}>{o.how}</div>
              </div>
              <button onClick={() => removeOffer(o.code)} aria-label="Remove offer"><Trash2 size={14} style={{ color: C.red }} /></button>
            </div>
          ))}
          {d.offers.length === 0 && <p className="text-xs" style={{ color: C.muted }}>No offers yet for {city}.</p>}
        </div>

        <div className="mt-4 grid gap-3 rounded-xl2 p-4 sm:grid-cols-2" style={{ border: `1px dashed ${C.rule}` }}>
          <div><Label>Partner name *</Label><input className={inputCls} style={inputStyle} value={offer.name} onChange={(e) => setOffer({ ...offer, name: e.target.value })} /></div>
          <div>
            <Label>Category</Label>
            <select className={inputCls} style={inputStyle} value={offer.cat} onChange={(e) => setOffer({ ...offer, cat: e.target.value })}>
              {OFFER_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><Label>The offer *</Label><input className={inputCls} style={inputStyle} placeholder="e.g. 15% off the flexible rate, breakfast included" value={offer.offer} onChange={(e) => setOffer({ ...offer, offer: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>How to redeem</Label><input className={inputCls} style={inputStyle} placeholder="Quote the code when booking / show the QR at reception" value={offer.how} onChange={(e) => setOffer({ ...offer, how: e.target.value })} /></div>
          <div><Label>Code * (drives the QR)</Label><input className={inputCls} style={inputStyle} placeholder="CONSTR-XXX-YYY" value={offer.code} onChange={(e) => setOffer({ ...offer, code: e.target.value.toUpperCase() })} /></div>
          <div className="flex items-end"><Btn onClick={addOffer}><Save size={14} /> Add offer</Btn></div>
        </div>
      </Card>

      <Banner tone="info" title="Vetting standard">
        A recommendation is an endorsement in practice. Every record here implies: licensed operator, insurance
        certificate on file, named contact, agreed rate, review date. If a vendor would not pass that sentence,
        it does not go in the pack.
      </Banner>
    </div>
  )
}
