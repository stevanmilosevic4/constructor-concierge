/* =====================================================================
   Sign-in logic.

   Two doors, no role choice at the door:
   1. Work email — the app resolves who you are from the People registry
      (maintained by the concierge team). Unknown addresses on an allowed
      domain sign in as a Standard employee and appear in the registry.
   2. Concierge team code — admin access. Only a SHA-256 hash of the code
      lives here, so the code is not readable in the shipped bundle.

   HONESTY NOTE: on a static site this is an access gate, not security —
   there is no server to keep secrets on. The real gate arrives with SSO
   (Microsoft Entra ID) in the backend phase; this file is written so that
   swapping it out touches nothing else.
   ===================================================================== */

// SHA-256 of the concierge team access code.
const ADMIN_CODE_HASH = "d9242d785764f8a2d160fb134e1c4cccdf61c8d69c8ebac633e384963b66b608"

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyAdminCode(code) {
  return (await sha256Hex(code.trim())) === ADMIN_CODE_HASH
}

export const normalizeEmail = (e) => (e || "").trim().toLowerCase()

export const emailDomain = (e) => normalizeEmail(e).split("@")[1] || ""

export function isAllowedDomain(email, allowedDomains) {
  const d = emailDomain(email)
  return Boolean(d) && allowedDomains.some((a) => d === a.trim().toLowerCase())
}

/* The email domain tells us the employing entity — no dropdown needed. */
export function entityFromEmail(email) {
  const d = emailDomain(email)
  if (d === "constructor.university") return "Constructor University"
  if (d === "constructor.org") return "Constructor Knowledge"
  return "Constructor Knowledge"
}

/* "ana.petrovic@…" → "Ana Petrovic" — a first guess the admin can correct. */
export function nameFromEmail(email) {
  const local = normalizeEmail(email).split("@")[0]
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "Traveller"
}
