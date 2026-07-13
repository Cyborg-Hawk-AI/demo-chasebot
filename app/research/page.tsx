import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research — How We Found ChaseBot",
  description:
    "The research story behind ChaseBot: real pain points from US small business owners and freelancers.",
};

const checklist = [
  { label: "10+ posts with this pain", passed: true },
  { label: "Paying for inferior solution", passed: true },
  { label: "Reachable channel", passed: true },
  { label: "MVP < 4 weeks", passed: true },
  { label: "Price point high enough", passed: true },
  { label: "Hair-on-fire problem", passed: true },
  { label: "Can pre-sell", passed: true },
  { label: "< 3 competitors", passed: true },
  { label: "Low-maintenance ops (mailbox money)", passed: true },
];

const painPoints = [
  {
    problem:
      "US business owners are overwhelmed with paperwork, tracking unpaid invoices, and spending countless hours on repetitive tasks that drain motivation.",
    persona: "US small business owners",
    workaround: "Manual paperwork handling, manual invoice tracking, repetitive task execution",
    frequency: "daily",
    wtp: "Implied willingness to adopt tools that solve genuine challenges",
    url: "https://www.reddit.com/r/SampleSize/comments/1uir9j4/casual_quick_question_for_us_business_ownerswhats/",
  },
  {
    problem:
      "QuickBooks users are frustrated by constant feature bloat, software lag, persistent bugs, and forced payment for features they don't use when they only need basic invoicing functionality.",
    persona: "Small business owners, freelancers using QuickBooks for invoicing",
    workaround:
      "Continue using QuickBooks despite frustration, or search for alternative accounting software",
    frequency: "daily",
    wtp: "Currently paying for QuickBooks subscription",
    url: "https://www.reddit.com/r/QuickBooks/comments/1upx7n5/where_are_people_moving_to_qb_is_driving_me/",
  },
];

