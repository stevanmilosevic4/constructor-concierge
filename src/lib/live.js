/* =====================================================================
   Live data — weather, exchange rates, city photos.

   All three run client-side against free, keyless, CORS-open services,
   so they work on a static host with no backend:
     · Weather  — Open-Meteo (open-meteo.com), no key, updates hourly
     · FX rates — open.er-api.com (ECB-derived, incl. RSD/TRY/BRL), daily
     · Photos   — Wikipedia's lead image per city, via the REST summary API

   Every fetch is cached in localStorage with a TTL, and every consumer
   must render sanely when the network is down — the cached value is
   served stale rather than nothing.
   ===================================================================== */

import { useEffect, useState } from "react"

const CACHE_PREFIX = "concierge-live:"

async function cached(key, ttlMs, fetcher) {
  const k = CACHE_PREFIX + key
  try {
    const raw = localStorage.getItem(k)
    if (raw) {
      const { t, v } = JSON.parse(raw)
      if (Date.now() - t < ttlMs) return v
      // stale — refetch below, but keep it as the fallback
      try {
        const fresh = await fetcher()
        localStorage.setItem(k, JSON.stringify({ t: Date.now(), v: fresh }))
        return fresh
      } catch {
        return v // offline: stale beats nothing
      }
    }
  } catch { /* corrupted cache — fall through */ }
  const fresh = await fetcher()
  try { localStorage.setItem(k, JSON.stringify({ t: Date.now(), v: fresh })) } catch { /* full */ }
  return fresh
}

/* Generic hook: null while loading, undefined on hard failure. */
function useLive(key, ttlMs, fetcher, deps) {
  const [value, setValue] = useState(null)
  useEffect(() => {
    let alive = true
    cached(key, ttlMs, fetcher)
      .then((v) => { if (alive) setValue(v) })
      .catch(() => { if (alive) setValue(undefined) })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return value
}

/* ------------------------------------------------------------------ */
/*  Weather — current conditions + 3-day range                         */
/* ------------------------------------------------------------------ */

const WMO = {
  0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Freezing fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain", 67: "Freezing rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Light showers", 81: "Showers", 82: "Heavy showers",
  85: "Snow showers", 86: "Snow showers", 95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
}

export function useWeather(lat, lon) {
  return useLive(
    `wx:${lat},${lon}`,
    30 * 60 * 1000, // 30 min
    async () => {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&forecast_days=4&timezone=auto`
      const r = await fetch(url)
      if (!r.ok) throw new Error("weather " + r.status)
      const d = await r.json()
      return {
        temp: Math.round(d.current.temperature_2m),
        feels: Math.round(d.current.apparent_temperature),
        code: d.current.weather_code,
        label: WMO[d.current.weather_code] || "—",
        wind: Math.round(d.current.wind_speed_10m),
        humidity: d.current.relative_humidity_2m,
        days: d.daily.time.map((t, i) => ({
          date: t,
          max: Math.round(d.daily.temperature_2m_max[i]),
          min: Math.round(d.daily.temperature_2m_min[i]),
          label: WMO[d.daily.weather_code[i]] || "—",
          rain: d.daily.precipitation_probability_max?.[i],
        })),
      }
    },
    [lat, lon],
  )
}

/* ------------------------------------------------------------------ */
/*  Exchange rates — EUR-based table, crosses computed locally         */
/* ------------------------------------------------------------------ */

export function useRates() {
  return useLive(
    "fx:EUR",
    12 * 60 * 60 * 1000, // 12 h — the source updates daily
    async () => {
      const r = await fetch("https://open.er-api.com/v6/latest/EUR")
      if (!r.ok) throw new Error("fx " + r.status)
      const d = await r.json()
      if (d.result !== "success") throw new Error("fx result " + d.result)
      return { rates: d.rates, updated: d.time_last_update_utc }
    },
    [],
  )
}

/* 1 unit of `from` in `to`, from a EUR-based table. */
export function convert(rates, from, to) {
  if (!rates?.rates?.[from] || !rates?.rates?.[to]) return null
  return rates.rates[to] / rates.rates[from]
}

export function fmtRate(x) {
  if (x === null || x === undefined) return "—"
  if (x >= 100) return x.toFixed(1)
  if (x >= 10) return x.toFixed(2)
  return x.toFixed(3)
}

/* ------------------------------------------------------------------ */
/*  City photo — the Wikipedia lead image                              */
/* ------------------------------------------------------------------ */

export function useCityImage(wikiTitle) {
  return useLive(
    `img:${wikiTitle}`,
    7 * 24 * 60 * 60 * 1000, // a week
    async () => {
      const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`)
      if (!r.ok) throw new Error("wiki " + r.status)
      const d = await r.json()
      const src = d.originalimage?.source || d.thumbnail?.source
      if (!src) throw new Error("no image")
      return { src, page: d.content_urls?.desktop?.page, credit: "Wikipedia" }
    },
    [wikiTitle],
  )
}

/* ------------------------------------------------------------------ */
/*  Local time — ticking clock for a timezone                          */
/* ------------------------------------------------------------------ */

export function useLocalTime(tz) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  try {
    return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(now)
  } catch {
    return ""
  }
}
