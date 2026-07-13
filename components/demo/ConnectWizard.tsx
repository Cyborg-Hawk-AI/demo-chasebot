"use client";

import { useState } from "react";
import DevNote from "@/components/DevNote";
import type { IntegrationProvider } from "@/lib/types";

interface ConnectWizardProps {
  provider: IntegrationProvider | null;
  onClose: () => void;
  onComplete: (provider: IntegrationProvider) => void;
  onSelectProvider: (provider: IntegrationProvider) => void;
}

const PROVIDERS: { id: IntegrationProvider; name: string; icon: string; desc: string }[] = [
  { id: "quickbooks", name: "QuickBooks Online", icon: "📗", desc: "Most popular for US SMBs" },
  { id: "freshbooks", name: "FreshBooks", icon: "📘", desc: "Freelancer-friendly invoicing" },
  { id: "wave", name: "Wave", icon: "🌊", desc: "Free accounting for small business" },
  { id: "csv", name: "CSV Upload", icon: "📋", desc: "Import from any tool" },
];

export default function ConnectWizard({
  provider,
  onClose,
  onComplete,
  onSelectProvider,
}: ConnectWizardProps) {
  const [step, setStep] = useState(provider ? 2 : 1);
  const [syncing, setSyncing] = useState(false);

  const selected = PROVIDERS.find((p) => p.id === provider);

  const handleOAuth = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      if (provider) onComplete(provider);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-lg animate-slide-up p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            {step === 1 ? "Connect invoicing tool" : `Connect ${selected?.name}`}
          </h2>
          <div className="flex items-center gap-2">
            <DevNote title="OAuth wizard">
              Production: redirects to provider OAuth consent screen. Stores refresh token encrypted in
              Supabase. Initial sync runs immediately after connect.
            </DevNote>
            <button type="button" onClick={onClose} className="btn-ghost text-gray-400">
              ✕
            </button>
          </div>
        </div>

        {step === 1 && (
          <div className="mt-6 space-y-3">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectProvider(p.id);
                  setStep(2);
                }}
                className="flex w-full items-center gap-4 rounded-lg border border-surface-500 bg-surface-700/50 p-4 text-left transition hover:border-brand-500/50 hover:bg-surface-700"
              >
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                </div>
                <span className="ml-auto text-gray-500">→</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && selected && (
          <div className="mt-6">
            {selected.id === "csv" ? (
              <div className="space-y-4">
                <div className="rounded-lg border-2 border-dashed border-surface-500 p-8 text-center">
                  <p className="text-3xl">📁</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Drag &amp; drop your CSV file here, or click to browse
                  </p>
                  <button
                    type="button"
                    onClick={handleOAuth}
                    className="btn-secondary mt-4 text-sm"
                  >
                    Choose file
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Required columns: invoice_number, client_name, client_email, amount, due_date
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-surface-700/50 p-4">
                  <p className="text-sm text-gray-300">
                    You&apos;ll be redirected to {selected.name} to authorize ChaseBot to read your
                    unpaid invoices. We never access bank details or process payments.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> Read unpaid invoice list
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> Receive payment status webhooks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-600">✗</span> No write access to your books
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={handleOAuth}
                  disabled={syncing}
                  className="btn-primary w-full py-3"
                >
                  {syncing ? "Connecting & syncing..." : `Authorize ${selected.name}`}
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-300"
            >
              ← Back to provider list
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