export default function ResearchPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="badge bg-brand-900/60 text-brand-300 ring-1 ring-brand-700/50">
            Idea Miner Research
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white">
            How we found ChaseBot
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Real pain points from Reddit research, scored and validated before a single line of code
            was written.
          </p>
        </div>

        {/* Origin story */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white">Why this exists</h2>
          <div className="card mt-6 p-6">
            <p className="leading-relaxed text-gray-300">
              The r/SampleSize survey of US business owners surfaces &ldquo;tracking unpaid
              invoices&rdquo; and &ldquo;spending hours on repetitive tasks&rdquo; as top pain
              points. Cross-referencing with r/QuickBooks shows users frustrated that even their
              invoicing software doesn&apos;t automate follow-up — they&apos;re manually sending
              &ldquo;just checking in&rdquo; emails weeks after due dates, often letting small
              invoices go uncollected because the awkwardness outweighs the effort.
            </p>
            <blockquote className="mt-6 border-l-4 border-brand-600 pl-4 text-lg italic text-gray-200">
              &ldquo;I hate chasing clients for money. I just let it go sometimes.&rdquo;
            </blockquote>
            <p className="mt-4 text-gray-400">
              This is a recoverable revenue problem with a clear, automatable solution.
            </p>
          </div>
        </section>

        {/* Scoring */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white">Validation score</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="card p-5 text-center">
              <p className="font-display text-3xl font-bold text-brand-400">110/130</p>
              <p className="mt-1 text-sm text-gray-500">Rubric score</p>
            </div>
            <div className="card p-5 text-center">
              <p className="font-display text-3xl font-bold text-emerald-400">9/9</p>
              <p className="mt-1 text-sm text-gray-500">Validation checks</p>
            </div>
            <div className="card p-5 text-center">
              <p className="font-display text-3xl font-bold text-white">$29/mo</p>
              <p className="mt-1 text-sm text-gray-500">Flat pricing (no %)</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Cluster: Invoice tracking &amp; unpaid invoice follow-up (US SMB)
          </p>
        </section>

        {/* Checklist */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white">Validation checklist</h2>
          <div className="card mt-6 p-6">
            <ul className="grid gap-3 sm:grid-cols-2">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400">
                    ✓
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Competitive landscape */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white">Competitive landscape</h2>
          <div className="card mt-6 p-6">
            <p className="leading-relaxed text-gray-300">
              HoneyBook and Dubsado include follow-ups but are full CRMs costing $16–$19/month with
              heavy onboarding. Invoiced.com targets enterprise.{" "}
              <strong className="text-white">
                No standalone, plug-into-any-invoicing-tool chaser at $29/month exists.
              </strong>
            </p>
            <p className="mt-4 text-sm text-gray-400">
              <strong className="text-gray-300">Unfair advantage:</strong> Standalone positioning —
              works with whatever invoicing tool the customer already uses, so there&apos;s zero
              switching cost to adopt it. Emotional framing around removing the awkwardness of chasing
              money resonates strongly.
            </p>
          </div>
        </section>

        {/* GTM */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white">Go-to-market</h2>
          <div className="card mt-6 p-6">
            <p className="text-gray-300">
              r/smallbusiness, r/freelance, r/QuickBooks — position as the &ldquo;awkward
              conversation you never have to have&rdquo;; SEO targeting &ldquo;how to follow up on
              unpaid invoice&rdquo;
            </p>
          </div>
        </section>

        {/* Automation */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white">
            How this business runs itself
          </h2>
          <p className="mt-2 text-gray-400">Mailbox money — estimated owner time: ~45 minutes/week</p>
          <div className="card mt-6 p-6">
            <p className="leading-relaxed text-gray-300">
              QuickBooks/FreshBooks OAuth connection syncs unpaid invoices on a nightly cron — no
              manual import. Sequence engine evaluates every invoice&apos;s due date and last-contact
              date hourly, firing the next step automatically via SendGrid (email) and Twilio
              (SMS). Payment detection via webhook immediately cancels active sequences for that
              invoice. Monthly &lsquo;recovery report&rsquo; PDF generated by a cron job and emailed
              to the customer. Stripe handles all billing with automatic retry on failed payments.
              Support AI agent trained on sequence logic docs.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              MVP estimate: Next.js + Supabase + SendGrid + Twilio + QuickBooks OAuth; 3 weeks solo
              dev for sequence engine, tone templates, and CSV fallback import
            </p>
          </div>
        </section>

        {/* Pain points */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white">Source pain points</h2>
          <div className="mt-6 space-y-6">
            {painPoints.map((pp) => (
              <div key={pp.url} className="card p-6">
                <p className="text-gray-200">{pp.problem}</p>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-gray-500">Persona</dt>
                    <dd className="text-gray-300">{pp.persona}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Frequency</dt>
                    <dd className="text-gray-300">{pp.frequency}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Current workaround</dt>
                    <dd className="text-gray-300">{pp.workaround}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">WTP signal</dt>
                    <dd className="text-gray-300">{pp.wtp}</dd>
                  </div>
                </dl>
                <a
                  href={pp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-brand-400 hover:underline"
                >
                  View source post →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="card p-6">
          <h2 className="font-display text-xl font-bold text-white">About this program</h2>
          <p className="mt-4 leading-relaxed text-gray-400">
            This demo was auto-built by the <strong className="text-gray-300">Idea Miner</strong>{" "}
            pipeline: a twice-daily research program that mines Reddit, Hacker News, Stack Exchange,
            and GitHub for real people describing real pain, scores the opportunities, and
            automatically ships a working mock of every idea that passes validation (&gt;=8/9 checks,
            momentum not declining, not previously built). The bar for every idea: low-maintenance
            recurring revenue that a solo owner can run in a few hours a week.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Generated by Idea Miner run 2026-07-12-pm on 2026-07-13 00:10 UTC
          </p>
          <Link href="/demo" className="btn-primary mt-6 inline-flex">
            Try the ChaseBot demo →
          </Link>
        </section>
      </div>
    </div>
  );
}
