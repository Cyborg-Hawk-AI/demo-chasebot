import Link from "next/link";

const features = [
  {
    icon: "🔗",
    title: "Plug into any invoicing tool",
    description:
      "Connect QuickBooks, FreshBooks, Wave, or upload a CSV. Unpaid invoices sync automatically — zero switching cost.",
  },
  {
    icon: "📬",
    title: "Multi-step follow-up sequences",
    description:
      "Email on day 3, email + SMS on day 7, firm notice on day 14, escalation on day 30. Fully configurable.",
  },
  {
    icon: "🎭",
    title: "Tone selector",
    description:
      "Friendly → firm → formal. Messages match the relationship so follow-ups never feel robotic or awkward.",
  },
  {
    icon: "✅",
    title: "One-click mark paid",
    description:
      "Payment detected or manually marked? Sequences stop instantly. No more embarrassing double-reminders.",
  },
  {
    icon: "📊",
    title: "Monthly recovery report",
    description:
      "See exactly how much cash ChaseBot collected for you — attributed to automated follow-ups, not guesswork.",
  },
  {
    icon: "⚡",
    title: "Set and forget",
    description:
      "Nightly invoice sync, hourly sequence engine, automatic payment detection. You focus on the work you love.",
  },
];

const steps = [
  { day: 3, action: "Friendly email", channel: "Email" },
  { day: 7, action: "Follow-up + SMS", channel: "Email + SMS" },
  { day: 14, action: "Firm notice", channel: "Email" },
  { day: 30, action: "Escalation notice", channel: "Email" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-surface-900 to-surface-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMzY5ZTEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-700/40 bg-brand-900/30 px-4 py-1.5 text-sm text-brand-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Recover revenue you&apos;re leaving on the table
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Stop chasing invoices.
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                Start collecting.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              ChaseBot runs set-and-forget follow-up sequences on your unpaid invoices — so you
              never have to send another awkward &ldquo;just checking in&rdquo; email again.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/demo" className="btn-primary px-8 py-3 text-base">
                Try the interactive demo
              </Link>
              <Link href="/research" className="btn-secondary px-8 py-3 text-base">
                How we found this idea
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Built for US freelancers &amp; small business owners · No credit card · Mock demo
            </p>
          </div>

          {/* Sequence preview */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="card p-6">
              <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Default follow-up sequence
              </p>
              <div className="flex items-center justify-between gap-2">
                {steps.map((step, i) => (
                  <div key={step.day} className="flex flex-1 flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-sm font-bold text-brand-400 ring-2 ring-brand-600/40">
                      D{step.day}
                    </div>
                    <p className="mt-2 text-center text-xs font-medium text-gray-300">{step.action}</p>
                    <p className="text-center text-[10px] text-gray-500">{step.channel}</p>
                    {i < steps.length - 1 && (
                      <div className="absolute hidden" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-surface-600/60 bg-surface-800/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-8 sm:px-6">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">$6,150</p>
            <p className="text-xs text-gray-500">avg recovered / month</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">73%</p>
            <p className="text-xs text-gray-500">collection rate</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">11 days</p>
            <p className="text-xs text-gray-500">avg time to payment</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">45 min</p>
            <p className="text-xs text-gray-500">owner time / week</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Everything you need to get paid
            </h2>
            <p className="mt-4 text-gray-400">
              Works with whatever invoicing tool you already use. No CRM bloat, no percentage fees.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card group p-6 transition hover:border-brand-600/40">
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-surface-600/60 bg-surface-800/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">
                The awkward conversation you never have to have
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Small business owners let thousands in unpaid invoices slip every year — not because
                clients won&apos;t pay, but because follow-up feels uncomfortable. ChaseBot handles
                the entire conversation on autopilot, with tones that match each relationship.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Nightly sync pulls unpaid invoices from QuickBooks, FreshBooks, or Wave",
                  "Hourly engine fires the right step based on due date and last contact",
                  "Payment webhooks instantly cancel active sequences",
                  "Monthly PDF recovery report shows your ROI in dollars",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-8">
              <blockquote className="text-lg italic text-gray-300">
                &ldquo;I hate chasing clients for money. I just let it go sometimes.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-gray-500">
                — Real comment from r/QuickBooks research ·{" "}
                <Link href="/research" className="text-brand-400 hover:underline">
                  Read the full research
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Simple, flat pricing
            </h2>
            <p className="mt-4 text-gray-400">
              No percentage of collected. No per-invoice fees. One price, unlimited chasing.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-lg">
            <div className="card relative overflow-hidden p-8 ring-2 ring-brand-600/50">
              <div className="absolute right-4 top-4">
                <span className="badge bg-brand-600 text-white">Most popular</span>
              </div>
              <h3 className="text-xl font-semibold text-white">ChaseBot Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold text-white">$29</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Unlimited invoices & sequences",
                  "QuickBooks, FreshBooks, Wave + CSV",
                  "Email + SMS follow-ups",
                  "Tone customization per client",
                  "Monthly recovery PDF report",
                  "Payment webhook auto-stop",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/demo" className="btn-primary mt-8 w-full py-3">
                Start with the demo
              </Link>
              <p className="mt-4 text-center text-xs text-gray-500">
                Stripe billing with automatic retry · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-surface-600/60 bg-gradient-to-b from-brand-950/40 to-surface-900 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white">
            See ChaseBot recover revenue in 2 minutes
          </h2>
          <p className="mt-4 text-gray-400">
            Explore the fully interactive demo with realistic invoices, sequences, and recovery
            reports. Every button works — no signup required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/demo" className="btn-primary px-8 py-3 text-base">
              Open live demo
            </Link>
            <Link href="/developers" className="btn-secondary px-8 py-3 text-base">
              Developer documentation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
