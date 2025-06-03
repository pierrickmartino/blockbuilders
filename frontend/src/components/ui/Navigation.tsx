"use client";

import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import Link from "next/link";
import { Notifications } from "./Notifications";

import { usePathname } from "next/navigation";
import { Logo } from "../Logo";
import { DropdownUserProfile } from "./UserProfile";

function Navigation() {
  const pathname = usePathname();
  return (
    <div className="shadow-s sticky top-0 z-20 bg-white dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 pt-3">
        <div>
          <span className="sr-only">Your Company</span>
          <Logo className="h-6" />
        </div>
        <div className="flex h-[42px] flex-nowrap gap-1">
          <Notifications />
          <DropdownUserProfile />
        </div>
      </div>
      <TabNavigation className="mt-5">
        <div className="mx-auto flex w-full max-w-7xl items-center px-6">
          <TabNavigationLink className="inline-flex gap-2" asChild active={pathname === "/overview"}>
            <Link href="/overview">Overview</Link>
          </TabNavigationLink>
          <TabNavigationLink className="inline-flex gap-2" asChild active={pathname === "/wallets"}>
            <Link href="/wallets">Wallets</Link>
          </TabNavigationLink>
          <TabNavigationLink className="inline-flex gap-2" asChild active={pathname === "/positions"}>
            <Link href="/positions">Positions</Link>
          </TabNavigationLink>
          <TabNavigationLink className="inline-flex gap-2" asChild active={pathname === "/transactions"}>
            <Link href="/transactions">Transactions</Link>
          </TabNavigationLink>
          <TabNavigationLink className="inline-flex gap-2" asChild active={pathname === "/contracts"}>
            <Link href="/contracts">Contracts</Link>
          </TabNavigationLink>
        </div>
      </TabNavigation>
    </div>
  );
}

export { Navigation };
