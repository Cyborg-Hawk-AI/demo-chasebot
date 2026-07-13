import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Docs — ChaseBot",
  description: "Feature documentation for the ChaseBot interactive demo and production implementation notes.",
};

const features = [
  {
    name: "Dashboard Overview",
    location: "/demo → Dashboard tab",
    tryIt: "View stat cards, recovery chart, activity feed, and overdue invoice table. Click any activity item or invoice row to open detail modal.",
    mocked: "All stats, chart data, and activity feed are hardcoded in lib/mock-data.ts. Refresh button shows a toast only.",
    production:
      "Stats aggregated from Supabase queries. Activity feed from events table populated by sequence engine, sync jobs, and payment webhooks. Chart from monthly recovery aggregates.",
  },
  {
    name: "Invoice Import & Table",
    location: "/demo → Invoices tab",
    tryIt: "Filter by status (all/active/overdue/paid/paused). Search by client, company, or invoice number. Click rows for detail modal. Use Mark paid / Pause / Resume buttons.",
    mocked: "10 realistic invoices in INITIAL_INVOICES. State updates client-side on mark paid, pause, resume.",
    production:
      "Invoices synced nightly from QuickBooks/FreshBooks/Wave OAuth APIs or CSV upload. Stored in Supabase with status, sequence_step, last_contact fields. Paginated table with server-side filters.",
  },
  {
    name: "Connect Invoicing Tool",
    location: "/demo → Integrations tab, or '+ Connect tool' button",
    tryIt: "Click Connect on any provider. OAuth wizard walks through provider selection and authorization. CSV path shows drag-and-drop UI.",
    mocked: "Wizard simulates 2-second OAuth delay. Connect/disconnect/sync update local state and show toasts.",
    production:
      "QuickBooks: OAuth 2.0 via Intuit Developer. FreshBooks: OAuth 2.0. Wave: API key. CSV: multipart upload parsed server-side. Tokens encrypted in Supabase. Nightly cron at 8:00 UTC pulls unpaid invoices.",
  },
  {
    name: "Multi-Step Follow-Up Sequences",
    location: "/demo → Sequences tab",
    tryIt: "Select a template (Standard, Gentle, Firm B2B). Toggle steps on/off. Adjust day offsets. Click Save sequence.",
    mocked: "Three templates with different step configs. Changes persist in React state for the session only.",
    production:
      "Sequence templates stored per account in DB. Default: email day 3, email+SMS day 7, firm email day 14, escalation day 30. Hourly cron evaluates each active invoice's due_date and last_contact_date, fires next enabled step.",
  },
  {
    name: "Tone Selector",
    location: "/demo → Sequences tab → Tone selector",
    tryIt: "Click friendly, firm, or formal. Preview updates instantly below.",
    mocked: "TONE_PREVIEWS object with sample subject/body per tone. Toast confirms selection.",
    production:
      "Three template sets per tone stored in DB. Sequence engine selects template based on invoice.tone field. Friendly uses casual language; formal includes legal escalation language. Could use LLM for personalization.",
  },
  {
    name: "One-Click Mark Paid",
    location: "/demo → Invoices tab, Dashboard overdue table, Invoice detail modal",
    tryIt: "Click 'Mark paid' on any unpaid invoice. Status changes to paid, sequence stops, toast confirms, activity feed updates.",
    mocked: "Client-side state update. No persistence across page refresh.",
    production:
      "Manual mark-paid updates invoice status in DB and cancels active sequence. Automatic: QuickBooks/FreshBooks payment webhook sets status=paid and halts sequence immediately. Prevents embarrassing post-payment reminders.",
  },
  {
    name: "Sequence Pause / Resume",
    location: "/demo → Invoices tab or Invoice detail modal",
    tryIt: "Pause an active sequence (status → paused). Resume restores active/overdue status.",
    mocked: "Local state toggle with toast feedback.",
    production:
      "Sets sequence_status=paused in DB. Engine skips paused invoices during hourly evaluation. Resume re-enables with preserved step position.",
  },
  {
    name: "Integration Sync Controls",
    location: "/demo → Integrations tab",
    tryIt: "Sync now, disconnect, change sync schedule dropdown. Connect new providers via wizard.",
    mocked: "Sync simulates 1.5s delay then updates lastSync timestamp. Disconnect flips connected flag.",
    production:
      "Manual sync triggers immediate API pull. Scheduled sync via Vercel cron or Supabase pg_cron. Disconnect revokes OAuth token and stops syncing.",
  },
  {
    name: "Monthly Recovery Report",
    location: "/demo → Recovery Report tab",
    tryIt: "Switch months via month buttons. View collected/attributed/recovered stats, chart, invoice table, ROI summary. Download PDF and Email report buttons.",
    mocked: "RECOVERY_DATA for 6 months. Recovered invoice table slices based on selected month. PDF/email are toast-only.",
    production:
      "Cron on 1st of month aggregates payments where last_sequence_contact < payment_date. Generates PDF via Puppeteer. Emails via SendGrid. Attributes recovery to specific sequence steps for ROI calculation.",
  },
  {
    name: "DEV NOTE Tooltips",
    location: "/demo → info (i) icons beside major controls",
    tryIt: "Click any 'i' badge to see production implementation notes for that feature.",
    mocked: "Static tooltip content in DevNote component.",
    production:
      "Demo-only feature. Not shipped to production users.",
  },
];

