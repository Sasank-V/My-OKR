"use client";

import { useAppContext } from "@/context/app-provider";
import { Sidebar } from "../nav/sidebar";
import { Header } from "../nav/header";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useAppContext();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar on the left */}
      <div className="w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Main layout (Header + Main content) */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
