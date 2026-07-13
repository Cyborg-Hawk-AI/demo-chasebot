"use client";

import { useState, useMemo, useCallback } from "react";
import DevNote from "@/components/DevNote";
import { useToast } from "@/components/Toast";
import {
  INITIAL_INVOICES,
  ACTIVITY_FEED,
  RECOVERY_DATA,
  DASHBOARD_STATS,
  SEQUENCE_TEMPLATES,
  DEFAULT_SEQUENCE_STEPS,
  TONE_PREVIEWS,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";
import type { Invoice, Tone, IntegrationProvider, SequenceStep } from "@/lib/types";
import RecoveryChart from "./RecoveryChart";
import ConnectWizard from "./ConnectWizard";
import InvoiceDetailModal from "./InvoiceDetailModal";

type Tab = "dashboard" | "invoices" | "sequences" | "integrations" | "reports";
type StatusFilter = "all" | "active" | "overdue" | "paid" | "paused";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "invoices", label: "Invoices", icon: "📄" },
  { id: "sequences", label: "Sequences", icon: "📬" },
  { id: "integrations", label: "Integrations", icon: "🔗" },
  { id: "reports", label: "Recovery Report", icon: "💰" },
];

const INTEGRATION_STATUS: Record<IntegrationProvider, { name: string; connected: boolean; lastSync: string }> = {
  quickbooks: { name: "QuickBooks Online", connected: true, lastSync: "Today, 8:00 AM" },
  freshbooks: { name: "FreshBooks", connected: true, lastSync: "Yesterday, 8:00 AM" },
  wave: { name: "Wave", connected: true, lastSync: "Jul 5, 8:00 AM" },
  csv: { name: "CSV Upload", connected: false, lastSync: "—" },
};

