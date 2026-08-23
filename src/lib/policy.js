/* =====================================================================
   THE POLICY ENGINE

   Everything in this file is derived from:
     · Constructor Knowledge Global Travel & Expense Policy v1 (4 Sep 2025)
     · Travel & Expense — The Matrix (quick reference, v1.0 Aug 2026)
     · Travel Approval — Process Map (v1.0 Aug 2026)
     · Concierge Service — Scope & Operating Model (concept note v2)

   THE LINE THIS FILE EXISTS TO HOLD:
   the concierge team never approves and never books. Every outcome below
   either answers the question outright, or names the owner it belongs to.
   No branch of this engine may return "the concierge team will arrange it".
   ===================================================================== */

export const POLICY_VERSION = "Global T&E Policy v1 · 4 September 2025"

/* ------------------------------------------------------------------ */
/*  Contacts — section 8 of the Matrix                                 */
/* ------------------------------------------------------------------ */

export const CONTACTS = {
  finance:  { name: "Finance",                    email: "invoice@constructor.org",  for: "Expense claims, invoices, reimbursement" },
  hr:       { name: "HR",                         email: "hr@constructor.org",       for: "Extended or frequent travel, scope of trip" },
  mobility: { name: "Mobility",                   email: "le@constructor.org",       for: "Visas, immigration, mobility" },
  tne:      { name: "Travel & Expense Officer",   email: "eg@constructor.org",       for: "Travel arrangements and options", person: "Eugenia" },
  booking:  { name: "Booking partner",            email: "logoks@logoks.lv",         for: "Flight and hotel booking" },
  concierge:{ name: "Concierge team",             email: "concierge@constructor.org",for: "City packs, partner rates, guidance", phone: "+49 421 200 0000" },
}

/* Final approval — process map step 5. One approval desk for every
   entity: oz@constructor.org with bojana@constructor.org in copy. */
export const ENTITIES = {
  "Constructor University": {
    short: "CU",
    approver: "oz@constructor.org",
    approverLabel: "oz@constructor.org / bojana@constructor.org",
    cc: ["bojana@constructor.org"],
  },
  "Constructor Knowledge": {
    short: "CK",
    approver: "oz@constructor.org",
    approverLabel: "oz@constructor.org / bojana@constructor.org",
    cc: ["bojana@constructor.org"],
  },
  "Constructor Group": {
    short: "CG",
    approver: "oz@constructor.org",
    approverLabel: "oz@constructor.org / bojana@constructor.org",
    cc: ["bojana@constructor.org"],
  },
}

/* ------------------------------------------------------------------ */
/*  Traveller levels — Matrix section 3                                */
/*  Note: business class is never granted at level; it is a C-level of  */
/*  Constructor Group decision, exceptional cases only.                 */
/* ------------------------------------------------------------------ */

export const LEVELS = {
  "C-level": {
    rank: 4, vip: true,
    businessClass: "Decides — for Constructor Group C-level only",
    chooseDayTime: true, chooseDay: true, flagCarrier: true, bookAhead: 1, changeTimes: true,
    note: "Executive tier. Guest links, protocol support and EA delegation are available.",
  },
  "Managing Director": {
    rank: 3, vip: true,
    businessClass: "No", chooseDayTime: true, chooseDay: true, flagCarrier: true, bookAhead: 1, changeTimes: true,
  },
  "VP / Director": {
    rank: 2, vip: false,
    businessClass: "No", chooseDayTime: false, chooseDay: true, flagCarrier: true, bookAhead: 2, changeTimes: false,
  },
  "Employee": {
    rank: 1, vip: false,
    businessClass: "No", chooseDayTime: false, chooseDay: false, flagCarrier: false, bookAhead: 4, changeTimes: false,
  },
}

export const isVip = (level) => Boolean(LEVELS[level]?.vip)

/* ------------------------------------------------------------------ */
/*  Deadlines — Matrix section 5, process map footer                   */
/* ------------------------------------------------------------------ */

export const DEADLINES = {
  bookAheadDays: 14,
  expenseDays: 30,
  expenseHardLimitDays: 90,
  cardStatementDays: 30,
}

export const DEADLINE_ROWS = [
  ["Book the trip",                    "At least 2 weeks before departure",       "Written justification required with the request"],
  ["Submit the expense report",        "Within 30 days of incurring the expense",  "Payment delayed"],
  ["Absolute submission limit",        "90 days",                                  "Not reimbursed at all"],
  ["Submit company credit card statements", "Within 30 days of the expense",       "Reconciliation blocked"],
  ["Report format",                    "One report per trip or per month",         "Incomplete reports are returned"],
]

/* Receipts: scans accepted in three countries only — everywhere else the
   hard copy decides, because local law decides, not the company. */
export const SCAN_COUNTRIES = ["Germany", "Switzerland", "Serbia"]

/* ------------------------------------------------------------------ */
/*  Reimbursement matrix — Matrix section 4                            */
/* ------------------------------------------------------------------ */

export const REIMBURSEMENT = [
  { cat: "Flights and trains",        pos: "pays",  rule: "Economy / 2nd class, including intercontinental. If you paid it yourself, justify why", evidence: "Invoice if self-paid" },
  { cat: "Accommodation",             pos: "pays",  rule: "Must be booked through the designated route or it will not be reimbursed. Corporate apartments in Bremen and Schaffhausen are preferred", evidence: "Invoice" },
  { cat: "Public transport",          pos: "yes",   rule: "The expected means of ground transport", evidence: "Ticket showing route and cost" },
  { cat: "Taxi / Uber",               pos: "maybe", rule: "Only where public transport is unreasonable on time, cost or safety grounds", evidence: "Receipt" },
  { cat: "Rental car",                pos: "maybe", rule: "Exception only. Mid-size; all insurance options covered; refuel before return; fines never reimbursed", evidence: "Itemised receipt" },
  { cat: "Breakfast",                 pos: "yes",   rule: "Should be included in the room rate. If not, up to 15 EUR/CHF/USD per day", evidence: "Receipt" },
  { cat: "Lunch and dinner",          pos: "yes",   rule: "Follows the statutory per-diem regime of the country — see per diem lookup", evidence: "Per local rule" },
  { cat: "Laundry",                   pos: "maybe", rule: "Trips longer than 3 days only", evidence: "Receipt" },
  { cat: "Vaccinations and visas",    pos: "yes",   rule: "Where required for the trip", evidence: "Receipt" },
  { cat: "Passport or ID renewal",    pos: "no",    rule: "Personal document, personal cost", evidence: "—" },
  { cat: "Mini-bar, spa, gym, in-room entertainment", pos: "no", rule: "Personal consumption", evidence: "—" },
  { cat: "Class or room upgrades",    pos: "no",    rule: "Any upgrade paid personally stays personal", evidence: "—" },
  { cat: "Childcare, pet care, personal days", pos: "no", rule: "Including days added before or after the trip", evidence: "—" },
  { cat: "Toiletries, medicines, clothing, grooming, reading material", pos: "no", rule: "Personal items", evidence: "—" },
  { cat: "Personal celebrations — birthdays, showers, promotions, farewells", pos: "no", rule: "Company milestones, graduations and team events can be, with prior C-level approval", evidence: "—" },
]

