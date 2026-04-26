"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight } from "lucide-react";

// Simple donut chart (pure SVG, no deps)
function DonutChart({ data, total }) {
    if (!data.length) return (
        <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--muted-foreground)" }}>
            No data yet
        </div>
    );

    const COLORS = [
        "oklch(0.65 0.22 265)",
        "oklch(0.72 0.18 160)",
        "oklch(0.75 0.2 55)",
        "oklch(0.65 0.22 330)",
        "oklch(0.7 0.18 200)",
        "oklch(0.68 0.2 20)",
    ];

    const radius = 70;
    const cx = 90;
    const cy = 90;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;
    const slices = data.map((d, i) => {
        const pct = d.value / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const slice = { ...d, dash, gap, offset, color: COLORS[i % COLORS.length] };
        offset += dash;
        return slice;
    });

    return (
        <div className="flex items-center gap-6">
            <svg viewBox="0 0 180 180" className="w-40 h-40 shrink-0" style={{ transform: "rotate(-90deg)" }}>
                {slices.map((s, i) => (
                    <circle
                        key={i}
                        cx={cx} cy={cy} r={radius}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="24"
                        strokeDasharray={`${s.dash} ${s.gap}`}
                        strokeDashoffset={-s.offset}
                        style={{ transition: "stroke-dasharray 0.6s ease" }}
                    />
                ))}
                <circle cx={cx} cy={cy} r={radius - 20} fill="white" />
            </svg>
            <div className="space-y-1.5 min-w-0">
                {slices.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="truncate font-medium" style={{ color: "var(--foreground)" }}>{s.label}</span>
                        <span className="ml-auto font-semibold text-xs" style={{ color: "var(--muted-foreground)" }}>
                            ₹{s.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Simple bar chart
function BarChart({ data }) {
    if (!data.length) return (
        <div className="flex items-center justify-center h-32 text-sm" style={{ color: "var(--muted-foreground)" }}>
            No data
        </div>
    );
    const max = Math.max(...data.map(d => d.value));

    const COLORS = [
        "oklch(0.65 0.22 265)",
        "oklch(0.72 0.18 160)",
        "oklch(0.75 0.2 55)",
        "oklch(0.65 0.22 330)",
        "oklch(0.7 0.18 200)",
        "oklch(0.68 0.2 20)",
    ];

    return (
        <div className="flex items-end gap-2 h-36 pt-2">
            {data.map((d, i) => {
                const pct = max > 0 ? (d.value / max) * 100 : 0;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                        <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                            ₹{d.value >= 1000 ? (d.value/1000).toFixed(1)+"k" : d.value}
                        </span>
                        <div className="w-full rounded-t-lg transition-all duration-700"
                             style={{
                                 height: `${Math.max(pct, 4)}%`,
                                 background: COLORS[i % COLORS.length],
                                 opacity: 0.85,
                             }} />
                        <span className="text-xs truncate w-full text-center font-medium"
                              style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>
                            {d.label.length > 8 ? d.label.slice(0, 7) + "…" : d.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        const [expRes, budRes] = await Promise.all([
            fetch("/api/expenses", { credentials: "include" }),
            fetch("/api/budgets", { credentials: "include" }),
        ]);
        const [expData, budData] = await Promise.all([expRes.json(), budRes.json()]);
        setExpenses(Array.isArray(expData) ? expData : []);
        setBudgets(Array.isArray(budData) ? budData : []);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgPerExpense = expenses.length ? Math.round(total / expenses.length) : 0;
    const recent = [...expenses].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

    // Category breakdown for charts
    const grouped = expenses.reduce((acc, e) => {
        const key = e.category || "Uncategorized";
        acc[key] = (acc[key] || 0) + e.amount;
        return acc;
    }, {});

    const chartData = Object.entries(grouped)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    // Budget utilization
    const budgetSpend = budgets.map(b => {
        const spent = expenses.filter(e => e.budgetId === b.id).reduce((s, e) => s + e.amount, 0);
        return { ...b, spent, pct: Math.min((spent / b.amount) * 100, 100) };
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                     style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
                {[
                    {
                        label: "Total Spent",
                        value: `₹${total.toLocaleString()}`,
                        icon: Wallet,
                        color: "oklch(0.65 0.22 265)",
                        bg: "oklch(0.95 0.04 265)",
                        trend: expenses.length > 0 ? "+this month" : "No data",
                    },
                    {
                        label: "Avg per Entry",
                        value: `₹${avgPerExpense.toLocaleString()}`,
                        icon: TrendingUp,
                        color: "oklch(0.62 0.18 160)",
                        bg: "oklch(0.95 0.04 160)",
                        trend: `${expenses.length} entries`,
                    },
                    {
                        label: "Total Budgets",
                        value: budgets.length,
                        icon: PiggyBank,
                        color: "oklch(0.65 0.22 55)",
                        bg: "oklch(0.96 0.04 55)",
                        trend: `₹${budgets.reduce((s,b)=>s+b.amount,0).toLocaleString()} allocated`,
                    },
                    {
                        label: "Categories",
                        value: Object.keys(grouped).length,
                        icon: TrendingDown,
                        color: "oklch(0.65 0.22 330)",
                        bg: "oklch(0.96 0.04 330)",
                        trend: "expense groups",
                    },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i}
                             className="bg-white rounded-2xl p-5 border animate-fade-in-up"
                             style={{ borderColor: "var(--border)", animationDelay: `${i * 60}ms` }}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                     style={{ background: stat.bg }}>
                                    <Icon size={18} style={{ color: stat.color }} />
                                </div>
                                <ArrowUpRight size={14} className="opacity-30 mt-1" />
                            </div>
                            <p className="text-2xl font-bold tracking-tight mb-0.5">{stat.value}</p>
                            <p className="text-xs font-medium opacity-50">{stat.label}</p>
                            <p className="text-xs mt-1" style={{ color: stat.color }}>{stat.trend}</p>
                        </div>
                    );
                })}
            </div>

            {/* CHARTS ROW */}
            <div className="grid md:grid-cols-2 gap-4">

                {/* Donut */}
                <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-base">Category Split</h2>
                        <span className="text-xs px-2 py-1 rounded-lg font-medium"
                              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                            All time
                        </span>
                    </div>
                    <DonutChart data={chartData} total={total} />
                </div>

                {/* Bar */}
                <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-base">Spending by Category</h2>
                        <span className="text-xs px-2 py-1 rounded-lg font-medium"
                              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                            Top 6
                        </span>
                    </div>
                    <BarChart data={chartData} />
                </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="grid md:grid-cols-2 gap-4">

                {/* Recent Expenses */}
                <div className="bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                    <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                        <h2 className="font-bold text-base">Recent Expenses</h2>
                    </div>
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {recent.length === 0 ? (
                            <p className="p-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                No expenses yet. Add one to get started!
                            </p>
                        ) : recent.map((e) => (
                            <div key={e.id} className="flex items-center justify-between px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                                         style={{ background: "var(--chart-1)" }}>
                                        {(e.name || "?")[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{e.name}</p>
                                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            {e.category || "Uncategorized"} · {new Date(e.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold">₹{e.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget Progress */}
                <div className="bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                    <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                        <h2 className="font-bold text-base">Budget Status</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {budgetSpend.length === 0 ? (
                            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                No budgets yet. Create one in the Budgets tab!
                            </p>
                        ) : budgetSpend.map((b) => {
                            const isOver = b.pct >= 100;
                            const isWarn = b.pct >= 75;
                            const barColor = isOver
                                ? "oklch(0.577 0.245 27.325)"
                                : isWarn
                                ? "oklch(0.75 0.2 55)"
                                : "var(--chart-1)";

                            return (
                                <div key={b.id}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-semibold">{b.name}</span>
                                        <span className="text-xs font-medium" style={{ color: isOver ? barColor : "var(--muted-foreground)" }}>
                                            ₹{b.spent.toLocaleString()} / ₹{b.amount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden"
                                         style={{ background: "var(--muted)" }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${b.pct}%`, background: barColor }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-0.5">
                                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            {Math.round(b.pct)}% used
                                        </span>
                                        <span className="text-xs" style={{ color: isOver ? barColor : "var(--muted-foreground)" }}>
                                            {isOver ? "⚠ Over budget!" : `₹${(b.amount - b.spent).toLocaleString()} left`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}
