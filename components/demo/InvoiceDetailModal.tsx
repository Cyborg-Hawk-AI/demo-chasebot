"use client";

import DevNote from "@/components/DevNote";
import type { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/mock-data";

interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
  onMarkPaid: () => void;
  onPause: () => void;
  onResume: () => void;
}

const SEQUENCE_LABELS = [
  "Friendly reminder (Day 3)",
  "Follow-up + SMS (Day 7)",
  "Firm notice (Day 14)",
  "Escalation notice (Day 30)",
];

export default function InvoiceDetailModal({
  invoice,
  onClose,
  onMarkPaid,
  onPause,
  onResume,
}: InvoiceDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-2xl animate-slide-up overflow-y-auto p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white">{invoice.number}</h2>
            <p className="text-sm text-gray-400">
              {invoice.client} · {invoice.company}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost text-gray-400">
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-surface-700/50 p-4">
            <p className="text-xs text-gray-500">Amount</p>
            <p className="text-xl font-bold text-white">{formatCurrency(invoice.amount)}</p>
          </div>
          <div className="rounded-lg bg-surface-700/50 p-4">
            <p className="text-xs text-gray-500">Due date</p>
            <p className="text-xl font-bold text-white">{formatDate(invoice.dueDate)}</p>
          </div>
          <div className="rounded-lg bg-surface-700/50 p-4">
            <p className="text-xs text-gray-500">Status</p>
            <p className="text-lg font-medium capitalize text-gray-200">{invoice.status}</p>
          </div>
          <div className="rounded-lg bg-surface-700/50 p-4">
            <p className="text-xs text-gray-500">Tone</p>
            <p className="text-lg font-medium capitalize text-gray-200">{invoice.tone}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">Contact info</h3>
            <DevNote title="Client contact">
              Production: synced from invoicing tool. Email via SendGrid, SMS via Twilio using stored
              phone number.
            </DevNote>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-400">
            <p>{invoice.email}</p>
            <p>{invoice.phone}</p>
          </div>
        </div>

        {invoice.status !== "paid" && (
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">Sequence timeline</h3>
              <DevNote title="Sequence timeline">
                Production: each step logged with timestamp. Engine advances based on days since due date
                and last contact.
              </DevNote>
            </div>
            <div className="mt-3 space-y-2">
              {SEQUENCE_LABELS.map((label, i) => {
                const stepNum = i + 1;
                const isComplete = invoice.sequenceStep > stepNum;
                const isCurrent = invoice.sequenceStep === stepNum;
                const isFuture = invoice.sequenceStep < stepNum;

                return (
                  <div
                    key={label}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      isCurrent
                        ? "bg-brand-600/20 ring-1 ring-brand-600/40"
                        : isComplete
                          ? "bg-emerald-900/20"
                          : "bg-surface-700/30 opacity-50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isComplete
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                            ? "bg-brand-600 text-white"
                            : "bg-surface-600 text-gray-400"
                      }`}
                    >
                      {isComplete ? "✓" : stepNum}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">{label}</p>
                      <p className="text-xs text-gray-500">
                        {isComplete
                          ? "Sent"
                          : isCurrent
                            ? invoice.status === "paused"
                              ? "Paused"
                              : "Scheduled / sent"
                            : "Pending"}
                      </p>
                    </div>
                    {isFuture && <span className="text-xs text-gray-600">Upcoming</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-surface-600 pt-6">
          {invoice.status !== "paid" && (
            <>
              <button type="button" onClick={onMarkPaid} className="btn-primary text-sm">
                Mark paid
              </button>
              {invoice.status === "paused" ? (
                <button type="button" onClick={onResume} className="btn-secondary text-sm">
                  Resume sequence
                </button>
              ) : (
                <button type="button" onClick={onPause} className="btn-secondary text-sm">
                  Pause sequence
                </button>
              )}
            </>
          )}
          <button type="button" onClick={onClose} className="btn-ghost text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