const architecture = [
  { layer: "Frontend", tech: "Next.js 14 App Router, React, Tailwind CSS", deploy: "Vercel (zero config)" },
  { layer: "Database", tech: "Supabase (Postgres)", deploy: "Supabase hosted" },
  { layer: "Auth / OAuth", tech: "QuickBooks, FreshBooks, Wave OAuth 2.0", deploy: "Provider consent screens" },
  { layer: "Email", tech: "SendGrid transactional API", deploy: "Sequence step delivery" },
  { layer: "SMS", tech: "Twilio Programmable SMS", deploy: "Day 7+ follow-ups" },
  { layer: "Payments", tech: "Stripe subscriptions ($29/mo)", deploy: "Billing + retry on failure" },
  { layer: "Cron jobs", tech: "Vercel Cron / Supabase Edge Functions", deploy: "Nightly sync, hourly engine, monthly report" },
  { layer: "Webhooks", tech: "QuickBooks payment events", deploy: "Auto mark-paid + sequence cancel" },
  { layer: "Support", tech: "AI agent on sequence logic docs", deploy: "~80% ticket deflection" },
];

export default function DevelopersPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="badge bg-brand-900/60 text-brand-300 ring-1 ring-brand-700/50">
            Developer Documentation
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white">
            ChaseBot Demo — Feature Reference
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Every feature in the interactive demo, where to find it, what&apos;s mocked, and how it
            would work in production.
          </p>
          <Link href="/demo" className="btn-primary mt-6 inline-flex">
            Open live demo →
          </Link>
        </div>

        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-white">Architecture overview</h2>
          <p className="mt-2 text-gray-400">
            Estimated MVP: 3 weeks solo dev. Owner maintenance: ~45 minutes/week.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-surface-600">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-700/50">
                <tr className="text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Layer</th>
                  <th className="px-4 py-3">Technology</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {architecture.map((row) => (
                  <tr key={row.layer} className="border-t border-surface-700/50">
                    <td className="px-4 py-3 font-medium text-gray-200">{row.layer}</td>
                    <td className="px-4 py-3 text-brand-300">{row.tech}</td>
                    <td className="px-4 py-3 text-gray-400">{row.deploy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-white">Data flow</h2>
          <div className="card mt-6 p-6 font-mono text-sm text-gray-300">
            <pre className="overflow-x-auto whitespace-pre leading-relaxed">{`┌─────────────┐     nightly cron      ┌──────────────┐
│ QuickBooks  │ ──────────────────────▶│   Supabase   │
│ FreshBooks  │     OAuth + API pull     │  (invoices)  │
│ Wave / CSV  │                          └──────┬───────┘
└─────────────┘                                 │
                                                │ hourly cron
                                                ▼
                                         ┌──────────────┐
                                         │  Sequence    │
                                         │   Engine     │
                                         └──────┬───────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          ▼                     ▼                     ▼
                   ┌────────────┐        ┌────────────┐        ┌────────────┐
                   │  SendGrid  │        │   Twilio   │        │  Webhook   │
                   │  (email)   │        │   (SMS)    │        │ (mark paid)│
                   └────────────┘        └────────────┘        └────────────┘`}</pre>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white">Feature catalog</h2>
          <div className="mt-6 space-y-6">
            {features.map((feature, i) => (
              <div key={feature.name} className="card p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600/20 text-sm font-bold text-brand-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white">{feature.name}</h3>
                    <p className="mt-1 text-sm text-brand-400">{feature.location}</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-1">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          How to try it
                        </p>
                        <p className="mt-1 text-sm text-gray-300">{feature.tryIt}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-500/80">
                          Mocked in demo
                        </p>
                        <p className="mt-1 text-sm text-gray-400">{feature.mocked}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80">
                          Production implementation
                        </p>
                        <p className="mt-1 text-sm text-gray-400">{feature.production}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 card p-6">
          <h2 className="font-semibold text-white">Demo constraints</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>• No authentication, database, or environment variables</li>
            <li>• All state is client-side React — refreshes reset changes</li>
            <li>• Zero-config Vercel deployment (standard Next.js App Router)</li>
            <li>• Mock data in <code className="text-brand-400">lib/mock-data.ts</code></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
