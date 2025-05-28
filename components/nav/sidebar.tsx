"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-provider";
import {
  Target,
  Users,
  Settings,
  Home,
  Plus,
  Building2,
  User2,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
// import { useAppContext } from "@/context/app-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarGroups = [
  {
    id: "group-1",
    items: [
      {
        id: "new",
        label: "New",
        icon: Plus,
        type: "dropdown",
        children: [
          { label: "OKR", icon: Target, href: "/okrs/new" },
          { label: "Person", icon: User, href: "/people/new" },
          { label: "Team", icon: Users, href: "/teams/new" },
          { label: "Department", icon: Building2, href: "/departments/new" },
        ],
      },
      {
        id: "overview",
        label: "Dashboard",
        icon: Home,
        href: "/dashboard",
      },
    ],
  },
  {
    id: "group-2",
    items: [
      {
        id: "company-okrs",
        label: "Company OKRs",
        icon: Target,
        href: "/okrs/company",
      },
      {
        id: "department-okrs",
        label: "Department OKRs",
        icon: Target,
        href: "/okrs/department",
      },
      { id: "team-okrs", label: "Team OKRs", icon: Target, href: "/okrs/team" },
      { id: "my-okrs", label: "My OKRs", icon: Target, href: "/okrs/personal" },
    ],
  },
  {
    id: "group-3",
    items: [
      { id: "people", label: "People", icon: User2, href: "/people" },
      { id: "teams", label: "Teams", icon: Users, href: "/teams" },
      {
        id: "departments",
        label: "Departments",
        icon: Building2,
        href: "/departments",
      },
    ],
  },
  {
    id: "group-4",
    items: [{ id: "admin", label: "Admin", icon: Settings, href: "/admin" }],
  },
];

export function Sidebar() {
  const { data: session } = useSession();
  // const { activeTab, setActiveTab } = useAppContext();
  const user = session?.user;
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white h-full dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <Link
        href={"/"}
        className="p-5 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">MyOKR</h2>
            <p className="text-sm text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </Link>

      {/* Sidebar Content */}
      <nav className="flex-1 p-4 space-y-4">
        {sidebarGroups.map((group, groupIndex) => (
          <div key={group.id}>
            <div className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;

                if (item.type === "dropdown") {
                  return (
                    <DropdownMenu key={item.id}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        className="w-48"
                      >
                        {item.children.map((child, index) => (
                          <DropdownMenuItem key={index} asChild>
                            <Link href={child.href}>
                              <child.icon className="h-4 w-4 mr-3" />
                              {child.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <Button
                    key={item.id}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={item.href || "#"}>
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
            {groupIndex < sidebarGroups.length - 1 && (
              <hr className="my-4 border-gray-300 dark:border-gray-600" />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
