import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-surface-600/60 bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold text-white">
                Chase<span className="text-brand-400">Bot</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Set-and-forget invoice chasing for US small businesses and freelancers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/demo" className="text-sm text-gray-500 transition hover:text-brand-400">
                  Live Demo
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-sm text-gray-500 transition hover:text-brand-400">
                  Developer Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Research</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/research" className="text-sm text-gray-500 transition hover:text-brand-400">
                  How we found this idea
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-600/60 pt-6 text-center text-xs text-gray-600">
          <p>ChaseBot demo — built by Idea Miner. Mock data only, no real invoices processed.</p>
        </div>
      </div>
    </footer>
  );
}
