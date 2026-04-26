"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/expenses", { credentials: "include" })
            .then(r => r.json())
            .then(d => { setExpenses(Array.isArray(d) ? d : []); setLoading(false); });
    }, []);

    const grouped = expenses.reduce((acc, e) => {
        const key = e.category || "Uncategorized";
        acc[key] = (acc[key] || 0) + e.amount;
        return acc;
    }, {});

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const total = expenses.reduce((s, e) => s + e.amount, 0);

    const COLORS = [
        "oklch(0.65 0.22 265)",
        "oklch(0.62 0.18 160)",
        "oklch(0.7 0.2 55)",
        "oklch(0.65 0.22 330)",
        "oklch(0.68 0.18 200)",
        "oklch(0.68 0.2 20)",
    ];

    // Group by date
    const byDate = expenses.reduce((acc, e) => {
        const d = new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        acc[d] = (acc[d] || 0) + e.amount;
        return acc;
    }, {});

    const dateEntries = Object.entries(byDate).slice(-14);
    const maxDate = Math.max(...dateEntries.map(([,v]) => v), 1);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h2 className="text-xl font-bold">Analytics</h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    Insights into your spending patterns
                </p>
            </div>

            {/* Spending by category */}
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-bold mb-5">Spending by Category</h3>
                {sorted.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No data yet</p>
                ) : (
                    <div className="space-y-4">
                        {sorted.map(([cat, amt], i) => {
                            const pct = total > 0 ? (amt / total) * 100 : 0;
                            const color = COLORS[i % COLORS.length];
                            return (
                                <div key={cat}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-semibold flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                                            {cat}
                                        </span>
                                        <span className="font-bold">₹{amt.toLocaleString()} <span className="font-normal opacity-50 text-xs">({pct.toFixed(1)}%)</span></span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                                        <div className="h-full rounded-full transition-all duration-700"
                                             style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Spending over time */}
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-bold mb-5">Daily Spending (Last 14 Days)</h3>
                {dateEntries.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No data yet</p>
                ) : (
                    <div className="flex items-end gap-2 h-40">
                        {dateEntries.map(([date, amt], i) => {
                            const pct = (amt / maxDate) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                                    <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>
                                        ₹{amt >= 1000 ? (amt/1000).toFixed(1)+"k" : amt}
                                    </span>
                                    <div className="w-full rounded-t-lg transition-all duration-700"
                                         style={{
                                             height: `${Math.max(pct, 4)}%`,
                                             background: "var(--chart-1)",
                                             opacity: 0.8 + i * 0.015,
                                         }} />
                                    <span className="text-center" style={{ color: "var(--muted-foreground)", fontSize: "9px" }}>
                                        {date}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Top Expenses */}
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-bold mb-5">Top Expenses</h3>
                <div className="space-y-3">
                    {[...expenses].sort((a,b) => b.amount - a.amount).slice(0,5).map((e, i) => (
                        <div key={e.id} className="flex items-center gap-3">
                            <span className="text-sm font-bold opacity-30 w-5">#{i+1}</span>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{e.name}</p>
                                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{e.category || "Uncategorized"}</p>
                            </div>
                            <span className="font-bold text-sm">₹{e.amount.toLocaleString()}</span>
                        </div>
                    ))}
                    {expenses.length === 0 && <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No expenses yet</p>}
                </div>
            </div>
        </div>
    );
}
