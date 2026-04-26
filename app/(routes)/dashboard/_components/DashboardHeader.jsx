"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const titles = {
    "/dashboard": "Dashboard",
    "/dashboard/expenses": "Expenses",
    "/dashboard/budgets": "Budgets",
    "/dashboard/analytics": "Analytics",
};

function DashboardHeader() {
    const pathname = usePathname();
    const title = titles[pathname] || "Dashboard";

    return (
        <header className="w-full h-16 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10"
                style={{ borderColor: "var(--border)" }}>

            {/* LEFT */}
            <div>
                <h1 className="text-base font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {title}
                </h1>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

                {/* Search */}
                <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm"
                     style={{ background: "var(--muted)" }}>
                    <Search size={14} className="opacity-40" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        className="bg-transparent outline-none text-sm w-40"
                        style={{ color: "var(--foreground)" }}
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl transition-colors hover:opacity-80"
                        style={{ background: "var(--muted)" }}>
                    <Bell size={16} className="opacity-60" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                </button>

                <UserButton />
            </div>
        </header>
    );
}

export default DashboardHeader;
