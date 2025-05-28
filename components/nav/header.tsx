"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const { data: session, status } = useSession();

  // You can safely handle loading or unauthenticated states:
  if (status === "loading") {
    return <header>Loading...</header>;
  }

  if (!session?.user) {
    return (
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b px-5 py-[26px]">
        <div>Please log in to access this content.</div>
      </header>
    );
  }

  const user = session.user;
  // console.log(user);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="px-5 py-[26px]">
        <div className="flex items-center justify-between">
          {/* Left: Sidebar Toggle + Welcome */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name}
              </h1>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex w-1/3">
            <Input
              placeholder="Search OKRs, Teams, People..."
              className="w-full"
            />
          </div>

          {/* Right: Notification + Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <DropdownMenu>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Avatar"}
                      height={50}
                      width={50}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name}</span>
                    {/* If you store role in session, show here */}
                    {/* <span className="text-xs text-muted-foreground">{user.role}</span> */}
                  </div>
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Avatar"}
                      height={50}
                      width={50}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/people/${user.id}`} className="flex gap-2">
                    <User2 className="w-4 h-4 mr-2" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