export default function DemoShell() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [activity, setActivity] = useState(ACTIVITY_FEED);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showConnectWizard, setShowConnectWizard] = useState(false);
  const [connectProvider, setConnectProvider] = useState<IntegrationProvider | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [sequenceSteps, setSequenceSteps] = useState<SequenceStep[]>(DEFAULT_SEQUENCE_STEPS);
  const [globalTone, setGlobalTone] = useState<Tone>("friendly");
  const [reportMonth, setReportMonth] = useState(5);
  const [integrations, setIntegrations] = useState(INTEGRATION_STATUS);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        inv.client.toLowerCase().includes(q) ||
        inv.company.toLowerCase().includes(q) ||
        inv.number.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const outstanding = invoices
      .filter((i) => i.status !== "paid")
      .reduce((sum, i) => sum + i.amount, 0);
    const active = invoices.filter((i) => i.status === "active" || i.status === "overdue").length;
    return { ...DASHBOARD_STATS, totalOutstanding: outstanding, activeSequences: active };
  }, [invoices]);

  const handleMarkPaid = useCallback(
    (invoiceId: string) => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId
            ? { ...inv, status: "paid" as const, sequenceStep: 0, daysOverdue: 0 }
            : inv
        )
      );
      const inv = invoices.find((i) => i.id === invoiceId);
      if (inv) {
        setActivity((prev) => [
          {
            id: `act-${Date.now()}`,
            timestamp: "Just now",
            type: "payment",
            message: `Marked paid — sequence stopped for ${inv.client} (${formatCurrency(inv.amount)})`,
            invoiceId: inv.id,
            client: inv.client,
          },
          ...prev,
        ]);
        showToast(`✓ ${inv.client} marked paid — sequence stopped`, "success");
        setSelectedInvoice(null);
      }
    },
    [invoices, showToast]
  );

  const handlePauseSequence = useCallback(
    (invoiceId: string) => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, status: "paused" as const } : inv
        )
      );
      const inv = invoices.find((i) => i.id === invoiceId);
      if (inv) {
        showToast(`Sequence paused for ${inv.client}`, "info");
        setSelectedInvoice(null);
      }
    },
    [invoices, showToast]
  );

  const handleResumeSequence = useCallback(
    (invoiceId: string) => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId
            ? { ...inv, status: inv.daysOverdue > 0 ? ("overdue" as const) : ("active" as const) }
            : inv
        )
      );
      showToast("Sequence resumed", "success");
    },
    [showToast]
  );

  const handleToneChange = (tone: Tone) => {
    setGlobalTone(tone);
    showToast(`Default tone set to "${tone}"`, "info");
  };

  const handleStepToggle = (stepId: string) => {
    setSequenceSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, enabled: !s.enabled } : s))
    );
    showToast("Sequence step updated", "info");
  };

  const handleStepDayChange = (stepId: string, day: number) => {
    setSequenceSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, day: Math.max(1, day) } : s))
    );
  };

  const handleConnect = (provider: IntegrationProvider) => {
    setConnectProvider(provider);
    setShowConnectWizard(true);
  };

  const handleConnectComplete = (provider: IntegrationProvider) => {
    setIntegrations((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], connected: true, lastSync: "Just now" },
    }));
    setShowConnectWizard(false);
    setConnectProvider(null);
    showToast(`${integrations[provider].name} connected successfully`, "success");
    setActivity((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        type: "sync",
        message: `${integrations[provider].name} connected — initial sync imported unpaid invoices`,
      },
      ...prev,
    ]);
  };

  const handleSyncNow = (provider: IntegrationProvider) => {
    showToast(`Syncing ${integrations[provider].name}...`, "info");
    setTimeout(() => {
      setIntegrations((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], lastSync: "Just now" },
      }));
      showToast(`${integrations[provider].name} sync complete — 2 invoices updated`, "success");
    }, 1500);
  };

  const handleDisconnect = (provider: IntegrationProvider) => {
    setIntegrations((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], connected: false, lastSync: "—" },
    }));
    showToast(`${integrations[provider].name} disconnected`, "warning");
  };

  const handleDownloadReport = () => {
    showToast("Recovery report PDF downloaded (mock)", "success");
  };

  const handleEmailReport = () => {
    showToast("Recovery report emailed to you@yourbusiness.com (mock)", "success");
  };

  const statusBadge = (status: Invoice["status"]) => {
    const styles = {
      active: "bg-brand-900/60 text-brand-300 ring-brand-700/50",
      overdue: "bg-red-900/60 text-red-300 ring-red-700/50",
      paid: "bg-emerald-900/60 text-emerald-300 ring-emerald-700/50",
      paused: "bg-amber-900/60 text-amber-300 ring-amber-700/50",
    };
    return (
      <span className={`badge ring-1 ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const currentReport = RECOVERY_DATA[reportMonth];

  return (
    <div className="min-h-screen bg-surface-900">
      {/* Demo header */}
      <div className="border-b border-surface-600/60 bg-surface-800/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-white">ChaseBot Dashboard</h1>
                <span className="badge bg-amber-900/60 text-amber-300 ring-1 ring-amber-700/50">DEMO</span>
              </div>
              <p className="text-sm text-gray-500">Riverside Creative Studio · Mock account</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowConnectWizard(true);
                  setConnectProvider(null);
                }}
                className="btn-secondary text-sm"
              >
                + Connect tool
              </button>
              <DevNote title="Connect invoicing tool">
                Production: OAuth flow with QuickBooks/FreshBooks/Wave APIs. Nightly cron syncs unpaid
                invoices. CSV upload parsed server-side.
              </DevNote>
            </div>
          </div>

          {/* Tabs */}
          <nav className="mt-4 flex gap-1 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-brand-600 text-white"
                    : "text-gray-400 hover:bg-surface-700 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-fade-in space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Outstanding", value: formatCurrency(stats.totalOutstanding), note: "Unpaid invoices" },
                { label: "Active sequences", value: String(stats.activeSequences), note: "Currently chasing" },
                { label: "Recovered (Jul)", value: formatCurrency(stats.recoveredThisMonth), note: "Via automation" },
                { label: "Collection rate", value: `${stats.collectionRate}%`, note: "Last 90 days" },
              ].map((stat) => (
                <div key={stat.label} className="card p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{stat.note}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white">Recovery trend</h2>
                  <DevNote title="Recovery metrics">
                    Production: aggregated from payment webhooks matched to active sequences at time of
                    contact.
                  </DevNote>
                </div>
                <div className="mt-4">
                  <RecoveryChart data={RECOVERY_DATA} highlightIndex={reportMonth} />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white">Recent activity</h2>
                  <button
                    type="button"
                    onClick={() => showToast("Activity feed refreshed", "info")}
                    className="btn-ghost text-xs"
                  >
                    Refresh
                  </button>
                </div>
                <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
                  {activity.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className="flex cursor-pointer gap-3 rounded-lg p-2 transition hover:bg-surface-700/50"
                      onClick={() => {
                        if (item.invoiceId) {
                          const inv = invoices.find((i) => i.id === item.invoiceId);
                          if (inv) setSelectedInvoice(inv);
                        } else {
                          showToast(item.message, "info");
                        }
                      }}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                          item.type === "payment"
                            ? "bg-emerald-900/60"
                            : item.type === "email"
                              ? "bg-brand-900/60"
                              : item.type === "sms"
                                ? "bg-purple-900/60"
                                : item.type === "sync"
                                  ? "bg-surface-600"
                                  : "bg-amber-900/60"
                        }`}
                      >
                        {item.type === "payment"
                          ? "💵"
                          : item.type === "email"
                            ? "✉️"
                            : item.type === "sms"
                              ? "📱"
                              : item.type === "sync"
                                ? "🔄"
                                : "⚡"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-300">{item.message}</p>
                        <p className="text-xs text-gray-500">{item.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Overdue invoices needing attention</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("invoices")}
                  className="text-sm text-brand-400 hover:underline"
                >
                  View all →
                </button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-surface-600 text-xs uppercase tracking-wider text-gray-500">
                      <th className="pb-3 pr-4">Invoice</th>
                      <th className="pb-3 pr-4">Client</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Days overdue</th>
                      <th className="pb-3 pr-4">Step</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices
                      .filter((i) => i.status === "overdue")
                      .slice(0, 5)
                      .map((inv) => (
                        <tr
                          key={inv.id}
                          className="border-b border-surface-700/50 cursor-pointer hover:bg-surface-700/30"
                          onClick={() => setSelectedInvoice(inv)}
                        >
                          <td className="py-3 pr-4 font-medium text-brand-300">{inv.number}</td>
                          <td className="py-3 pr-4 text-gray-300">{inv.client}</td>
                          <td className="py-3 pr-4 text-gray-300">{formatCurrency(inv.amount)}</td>
                          <td className="py-3 pr-4 text-red-400">{inv.daysOverdue}d</td>
                          <td className="py-3 pr-4 text-gray-400">Step {inv.sequenceStep}/4</td>
                          <td className="py-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkPaid(inv.id);
                              }}
                              className="rounded bg-emerald-600/20 px-2 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30"
                            >
                              Mark paid
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INVOICES */}
        {activeTab === "invoices" && (
          <div className="animate-fade-in space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {(["all", "active", "overdue", "paid", "paused"] as StatusFilter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setStatusFilter(f)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                      statusFilter === f
                        ? "bg-brand-600 text-white"
                        : "bg-surface-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search client, company, invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field w-full sm:w-64"
                />
                <DevNote title="Invoice table">
                  Production: paginated query from Supabase, filtered by status. Row click opens detail
                  drawer with full sequence timeline.
                </DevNote>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-700/50">
                    <tr className="text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3">Invoice #</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Due date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Sequence</th>
                      <th className="px-4 py-3">Tone</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-t border-surface-700/50 cursor-pointer transition hover:bg-surface-700/30"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <td className="px-4 py-3 font-medium text-brand-300">{inv.number}</td>
                        <td className="px-4 py-3">
                          <div className="text-gray-200">{inv.client}</div>
                          <div className="text-xs text-gray-500">{inv.company}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{formatCurrency(inv.amount)}</td>
                        <td className="px-4 py-3 text-gray-400">{formatDate(inv.dueDate)}</td>
                        <td className="px-4 py-3">{statusBadge(inv.status)}</td>
                        <td className="px-4 py-3 text-gray-400">
                          {inv.status === "paid" ? "—" : `Step ${inv.sequenceStep}/4`}
                        </td>
                        <td className="px-4 py-3 capitalize text-gray-400">{inv.tone}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            {inv.status !== "paid" && (
                              <button
                                type="button"
                                onClick={() => handleMarkPaid(inv.id)}
                                className="rounded bg-emerald-600/20 px-2 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30"
                              >
                                Mark paid
                              </button>
                            )}
                            {inv.status === "paused" ? (
                              <button
                                type="button"
                                onClick={() => handleResumeSequence(inv.id)}
                                className="rounded bg-brand-600/20 px-2 py-1 text-xs font-medium text-brand-400 hover:bg-brand-600/30"
                              >
                                Resume
                              </button>
                            ) : inv.status !== "paid" ? (
                              <button
                                type="button"
                                onClick={() => handlePauseSequence(inv.id)}
                                className="rounded bg-amber-600/20 px-2 py-1 text-xs font-medium text-amber-400 hover:bg-amber-600/30"
                              >
                                Pause
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-surface-600 px-4 py-3 text-xs text-gray-500">
                Showing {filteredInvoices.length} of {invoices.length} invoices
              </div>
            </div>
          </div>
        )}

        {/* SEQUENCES */}
        {activeTab === "sequences" && (
          <div className="animate-fade-in space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-white">Sequence templates</h2>
                  <DevNote title="Sequence templates">
                    Production: stored in DB per account. Each invoice assigned a template on import.
                  </DevNote>
                </div>
                {SEQUENCE_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tpl.id);
                      setSequenceSteps(tpl.steps);
                      setGlobalTone(tpl.tone);
                      showToast(`Loaded "${tpl.name}" template`, "info");
                    }}
                    className={`card w-full p-4 text-left transition ${
                      selectedTemplate === tpl.id
                        ? "ring-2 ring-brand-600"
                        : "hover:border-brand-600/40"
                    }`}
                  >
                    <h3 className="font-medium text-white">{tpl.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{tpl.description}</p>
                    <p className="mt-2 text-xs text-brand-400">{tpl.activeInvoices} active invoices</p>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2 space-y-6">
                {/* Tone selector */}
                <div className="card p-6">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">Tone selector</h2>
                    <DevNote title="Tone selector">
                      Production: LLM-generated templates per tone. Friendly uses casual language; formal
                      includes legal language. Applied per-step in sequence engine.
                    </DevNote>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Match message style to the client relationship
                  </p>
                  <div className="mt-4 flex gap-2">
                    {(["friendly", "firm", "formal"] as Tone[]).map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => handleToneChange(tone)}
                        className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium capitalize transition ${
                          globalTone === tone
                            ? "border-brand-500 bg-brand-600/20 text-brand-300"
                            : "border-surface-500 bg-surface-700 text-gray-400 hover:border-surface-400"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg bg-surface-700/50 p-4">
                    <p className="text-xs font-medium text-gray-500">Preview ({globalTone})</p>
                    <p className="mt-2 text-sm font-medium text-gray-200">
                      {TONE_PREVIEWS[globalTone].subject}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      {TONE_PREVIEWS[globalTone].body}
                    </p>
                  </div>
                </div>

                {/* Step builder */}
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-white">Sequence steps</h2>
                      <DevNote title="Sequence engine">
                        Production: hourly cron evaluates due_date + last_contact_date for each active
                        invoice. Fires next enabled step via SendGrid (email) and Twilio (SMS).
                      </DevNote>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Sequence saved", "success")}
                      className="btn-primary text-sm"
                    >
                      Save sequence
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {sequenceSteps.map((step, idx) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-4 rounded-lg border p-4 transition ${
                          step.enabled
                            ? "border-surface-500 bg-surface-700/30"
                            : "border-surface-600/50 bg-surface-800/50 opacity-60"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-sm font-bold text-brand-400">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-200">{step.label}</p>
                          <p className="text-xs text-gray-500">
                            Day {step.day} · {step.channel}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1 text-xs text-gray-400">
                            Day
                            <input
                              type="number"
                              min={1}
                              value={step.day}
                              onChange={(e) =>
                                handleStepDayChange(step.id, parseInt(e.target.value) || 1)
                              }
                              className="input-field w-16 py-1 text-center"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleStepToggle(step.id)}
                            className={`relative h-6 w-11 rounded-full transition ${
                              step.enabled ? "bg-brand-600" : "bg-surface-500"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                                step.enabled ? "left-5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTEGRATIONS */}
        {activeTab === "integrations" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white">Connected invoicing tools</h2>
              <DevNote title="OAuth integrations">
                Production: QuickBooks/FreshBooks OAuth 2.0 with refresh tokens stored encrypted.
                Nightly cron pulls unpaid invoices. Wave uses API key. CSV parsed on upload.
              </DevNote>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(Object.keys(integrations) as IntegrationProvider[]).map((provider) => {
                const info = integrations[provider];
                const icons: Record<IntegrationProvider, string> = {
                  quickbooks: "📗",
                  freshbooks: "📘",
                  wave: "🌊",
                  csv: "📋",
                };
                return (
                  <div key={provider} className="card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{icons[provider]}</span>
                        <div>
                          <h3 className="font-medium text-white">{info.name}</h3>
                          <p className="text-xs text-gray-500">
                            Last sync: {info.lastSync}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`badge ring-1 ${
                          info.connected
                            ? "bg-emerald-900/60 text-emerald-300 ring-emerald-700/50"
                            : "bg-surface-600 text-gray-400 ring-surface-500"
                        }`}
                      >
                        {info.connected ? "Connected" : "Not connected"}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {info.connected ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSyncNow(provider)}
                            className="btn-secondary flex-1 text-sm"
                          >
                            Sync now
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDisconnect(provider)}
                            className="btn-ghost text-sm text-red-400"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConnect(provider)}
                          className="btn-primary flex-1 text-sm"
                        >
                          Connect {info.name}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card p-6">
              <h3 className="font-medium text-white">Sync schedule</h3>
              <p className="mt-1 text-sm text-gray-500">
                Unpaid invoices are automatically imported every night at 8:00 AM UTC
              </p>
              <div className="mt-4 flex items-center gap-4">
                <select
                  className="input-field w-auto"
                  defaultValue="daily"
                  onChange={(e) => showToast(`Sync schedule set to ${e.target.value}`, "info")}
                >
                  <option value="hourly">Every hour</option>
                  <option value="daily">Daily (recommended)</option>
                  <option value="weekly">Weekly</option>
                </select>
                <span className="text-sm text-gray-500">Next sync: Tonight at 8:00 PM EST</span>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-white">Monthly Recovery Report</h2>
                <DevNote title="Recovery report">
                  Production: cron job aggregates payments attributed to sequence contacts. Generates PDF
                  via Puppeteer, emails via SendGrid on the 1st of each month.
                </DevNote>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleDownloadReport} className="btn-secondary text-sm">
                  Download PDF
                </button>
                <button type="button" onClick={handleEmailReport} className="btn-primary text-sm">
                  Email report
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {RECOVERY_DATA.map((m, i) => (
                <button
                  key={m.month}
                  type="button"
                  onClick={() => setReportMonth(i)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    reportMonth === i
                      ? "bg-brand-600 text-white"
                      : "bg-surface-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {m.month}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="card p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">Total collected</p>
                <p className="mt-1 font-display text-3xl font-bold text-white">
                  {formatCurrency(currentReport.collected)}
                </p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">Attributed to ChaseBot</p>
                <p className="mt-1 font-display text-3xl font-bold text-emerald-400">
                  {formatCurrency(currentReport.attributed)}
                </p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">Invoices recovered</p>
                <p className="mt-1 font-display text-3xl font-bold text-brand-400">
                  {currentReport.invoicesRecovered}
                </p>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-white">6-month recovery trend</h3>
              <div className="mt-4">
                <RecoveryChart data={RECOVERY_DATA} highlightIndex={reportMonth} />
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-white">Recovered invoices — {currentReport.month}</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-surface-600 text-xs uppercase tracking-wider text-gray-500">
                      <th className="pb-3 pr-4">Client</th>
                      <th className="pb-3 pr-4">Invoice</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Sequence step</th>
                      <th className="pb-3">Days to pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { client: "Priya Sharma", inv: "INV-2026-0369", amount: 1650, step: 2, days: 8 },
                      { client: "Tom Bradley", inv: "INV-2026-0322", amount: 890, step: 1, days: 5 },
                      { client: "Nina Patel", inv: "INV-2026-0310", amount: 2340, step: 3, days: 14 },
                      { client: "Chris Morrison", inv: "INV-2026-0298", amount: 1270, step: 2, days: 9 },
                    ]
                      .slice(0, currentReport.invoicesRecovered)
                      .map((row) => (
                        <tr key={row.inv} className="border-b border-surface-700/50">
                          <td className="py-3 pr-4 text-gray-300">{row.client}</td>
                          <td className="py-3 pr-4 text-brand-300">{row.inv}</td>
                          <td className="py-3 pr-4 text-gray-300">{formatCurrency(row.amount)}</td>
                          <td className="py-3 pr-4 text-gray-400">Step {row.step}</td>
                          <td className="py-3 text-gray-400">{row.days} days</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-white">ROI summary</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-surface-700/50 p-4">
                  <p className="text-sm text-gray-400">ChaseBot subscription cost</p>
                  <p className="mt-1 text-xl font-bold text-white">$29.00</p>
                </div>
                <div className="rounded-lg bg-emerald-900/20 p-4">
                  <p className="text-sm text-gray-400">Net recovery (attributed − cost)</p>
                  <p className="mt-1 text-xl font-bold text-emerald-400">
                    {formatCurrency(currentReport.attributed - 29)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                {Math.round(currentReport.attributed / 29)}× return on subscription this month
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onMarkPaid={() => handleMarkPaid(selectedInvoice.id)}
          onPause={() => handlePauseSequence(selectedInvoice.id)}
          onResume={() => handleResumeSequence(selectedInvoice.id)}
        />
      )}

      {showConnectWizard && (
        <ConnectWizard
          provider={connectProvider}
          onClose={() => {
            setShowConnectWizard(false);
            setConnectProvider(null);
          }}
          onComplete={handleConnectComplete}
          onSelectProvider={setConnectProvider}
        />
      )}
    </div>
  );
}
