"use client";

import { ToastProvider } from "@/components/Toast";
import DemoShell from "./DemoShell";

export default function DemoApp() {
  return (
    <ToastProvider>
      <DemoShell />
    </ToastProvider>
  );
}
