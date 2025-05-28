import SidebarLayout from "@/components/layouts/sidebar-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout>
      <div className="flex h-full bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6"> {children}</main>
        </div>
      </div>
    </SidebarLayout>
  );
}