/* ------------------------------------------------------------------ */
/*  Per diem — Matrix section 6. Deliberately links to the statutory   */
/*  source rather than quoting figures, because the rates change       */
/*  annually and a stale number in an app is worse than no number.     */
/* ------------------------------------------------------------------ */

export const PER_DIEM_SOURCES = {
  Germany: {
    source: "BMF circular on the tax treatment of travel costs for foreign business travel",
    url: "https://www.bundesfinanzministerium.de/",
    note: "Published annually, usually in the autumn for the following year. Rates differ per destination country and for arrival/departure days.",
  },
  Switzerland: {
    source: "Cantonal authority approved rates",
    url: "https://www.estv.admin.ch/",
    note: "Approved per canton — confirm which cantonal ruling applies to the employing entity.",
  },
  Bulgaria: {
    source: "State Gazette (Държавен вестник)",
    url: "https://dv.parliament.bg/",
    note: "Statutory daily allowances for business travel abroad.",
  },
  Singapore: {
    source: "IRAS acceptable per-diem rates",
    url: "https://www.iras.gov.sg/",
    note: "IRAS publishes an acceptable rate per country; amounts above it are taxable.",
  },
  "United States": {
    source: "US Department of State per-diem allowances",
    url: "https://aoprals.state.gov/",
    note: "Separate lodging and M&IE components, updated monthly.",
  },
}

/* ------------------------------------------------------------------ */
/*  The red gates — process map "CHECK FIRST"                          */
/*  Each returns the owner who decides. None of them is the concierge.  */
/* ------------------------------------------------------------------ */

export const GATES = {
  businessClass: {
    id: "businessClass",
    label: "Business class",
    tone: "stop",
    decidedBy: "C-level of Constructor Group",
    email: "oz@constructor.org",
    rule: "Exceptional cases only. Not granted on comfort or status grounds.",
    provide: "A written justification setting out why economy does not work for this specific trip.",
  },
  comfortEconomy: {
    id: "comfortEconomy",
    label: "Comfort economy seat",
    tone: "warn",
    decidedBy: "C-level management",
    email: "oz@constructor.org",
    rule: "Intercontinental flights over 8 hours only.",
    provide: "Flight duration and routing, showing the leg is over 8 hours.",
  },
  rentalCar: {
    id: "rentalCar",
    label: "Rental car",
    tone: "stop",
    decidedBy: "C-level management, in advance",
    email: "oz@constructor.org",
    rule: "Exceptional cases only. Mid-size; larger only with 3 or more travellers. Fines are never reimbursed.",
    provide: "Why public transport and transfers do not work, and the number of travellers.",
  },
  extendedTravel: {
    id: "extendedTravel",
    label: "Over 2 weeks, over 60 days a year in one country, or frequent repeat travel",
    tone: "stop",
    decidedBy: "HR",
    email: "hr@constructor.org",
    rule: "HR must be contacted BEFORE any booking is made. This is a tax and employment-law question, not a travel one.",
    provide: "Dates, country, and how many days you will have spent there this year.",
  },
  lateBooking: {
    id: "lateBooking",
    label: "Less than 2 weeks' notice",
    tone: "warn",
    decidedBy: "Line manager, then C-level",
    rule: "Permitted, but a written reason for the lateness must travel with the request.",
    provide: "One or two sentences explaining why this could not be booked earlier.",
  },
  weekendNight: {
    id: "weekendNight",
    label: "Weekend night included",
    tone: "warn",
    decidedBy: "Line manager, then C-level",
    rule: "Reimbursable only in defined cases: a Friday meeting with no return option, a Saturday event attended for the company, or a demonstrable cost saving.",
    provide: "Which of the three cases applies, and evidence for it.",
  },
  outsideScope: {
    id: "outsideScope",
    label: "Purpose outside the usual scope of business",
    tone: "stop",
    decidedBy: "HR",
    email: "hr@constructor.org",
    rule: "Describe the activity to HR before anything is booked.",
    provide: "A description of the activity and why it is being treated as business travel.",
  },
}

/* ------------------------------------------------------------------ */
/*  Concierge routing matrix — Matrix section 7                        */
/* ------------------------------------------------------------------ */

export const ROUTING_MATRIX = [
  { req: "“I'm going to Istanbul — what do we have?”", does: "Sends the city pack and partner rates", doesNot: "—", route: "No routing needed" },
  { req: "“Book my flight / hotel”", does: "Points to the booking route and confirms the approval is attached", doesNot: "Book on the traveller's behalf", route: "Booking partner, once approved" },
  { req: "“Can I fly business?”", does: "Explains the rule and the route", doesNot: "Judge the merits", route: "C-level of Constructor Group" },
  { req: "“My trip is 3 weeks / I'm there monthly”", does: "Flags it as extended travel before booking", doesNot: "Approve or waive", route: "HR" },
  { req: "“Can I claim this?”", does: "Points to the relevant row of the expense matrix", doesNot: "Rule on borderline items", route: "Finance" },
  { req: "“I lost the receipt” / reimbursement query", does: "Restates the deadline rules", doesNot: "Intervene in the claim", route: "Finance" },
  { req: "Visa or entry requirements", does: "Provides the matrix and the vetted handler", doesNot: "Complete applications", route: "Mobility" },
  { req: "“I need a car at the airport”", does: "Provides the partner link, code and fixed rate", doesNot: "Make the booking", route: "Transfer partner" },
  { req: "Family, schooling, medical, relocation questions", does: "Sends the relevant city or relocation pack", doesNot: "Advise on individual circumstances", route: "HR where employment terms are involved" },
  { req: "VIP or event guest travel", does: "Owns the guest journey, briefs the vendors", doesNot: "Staff the event directly", route: "Local DMC or agency" },
  { req: "Anything outside the policy", does: "Says so, and says who decides", doesNot: "Grant exceptions", route: "Line manager, then C-level" },
]

