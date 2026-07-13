import type { Metadata } from "next";
import DemoApp from "@/components/demo/DemoApp";

export const metadata: Metadata = {
  title: "Live Demo — ChaseBot",
  description: "Interactive mock of ChaseBot invoice chasing sequences with realistic sample data.",
};

export default function DemoPage() {
  return <DemoApp />;
}
