"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
    LayoutDashboard,
    Wallet,
    PiggyBank,
    TrendingUp,
} from "lucide-react";

const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Expenses", href: "/dashboard/expenses", icon: Wallet },
    { name: "Budgets", href: "/dashboard/budgets", icon: PiggyBank },
    { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
];

function SideNav() {
    const pathname = usePathname();

    return (
        <aside className="h-screen w-64 flex flex-col" style={{ background: "var(--sidebar)" }}>

            {/* LOGO */}
            <div className="p-6 pb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: "var(--chart-1)" }}>
                        ₹
                    </div>
                    <span className="text-white font-display font-bold text-lg tracking-tight">
                        SpendWise
                    </span>
                </div>
            </div>

            <div className="mx-4 border-b opacity-20" style={{ borderColor: "var(--sidebar-border)" }} />

            {/* NAV */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
                   style={{ color: "oklch(0.6 0.04 265)" }}>
                    Menu
                </p>
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || 
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                            style={{
                                color: isActive ? "white" : "oklch(0.7 0.04 265)",
                                background: isActive ? "var(--sidebar-accent)" : "transparent",
                                borderLeft: isActive ? "3px solid var(--chart-1)" : "3px solid transparent",
                            }}
                        >
                            <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                            <span>{item.name}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t flex items-center gap-3"
                 style={{ borderColor: "var(--sidebar-border)" }}>
                <UserButton appearance={{
                    elements: { avatarBox: "w-8 h-8" }
                }} />
                <div>
                    <p className="text-xs font-medium" style={{ color: "oklch(0.85 0.02 250)" }}>Account</p>
                    <p className="text-xs" style={{ color: "oklch(0.6 0.04 265)" }}>Settings</p>
                </div>
            </div>
        </aside>
    );
}

export default SideNav;