/* ------------------------------------------------------------------ */
/*  Date helpers                                                       */
/* ------------------------------------------------------------------ */

export function daysUntil(dateStr, today = new Date()) {
  if (!dateStr) return null
  const d = new Date(dateStr + "T00:00:00")
  if (Number.isNaN(d.getTime())) return null
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((d - t) / 86400000)
}

export function tripNights(start, end) {
  if (!start || !end) return null
  const a = new Date(start + "T00:00:00"), b = new Date(end + "T00:00:00")
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null
  return Math.max(0, Math.round((b - a) / 86400000))
}

export function includesWeekendNight(start, end) {
  if (!start || !end) return false
  const a = new Date(start + "T00:00:00"), b = new Date(end + "T00:00:00")
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return false
  for (let d = new Date(a); d < b; d.setDate(d.getDate() + 1)) {
    const wd = d.getDay()          // night of Fri (5) or Sat (6) is a weekend night
    if (wd === 5 || wd === 6) return true
  }
  return false
}

export const fmtDate = (s) =>
  !s ? "" : new Date(s + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

/* ------------------------------------------------------------------ */
/*  evaluateTrip — the gate check behind the trip planner              */
/* ------------------------------------------------------------------ */

export function evaluateTrip(trip, user) {
  const entity = ENTITIES[trip.entity] || ENTITIES["Constructor Knowledge"]
  const level = LEVELS[trip.level] || LEVELS["Employee"]
  const notice = daysUntil(trip.start)
  const nights = tripNights(trip.start, trip.end)
  const hits = []

  if (notice !== null && notice < DEADLINES.bookAheadDays && notice >= 0) {
    hits.push({ ...GATES.lateBooking, detail: `Departure is in ${notice} day${notice === 1 ? "" : "s"} — under the 2-week rule.` })
  }
  if (trip.businessClass) hits.push(GATES.businessClass)
  if (trip.comfortEconomy) hits.push(GATES.comfortEconomy)
  if (trip.rentalCar) hits.push(GATES.rentalCar)
  if (nights !== null && nights > 14) {
    hits.push({ ...GATES.extendedTravel, detail: `This trip is ${nights} nights — over the 2-week threshold.` })
  } else if (trip.frequent) {
    hits.push({ ...GATES.extendedTravel, detail: "Flagged as frequent or repeat travel to this country." })
  }
  if (trip.weekendNight || includesWeekendNight(trip.start, trip.end)) {
    hits.push({ ...GATES.weekendNight, detail: "The dates you entered include a Friday or Saturday night." })
  }
  if (trip.outsideScope) hits.push(GATES.outsideScope)

  // De-duplicate: the same gate may be hit twice (e.g. extended by both tests).
  const gates = hits.filter((g, i) => hits.findIndex((h) => h.id === g.id) === i)

  const needsHr = gates.some((g) => g.id === "extendedTravel" || g.id === "outsideScope")

  const steps = [
    { n: 1, title: "Define the trip", body: "Purpose, dates, destination and a projected budget. Every trip needs a stated business reason.", owner: "You" },
    ...(needsHr ? [{ n: "!", title: "Contact HR before booking", body: "Extended, frequent or out-of-scope travel is settled with HR before any booking request goes out.", owner: CONTACTS.hr.email, tone: "stop" }] : []),
    { n: 2, title: "Line manager approves", body: "By email. This approval is the document you attach to everything that follows.", owner: "Line manager" },
    { n: 3, title: "Send the booking request", body: `To the booking partner (${CONTACTS.booking.email}), copying the Travel & Expense Officer (${CONTACTS.tne.email}), with the manager's approval attached.`, owner: "You" },
    { n: 4, title: "T&E Officer evaluates", body: "Eugenia reviews the options against policy — lowest logical fare, economy class, cost-conscious hotel.", owner: CONTACTS.tne.email },
    { n: 5, title: "C-level gives final approval", body: `${entity.approverLabel}. Only then is the booking confirmed.`, owner: entity.approverLabel },
  ]

  return { entity, level, notice, nights, gates, needsHr, steps, clear: gates.length === 0 }
}

/* ------------------------------------------------------------------ */
/*  THE REQUEST CATALOGUE                                              */
/*                                                                     */
/*  This is what the employee sees when they pick "I want to…".        */
/*  Every type has a short question flow and a resolver that returns a  */
/*  complete instruction: what to do, who approves, where it goes,      */
/*  what to attach, and what the concierge team will and will not do.   */
/* ------------------------------------------------------------------ */

const say = (o) => ({
  status: "route",
  warnings: [],
  attach: [],
  approvals: [],
  steps: [],
  policyRefs: [],
  ...o,
})

/* Shared builder for the standard booking chain, used by flight / hotel /
   rail — they differ only in wording and in the gates that can fire. */
function bookingOutcome({ what, answers, user, extraGates = [], extraAttach = [], extraSteps = [] }) {
  const entity = ENTITIES[user.entity] || ENTITIES["Constructor Knowledge"]
  const notice = daysUntil(answers.departure)
  const late = notice !== null && notice < DEADLINES.bookAheadDays
  const gates = [...extraGates]
  if (late && notice >= 0) gates.push({ ...GATES.lateBooking, detail: `Departure is in ${notice} day${notice === 1 ? "" : "s"}.` })

  const attach = [
    "Your line manager's approval email",
    "Purpose of the trip in one line",
    "Projected budget",
    ...(late ? ["A written reason for the late booking — this is mandatory under 2 weeks"] : []),
    ...extraAttach,
  ]

  return say({
    status: late || gates.length ? "gate" : "go",
    headline: late
      ? `${what} at short notice — you can still request it, but the lateness must be justified in writing`
      : `${what} — you are inside the normal route`,
    lede: late
      ? `Your departure is ${notice} day${notice === 1 ? "" : "s"} away. The policy expects at least ${DEADLINES.bookAheadDays} days. That does not block the trip — it means a written reason travels with the request and both the line manager and C-level see it.`
      : `You are ${notice === null ? "" : notice + " days "}ahead of departure, which is inside the ${DEADLINES.bookAheadDays}-day expectation. This is the ordinary route: manager first, then the booking partner, then final approval.`,
    gates,
    steps: [
      { n: 1, title: "Get your line manager's approval by email", body: "Purpose, dates, destination, projected budget. Keep the reply — it is the attachment for every step after this." },
      ...extraSteps,
      { n: 2, title: `Send the ${what.toLowerCase()} request`, body: `To ${CONTACTS.booking.email}, copying ${CONTACTS.tne.email}, with the manager's approval attached.` },
      { n: 3, title: "Eugenia evaluates the options", body: "Against policy — lowest logical fare, economy class, cost-conscious hotel. She may come back with an alternative." },
      { n: 4, title: "C-level confirms", body: `${entity.approverLabel}. The booking is only confirmed after this.` },
    ],
    approvals: [
      { who: "Line manager", why: "First approval — required for every trip", email: user.managerEmail || "your line manager" },
      { who: "Travel & Expense Officer (Eugenia)", why: "Evaluates the options against policy", email: CONTACTS.tne.email },
      { who: `C-level — ${user.entity}`, why: "Final approval before the booking is confirmed", email: entity.approverLabel },
    ],
    attach,
    sendTo: { to: [CONTACTS.booking.email], cc: [CONTACTS.tne.email] },
    concierge: {
      does: "Sends you the city pack, the partner rates and the fixed transfer prices, and checks your manager's approval is attached before the request goes out.",
      doesNot: "Book on your behalf, and does not approve anything.",
      routeTo: "Booking partner, once approved",
    },
    policyRefs: ["Process map steps 1–5", "Matrix section 1"],
  })
}

export const REQUEST_TYPES = [
  /* ---------------------------------------------------------------- */
  {
    id: "flight",
    icon: "Plane",
    label: "Book a flight",
    blurb: "Any flight, any destination — including a leg of a longer trip.",
    questions: [
      { id: "departure", label: "When do you fly out?", type: "date", required: true },
      { id: "return", label: "When do you come back?", type: "date" },
      { id: "destination", label: "Where to?", type: "text", placeholder: "City or airport", required: true },
      { id: "purpose", label: "What is the business reason?", type: "text", placeholder: "One line is enough", required: true },
      { id: "cabin", label: "What cabin are you asking for?", type: "choice", required: true,
        options: [
          { v: "economy", label: "Economy", hint: "The default for everyone, including intercontinental" },
          { v: "comfort", label: "Comfort economy", hint: "Only on intercontinental flights over 8 hours" },
          { v: "business", label: "Business class", hint: "Exceptional cases only, Constructor Group C-level" },
        ] },
      { id: "longStay", label: "Will you be in that country more than 2 weeks on this trip, or more than 60 days this year?", type: "yesno", required: true },
    ],
    resolve(answers, user) {
      const gates = []
      const attach = []
      if (answers.cabin === "business") { gates.push(GATES.businessClass); attach.push("A written justification for business class — comfort and status are not accepted grounds") }
      if (answers.cabin === "comfort") { gates.push(GATES.comfortEconomy); attach.push("Flight duration showing the leg is over 8 hours") }
      if (answers.longStay === "yes") { gates.push(GATES.extendedTravel); attach.push("Days already spent in that country this year") }
      if (includesWeekendNight(answers.departure, answers.return)) gates.push({ ...GATES.weekendNight, detail: "Your dates include a Friday or Saturday night." })

      const out = bookingOutcome({
        what: "Flight", answers, user, extraGates: gates, extraAttach: attach,
        extraSteps: answers.longStay === "yes"
          ? [{ n: "!", title: "Talk to HR first", body: `Extended or frequent travel goes to ${CONTACTS.hr.email} BEFORE any booking request. This is a tax and employment question — it is not waived by the travel route.`, tone: "stop" }]
          : [],
      })
      const lvl = LEVELS[user.level] || LEVELS.Employee
      out.levelNote = `As ${user.level}: ${lvl.chooseDayTime ? "you may choose day and time" : lvl.chooseDay ? "you may choose the day, not the time" : "day and time are set by the lowest logical fare"}${lvl.flagCarrier ? ", flag carrier permitted" : ", no flag-carrier preference"}. Lowest logical fare applies to everyone — frequent-flyer status is never a reason to reject it.`
      return out
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "hotel",
    icon: "Bed",
    label: "Book accommodation",
    blurb: "Hotel, corporate apartment or a serviced flat for a longer stay.",
    questions: [
      { id: "departure", label: "First night?", type: "date", required: true },
      { id: "return", label: "Last night?", type: "date", required: true },
      { id: "destination", label: "Which city?", type: "text", required: true },
      { id: "purpose", label: "Business reason", type: "text", required: true },
      { id: "corporateAvailable", label: "Is this Bremen or Schaffhausen?", type: "yesno", required: true,
        hint: "Corporate apartments in those two cities are the preferred option under policy." },
    ],
    resolve(answers, user) {
      const nights = tripNights(answers.departure, answers.return)
      const gates = []
      if (nights !== null && nights > 14) gates.push({ ...GATES.extendedTravel, detail: `${nights} nights is over the 2-week threshold.` })
      if (includesWeekendNight(answers.departure, answers.return)) gates.push({ ...GATES.weekendNight, detail: "Your dates include a Friday or Saturday night." })

      const out = bookingOutcome({
        what: "Accommodation", answers, user, extraGates: gates,
        extraSteps: answers.corporateAvailable === "yes"
          ? [{ n: "→", title: "Ask for the corporate apartment first", body: "Bremen and Schaffhausen corporate apartments are the preferred option under policy. Request that before a hotel, or explain why it does not work." }]
          : [],
      })
      out.hardRule = "Accommodation booked outside the designated route is not reimbursed. This is the one accommodation rule with no discretion in it."
      return out
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "transfer",
    icon: "Car",
    label: "Airport transfer or a car on arrival",
    blurb: "Fixed-price transfers on the partner network.",
    questions: [
      { id: "destination", label: "Which city?", type: "text", required: true },
      { id: "guests", label: "Is this for you, or for a guest / VIP?", type: "choice", required: true,
        options: [
          { v: "self", label: "For me" },
          { v: "guest", label: "For an external guest or board member" },
          { v: "group", label: "For a group arriving together" },
        ] },
      { id: "family", label: "Travelling with children?", type: "yesno" },
    ],
    resolve(answers) {
      return say({
        status: "go",
        headline: "Book it yourself on the partner link — you pay nothing",
        lede: "Transfers are the one thing you do not have to ask anybody for. The partner network is pre-negotiated at fixed point-to-point rates, billed monthly to the entity. You never pay and you never file a claim for it.",
        steps: [
          { n: 1, title: "Open the city pack for your destination", body: "The fixed rate card, the partner link and the corporate code are in it. If a route has a published fixed price, no one has to adjudicate the cost." },
          { n: 2, title: "Book on the partner link under the company account", body: "Meet-and-greet inside arrivals with a name board is included, not charged as an extra. 60 minutes free waiting on international arrivals, 30 on domestic." },
          ...(answers.family === "yes" ? [{ n: 3, title: "Request child seats", body: "Free and guaranteed on request under the partner terms. Ask when booking, not at the kerb." }] : []),
          ...(answers.guests === "guest" ? [{ n: 3, title: "Send the guest a guest link instead", body: "External guests should not be asked to log in to anything. Generate a guest link with the driver name, plate, hotel and one contact number." }] : []),
          ...(answers.guests === "group" ? [{ n: 3, title: "Use group mode", body: "One trip, many travellers — the arrival manifest and driver schedule come out of it, and export straight to a WhatsApp brief." }] : []),
        ],
        attach: [],
        concierge: {
          does: "Provides the partner link, the corporate code and the fixed rate.",
          doesNot: "Make the booking.",
          routeTo: "Transfer partner",
        },
        policyRefs: ["Strategy note section 4"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "rentalcar",
    icon: "Car",
    label: "Rent a car",
    blurb: "Exception only — needs C-level approval in advance.",
    questions: [
      { id: "destination", label: "Where?", type: "text", required: true },
      { id: "departure", label: "From when?", type: "date", required: true },
      { id: "travellers", label: "How many people are travelling together?", type: "choice", required: true,
        options: [{ v: "1", label: "Just me" }, { v: "2", label: "Two of us" }, { v: "3+", label: "Three or more" }] },
      { id: "why", label: "Why does public transport or a transfer not work?", type: "text", required: true,
        placeholder: "Time, cost or safety grounds" },
    ],
    resolve(answers, user) {
      const entity = ENTITIES[user.entity] || ENTITIES["Constructor Knowledge"]
      return say({
        status: "gate",
        headline: "A rental car is an exception, and it has to be approved before you book",
        lede: "The policy treats rental cars as exceptional. C-level management approves them in advance — not afterwards, and not by the concierge team. Mid-size is the ceiling; a larger class only with three or more travellers.",
        gates: [GATES.rentalCar],
        steps: [
          { n: 1, title: "Line manager first", body: "As with every trip, the manager's email approval comes first." },
          { n: 2, title: "Request C-level approval in advance", body: `${entity.approverLabel}. Set out why public transport and the transfer partner do not work.` },
          { n: 3, title: "Only then book", body: "Mid-size class. All insurance options are covered — take them." },
          { n: 4, title: "Refuel before returning it", body: "And note that fines are never reimbursed, under any circumstances." },
        ],
        approvals: [
          { who: "Line manager", why: "Consulted", email: user.managerEmail || "your line manager" },
          { who: "C-level management", why: "Approves in advance — this is the decision that matters", email: entity.approverLabel },
        ],
        attach: ["Manager approval", "Justification against public transport", "Number of travellers if requesting above mid-size"],
        warnings: ["Fines are never reimbursed.", "Book before approval and you carry the cost yourself."],
        concierge: { does: "Explains the rule and the route.", doesNot: "Approve it, or judge whether your reason is good enough.", routeTo: "C-level management" },
        policyRefs: ["Matrix sections 1 and 4"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "businessclass",
    icon: "Sparkles",
    label: "Fly business or comfort economy",
    blurb: "The cabin question, answered honestly.",
    questions: [
      { id: "which", label: "Which are you asking about?", type: "choice", required: true,
        options: [
          { v: "business", label: "Business class" },
          { v: "comfort", label: "Comfort economy seat" },
        ] },
      { id: "hours", label: "How long is the longest single leg?", type: "choice", required: true,
        options: [{ v: "<8", label: "Under 8 hours" }, { v: "8+", label: "Over 8 hours" }] },
    ],
    resolve(answers, user) {
      if (answers.which === "comfort") {
        const ok = answers.hours === "8+"
        return say({
          status: ok ? "gate" : "stop",
          headline: ok
            ? "Comfort economy is possible on this leg — C-level management decides"
            : "Comfort economy is not available on a leg under 8 hours",
          lede: ok
            ? "The policy allows a comfort economy seat on intercontinental flights over 8 hours, with C-level management approval. Everything else stays standard economy."
            : "The rule is specific: intercontinental flights over 8 hours only. Under that, the answer is standard economy, and there is no one to appeal it to.",
          gates: ok ? [GATES.comfortEconomy] : [],
          steps: ok
            ? [
                { n: 1, title: "Manager approval first", body: "As with any trip." },
                { n: 2, title: "Ask C-level management", body: "Include the routing and the leg duration showing it exceeds 8 hours." },
              ]
            : [{ n: 1, title: "Book standard economy", body: "If you want the seat anyway, you may buy the upgrade yourself — but an upgrade paid personally stays personal and is not reimbursed." }],
          warnings: ok ? [] : ["Class or room upgrades are never reimbursed, however they are paid."],
          concierge: { does: "Explains the rule and the route.", doesNot: "Judge the merits.", routeTo: "C-level management" },
          policyRefs: ["Matrix section 1"],
        })
      }
      return say({
        status: "stop",
        headline: "Business class is a Constructor Group C-level decision, and it is exceptional",
        lede: "Everyone flies economy, including intercontinental. Business class is never approved at entity level and never granted on comfort or status grounds. If you have a genuine case — a medical need, a specific operational reason — it goes to Constructor Group C-level with a written justification. The concierge team cannot weigh it and neither can your entity.",
        gates: [GATES.businessClass],
        steps: [
          { n: 1, title: "Write the justification", body: "Specific to this trip. “Long flight” and “I need to work” are not accepted grounds — they apply to everyone." },
          { n: 2, title: "Line manager sees it first", body: "Consulted, not deciding." },
          { n: 3, title: "Constructor Group C-level decides", body: `${CONTACTS.tne.email} can route it, but the decision sits with Constructor Group C-level only.` },
        ],
        approvals: [{ who: "C-level, Constructor Group", why: "The only approver for business class, at any entity", email: "oz@constructor.org" }],
        warnings: ["Not granted on comfort or status grounds.", "An upgrade you pay for yourself stays personal and is not reimbursed."],
        concierge: { does: "Explains the rule and the route.", doesNot: "Judge the merits.", routeTo: "C-level of Constructor Group" },
        policyRefs: ["Matrix sections 1, 2 and 3"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "extended",
    icon: "CalendarDays",
    label: "A long, frequent or unusual trip",
    blurb: "Over 2 weeks, over 60 days a year in one country, or repeat travel.",
    questions: [
      { id: "destination", label: "Which country?", type: "text", required: true },
      { id: "pattern", label: "Which describes it?", type: "choice", required: true,
        options: [
          { v: "long", label: "One trip longer than 2 weeks" },
          { v: "cumulative", label: "Over 60 days in that country this year" },
          { v: "frequent", label: "Frequent repeat travel to the same place" },
          { v: "scope", label: "The purpose sits outside the usual scope of business" },
        ] },
    ],
    resolve(answers) {
      const scope = answers.pattern === "scope"
      return say({
        status: "gate",
        headline: "This goes to HR before anything is booked",
        lede: scope
          ? "A purpose outside the usual scope of business is an HR question first. Describe the activity to HR and let them tell you how it should be treated — the travel route only opens after that."
          : "Long, cumulative or repeat travel to one country creates tax and employment-law exposure — permanent establishment, social security, sometimes a work permit. That is why HR is contacted before booking rather than after. It is not a formality and the travel route cannot waive it.",
        gates: [scope ? GATES.outsideScope : GATES.extendedTravel],
        steps: [
          { n: 1, title: `Email ${CONTACTS.hr.email} now`, body: "Dates, country, and how many days you will have spent there this calendar year. Do this before you ask anyone to book anything." },
          { n: 2, title: "Wait for HR's position", body: "They may set conditions on the trip, or restructure it. That answer shapes the booking request." },
          { n: 3, title: "Then run the normal route", body: "Manager, booking partner copying Eugenia, C-level. HR's answer travels with it." },
        ],
        approvals: [{ who: "HR", why: "Approves extended, frequent and out-of-scope travel, before booking", email: CONTACTS.hr.email }],
        attach: ["Dates and country", "Days already spent there this year", "Purpose of the trip"],
        concierge: { does: "Flags it as extended travel before booking.", doesNot: "Approve it or waive it.", routeTo: "HR" },
        policyRefs: ["Matrix sections 1 and 2 (HR is consulted only for long-term travel)"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "visa",
    icon: "ShieldCheck",
    label: "Visa, entry rules or passport",
    blurb: "What you need to enter, and who actually does the work.",
    questions: [
      { id: "nationality", label: "Passport nationality", type: "text", required: true },
      { id: "destination", label: "Destination country", type: "text", required: true },
      { id: "departure", label: "When do you travel?", type: "date", required: true },
      { id: "family", label: "Are family members travelling with you?", type: "yesno" },
    ],
    resolve(answers) {
      const notice = daysUntil(answers.departure)
      const tight = notice !== null && notice < 21
      return say({
        status: "route",
        headline: "Mobility owns visas — the concierge team gives you the matrix and the handler",
        lede: `The requirement is a function of your passport and your destination. The concierge team maintains the matrix and keeps one vetted handler per corridor; ${CONTACTS.mobility.email} owns the immigration question itself. Nobody in this chain completes the application for you.`,
        warnings: [
          ...(tight ? [`You have ${notice} days. Most corridors need three weeks or more — start today and tell Mobility the date is tight.`] : []),
          "Check your passport expiry: many countries refuse entry inside six months of expiry.",
          ...(answers.family === "yes" ? ["Family passports need the same check — including children's, which expire faster."] : []),
        ],
        steps: [
          { n: 1, title: "Check the visa matrix in the app", body: "Passport plus destination gives the requirement and the vetted handler for that corridor." },
          { n: 2, title: `Email ${CONTACTS.mobility.email}`, body: "With nationality, destination, travel dates and passport expiry. Ask for an invitation letter here if you need one." },
          { n: 3, title: "The handler does the application", body: "Concierge provides the contact; Mobility owns the case; the handler files it." },
        ],
        approvals: [{ who: "Mobility", why: "Owns visas and immigration", email: CONTACTS.mobility.email }],
        attach: ["Passport scan (photo page)", "Travel dates", "Invitation letter, if the corridor needs one"],
        concierge: { does: "Provides the matrix and the vetted handler.", doesNot: "Complete applications.", routeTo: "Mobility" },
        goodNews: "Vaccinations and visa fees required for the trip are reimbursed. Passport or ID renewal is not — that is a personal document.",
        policyRefs: ["Matrix sections 4 and 7"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "expense",
    icon: "Receipt",
    label: "Claim an expense, or ask if something is claimable",
    blurb: "Including lost receipts and the 30-day clock.",
    questions: [
      { id: "spentOn", label: "When did you incur the expense?", type: "date", required: true },
      { id: "what", label: "What is it?", type: "choice", required: true,
        options: REIMBURSEMENT.map((r) => ({ v: r.cat, label: r.cat })) },
      { id: "receipt", label: "Do you have the invoice or receipt?", type: "choice", required: true,
        options: [
          { v: "yes", label: "Yes" },
          { v: "scan", label: "Only a scan or photo" },
          { v: "no", label: "No — lost it" },
        ] },
      { id: "country", label: "Which country was the expense incurred in?", type: "text", placeholder: "Germany, Switzerland, Serbia…" },
    ],
    resolve(answers) {
      const row = REIMBURSEMENT.find((r) => r.cat === answers.what)
      const age = answers.spentOn ? -daysUntil(answers.spentOn) : null
      const overHard = age !== null && age > DEADLINES.expenseHardLimitDays
      const overSoft = age !== null && age > DEADLINES.expenseDays
      const scanOk = answers.country && SCAN_COUNTRIES.some((c) => c.toLowerCase() === answers.country.trim().toLowerCase())

      const notPayable = row?.pos === "no"
      const warnings = []
      if (overHard) warnings.push(`This expense is ${age} days old. Past 90 days it is not reimbursed at all — that limit is absolute.`)
      else if (overSoft) warnings.push(`This expense is ${age} days old, past the 30-day window. Payment will be delayed; submit it now, before the 90-day cliff at day ${DEADLINES.expenseHardLimitDays}.`)
      if (answers.receipt === "no") warnings.push("No valid invoice, no reimbursement. That is the rule Finance applies — the concierge team cannot intervene in the claim, and neither can your manager.")
      if (answers.receipt === "scan" && answers.country && !scanOk) warnings.push(`Scans are accepted in ${SCAN_COUNTRIES.join(", ")} only. For ${answers.country} keep the hard copy — local law decides this, not the company.`)

      return say({
        status: notPayable || overHard ? "stop" : overSoft || answers.receipt === "no" ? "gate" : "go",
        headline: notPayable
          ? `${row.cat} is not reimbursed`
          : overHard
            ? "This is past the 90-day limit"
            : `${row?.cat || "This"} — ${row?.pos === "maybe" ? "conditional" : "claimable"}, if the evidence is right`,
        lede: row ? `${row.rule} Evidence required: ${row.evidence}.` : "",
        warnings,
        steps: notPayable || overHard ? [] : [
          { n: 1, title: "Attach the invoice", body: `${row?.evidence}. A valid invoice is the precondition — everything else is detail.` },
          { n: 2, title: "Write the business reason per line", body: "Itemised, with a clear reason against each item. Incomplete reports are returned." },
          { n: 3, title: "One report per trip or per month", body: `Submit within ${DEADLINES.expenseDays} days of incurring the expense.` },
          { n: 4, title: `Line manager reviews, then Finance pays`, body: `The manager checks completeness and policy compliance before it reaches ${CONTACTS.finance.email}.` },
        ],
        approvals: notPayable ? [] : [
          { who: "Line manager", why: "Reviews completeness and compliance", email: "your line manager" },
          { who: "Finance", why: "Approves and reimburses", email: CONTACTS.finance.email },
        ],
        concierge: {
          does: "Points you to the relevant row of the expense matrix and restates the deadline rules.",
          doesNot: "Rule on borderline items, or intervene in your claim.",
          routeTo: "Finance",
        },
        policyRefs: ["Matrix sections 4 and 5"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "citypack",
    icon: "MapPin",
    label: "“I'm going to X — what do we have?”",
    blurb: "City pack, partner rates, fixed transfer prices.",
    questions: [
      { id: "destination", label: "Which city?", type: "text", required: true },
      { id: "family", label: "Are you bringing family?", type: "yesno" },
    ],
    resolve(answers) {
      return say({
        status: "go",
        headline: "Nothing to request — open the pack",
        lede: "This is the one request that needs no routing at all. The city pack, partner rates and fixed transfer prices are in the app. If a city has no pack yet, the concierge team will tell you what exists and when the pack is due.",
        steps: [
          { n: 1, title: "Open City packs", body: `Everything for ${answers.destination || "your destination"} — transfers, hotels, health, essentials — is in one place.` },
          { n: 2, title: "Pick your hotel to unlock what's nearby", body: "Restaurants, pharmacy, gym, padel, coworking, laundry — with walking times from your actual door, not the city centre." },
          ...(answers.family === "yes" ? [{ n: 3, title: "Switch on Family mode", body: "Schools, kindergartens with admissions contacts and typical waiting times, paediatricians, and child seats requested by default on transfers." }] : []),
        ],
        concierge: { does: "Sends the city pack and partner rates.", doesNot: "—", routeTo: "No routing needed" },
        policyRefs: ["Matrix section 7"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "vipguest",
    icon: "Users",
    label: "An external guest, speaker or board member is coming",
    blurb: "The guest journey — arrival, transfer, hotel, protocol.",
    vipOnly: false,
    questions: [
      { id: "destination", label: "Which city?", type: "text", required: true },
      { id: "departure", label: "Arrival date", type: "date", required: true },
      { id: "guestCount", label: "How many guests?", type: "choice", required: true,
        options: [{ v: "1", label: "One" }, { v: "2-5", label: "Two to five" }, { v: "6+", label: "Six or more" }] },
      { id: "event", label: "Is this attached to an event?", type: "yesno" },
    ],
    resolve(answers) {
      const group = answers.guestCount !== "1"
      return say({
        status: "route",
        headline: "The concierge team owns the guest journey — and a DMC supplies the people on the day",
        lede: "This is the one area where the team is genuinely proactive. It owns the standard, the journey and the vendor; the events team owns the show; a local DMC or hostess agency staffs the day. Nothing about that makes the team the operator.",
        steps: [
          { n: 1, title: "Send the concierge team the guest details", body: "Names, arrival flights, hotel preference, dietary requirements, and anything you know about protocol — titles, name pronunciation, seating precedence." },
          { n: 2, title: "Generate a guest link", body: "A no-login page for the guest: driver name and plate, hotel, agenda, one contact number. External guests should never be asked to log in to anything, and this is the single highest-impact thing you can give a board member or a speaker." },
          ...(group ? [{ n: 3, title: "Use group mode", body: "Rooming list, arrival manifest, driver schedule — and an export straight into a WhatsApp brief." }] : []),
          ...(answers.event === "yes" ? [{ n: 4, title: "Loop in the events team", body: "They own the event itself. The concierge team briefs the vendors around it and staffs the guest hotline for the event window." }] : []),
        ],
        approvals: [],
        attach: ["Guest names and arrival flights", "Dietary requirements", "Anything known about titles and forms of address"],
        concierge: { does: "Owns the guest journey and briefs the vendors.", doesNot: "Staff the event directly.", routeTo: "Local DMC or agency" },
        gdpr: "A guest preference record — dietary needs, seating, driver, gift history — is personal data. It is kept only with the guest's knowledge, and only while there is a reason to.",
        policyRefs: ["Strategy note section 3"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "relocation",
    icon: "Home",
    label: "Relocation, family, schooling or medical",
    blurb: "Moving, not just travelling.",
    questions: [
      { id: "destination", label: "Which city?", type: "text", required: true },
      { id: "topic", label: "What do you need?", type: "choice", required: true,
        options: [
          { v: "move", label: "Relocation — agents, immigration, tax, registration" },
          { v: "school", label: "Schools and kindergartens" },
          { v: "health", label: "Doctors, clinics, insurance" },
          { v: "contract", label: "Something about my employment terms" },
        ] },
    ],
    resolve(answers) {
      const hr = answers.topic === "contract"
      return say({
        status: hr ? "route" : "go",
        headline: hr
          ? "Anything touching your employment terms is HR's, not the concierge team's"
          : "The relocation pack covers this — and the concierge team can send it today",
        lede: hr
          ? `The concierge team can send you the city and relocation pack, but the moment the question involves your contract, allowance or entitlement, it belongs to ${CONTACTS.hr.email}. They will not advise on individual circumstances, and that boundary protects you as much as them.`
          : "The relocation pack is the highest-value version of the city document: vetted relocation agents, immigration lawyers, tax advisors, residency and registration steps, banking, mobile, driving licence conversion — plus the family layer of schools, kindergartens with admissions contacts and typical waiting times, paediatricians and language schools.",
        steps: hr
          ? [
              { n: 1, title: `Email ${CONTACTS.hr.email}`, body: "Set out what you need decided. Relocation terms, allowances and entitlements are theirs." },
              { n: 2, title: "Ask the concierge team for the pack in parallel", body: "The practical content does not have to wait for the contractual answer." },
            ]
          : [
              { n: 1, title: "Open the relocation pack for the city", body: "One record per vendor, reviewed on a cadence, with a named owner — not a PDF someone wrote once." },
              { n: 2, title: "Contact the vendors directly", body: "The team supplies the contact and the rate. It does not make the appointment for you." },
              ...(answers.topic === "school" ? [{ n: 3, title: "Start early on schools", body: "Waiting lists are the constraint, not admission. Typical waiting times are in the pack for exactly this reason." }] : []),
            ],
        warnings: ["A recommendation is not an endorsement of outcome. Vendors are vetted against a stated standard and reviewed, but the choice and the relationship are yours."],
        concierge: { does: "Sends the relevant city or relocation pack.", doesNot: "Advise on individual circumstances.", routeTo: "HR where employment terms are involved" },
        policyRefs: ["Strategy note section 2", "Matrix section 7"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "offsite",
    icon: "Building2",
    label: "Run a team offsite or an event",
    blurb: "Venue, DMC and a runbook — so you can run it yourself.",
    questions: [
      { id: "destination", label: "Which city?", type: "text", required: true },
      { id: "size", label: "How many people?", type: "choice", required: true,
        options: [{ v: "<10", label: "Under 10" }, { v: "10-30", label: "10 to 30" }, { v: "30+", label: "Over 30" }] },
      { id: "departure", label: "When?", type: "date" },
    ],
    resolve() {
      return say({
        status: "go",
        headline: "Take the vetted venue list and the template runbook, and run it yourself",
        lede: "Offsite enablement is deliberately self-service: a vetted venue and DMC list per city plus a template runbook. Three people cannot run everybody's offsite, and they do not need to — the list and the runbook are the product.",
        steps: [
          { n: 1, title: "Open the venue and DMC list for the city", body: "Vetted, with rates and a named contact each." },
          { n: 2, title: "Take the runbook template", body: "Timings, catering, AV, rooming, transfers, and the things people forget until the morning of." },
          { n: 3, title: "Each traveller still books their own trip", body: "An offsite does not bypass the approval route. Everyone attending runs the normal manager → booking partner → C-level chain." },
          { n: 4, title: "Tell the concierge team the dates", body: "So the transfer partner is warned and the group appears in Who's in town — which is also how duplicate trips get caught." },
        ],
        concierge: { does: "Supplies the venue list, the DMC contact and the runbook.", doesNot: "Run the offsite.", routeTo: "Local DMC where staffing is needed" },
        policyRefs: ["Strategy note section 2"],
      })
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: "other",
    icon: "HelpCircle",
    label: "Something else, or something the policy does not cover",
    blurb: "Honest answer: here is who decides.",
    questions: [
      { id: "what", label: "What do you need?", type: "text", required: true, placeholder: "Describe it in a line or two" },
    ],
    resolve(answers, user) {
      const entity = ENTITIES[user.entity] || ENTITIES["Constructor Knowledge"]
      return say({
        status: "route",
        headline: "If the policy does not cover it, the concierge team says so and names who decides",
        lede: "That is the whole answer, and it is deliberate. Exceptions are escalated, never granted — by anyone in the concierge team, at any seniority of asker. What you get instead is the right owner, first time.",
        steps: [
          { n: 1, title: "Line manager", body: "Every exception starts here. Put the request and the reason in writing." },
          { n: 2, title: "Then C-level", body: `${entity.approverLabel}.` },
          { n: 3, title: "Ask the concierge team in parallel", body: `${CONTACTS.concierge.email} — they will tell you within the day whether something already exists that solves it.` },
        ],
        concierge: { does: "Says so, and says who decides.", doesNot: "Grant exceptions.", routeTo: "Line manager, then C-level" },
        policyRefs: ["Matrix section 7"],
      })
    },
  },
]

export const requestType = (id) => REQUEST_TYPES.find((r) => r.id === id)

/* ------------------------------------------------------------------ */
/*  Email composer — turns an outcome into a ready-to-send draft.      */
/*  This is the payoff of the whole engine: the employee never has to   */
/*  work out who to write to or what to attach.                         */
/* ------------------------------------------------------------------ */

export function composeEmail(type, answers, outcome, user) {
  const to = outcome.sendTo?.to || (outcome.approvals[0]?.email ? [outcome.approvals[0].email] : [])
  const cc = outcome.sendTo?.cc || []
  const dest = answers.destination || answers.what || ""
  const subject = `Travel request — ${type.label}${dest ? ` — ${dest}` : ""}${answers.departure ? ` — ${fmtDate(answers.departure)}` : ""}`

  const lines = [
    `Dear all,`,
    ``,
    `I would like to request the following, in line with the Global Travel & Expense Policy.`,
    ``,
    `Traveller:      ${user.name} (${user.level}, ${user.entity})`,
    dest ? `Destination:    ${dest}` : null,
    answers.departure ? `Departure:      ${fmtDate(answers.departure)}` : null,
    answers.return ? `Return:         ${fmtDate(answers.return)}` : null,
    answers.purpose ? `Business reason: ${answers.purpose}` : null,
    answers.cabin ? `Cabin:          ${answers.cabin}` : null,
    ``,
    outcome.gates?.length
      ? `The following need a decision before booking:\n${outcome.gates.map((g) => `  · ${g.label} — decided by ${g.decidedBy}`).join("\n")}`
      : null,
    outcome.gates?.length ? `` : null,
    outcome.attach?.length ? `Attached:\n${outcome.attach.map((a) => `  · ${a}`).join("\n")}` : null,
    ``,
    `Many thanks,`,
    user.name,
  ].filter((l) => l !== null)

  return { to, cc, subject, body: lines.join("\n") }
}

export const mailtoLink = (mail) =>
  `mailto:${mail.to.join(",")}?cc=${encodeURIComponent(mail.cc.join(","))}` +
  `&subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`
