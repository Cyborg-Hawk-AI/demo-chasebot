export type InvoiceStatus = "active" | "overdue" | "paid" | "paused";
export type Tone = "friendly" | "firm" | "formal";
export type IntegrationProvider = "quickbooks" | "freshbooks" | "wave" | "csv";

export interface SequenceStep {
  id: string;
  day: number;
  channel: "email" | "email+sms" | "sms";
  label: string;
  enabled: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  client: string;
  company: string;
  email: string;
  phone: string;
  amount: number;
  dueDate: string;
  issuedDate: string;
  status: InvoiceStatus;
  sequenceStep: number;
  lastContact: string;
  tone: Tone;
  integration: IntegrationProvider;
  daysOverdue: number;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: "email" | "sms" | "payment" | "sync" | "sequence";
  message: string;
  invoiceId?: string;
  client?: string;
}

export interface RecoveryMonth {
  month: string;
  collected: number;
  attributed: number;
  invoicesRecovered: number;
}

export interface SequenceTemplate {
  id: string;
  name: string;
  description: string;
  steps: SequenceStep[];
  tone: Tone;
  activeInvoices: number;
}
