"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const COLORS = [
    "oklch(0.65 0.22 265)",
    "oklch(0.62 0.18 160)",
    "oklch(0.7 0.2 55)",
    "oklch(0.65 0.22 330)",
    "oklch(0.68 0.18 200)",
    "oklch(0.68 0.2 20)",
];

export default function BudgetCard({ budget, index, onAddExpense, onDelete }) {
    const [expanded, setExpanded] = useState(false);
    const { name, amount, spent, available, pct, budgetExpenses } = budget;

    const isOver = pct >= 100;
    const isWarn = pct >= 75;
    const color = COLORS[index % COLORS.length];
    const barColor = isOver ? "oklch(0.577 0.245 27.325)" : isWarn ? "oklch(0.75 0.2 55)" : color;

    return (
        <div className="bg-white rounded-2xl border overflow-hidden animate-fade-in-up transition-shadow hover:shadow-lg"
             style={{ borderColor: "var(--border)", animationDelay: `${index * 60}ms` }}>

            {/* Color accent bar */}
            <div className="h-1" style={{ background: barColor }} />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                             style={{ background: color }}>
                            {name[0].toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-base">{name}</h3>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                {budgetExpenses.length} expense{budgetExpenses.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                    >
                        <Trash2 size={14} style={{ color: "oklch(0.577 0.245 27.325)" }} />
                    </button>
                </div>

                {/* Amounts */}
                <div className="flex justify-between text-sm mb-3">
                    <div>
                        <p className="text-xs font-medium opacity-50 mb-0.5">Spent</p>
                        <p className="font-bold" style={{ color: barColor }}>₹{spent.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium opacity-50 mb-0.5">Limit</p>
                        <p className="font-bold">₹{amount.toLocaleString()}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 rounded-full overflow-hidden mb-1.5"
                     style={{ background: "var(--muted)" }}>
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: barColor }}
                    />
                </div>
                <div className="flex justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <span>{Math.round(pct)}% used</span>
                    <span style={{ color: isOver ? barColor : undefined }}>
                        {isOver ? "⚠ Over budget!" : `₹${available.toLocaleString()} left`}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={onAddExpense}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: color }}
                    >
                        <Plus size={15} /> Log Expense
                    </button>
                    {budgetExpenses.length > 0 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                        >
                            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded Expenses */}
            {expanded && budgetExpenses.length > 0 && (
                <div className="border-t px-5 pb-4" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-widest pt-3 pb-2 opacity-40">
                        Expenses
                    </p>
                    <div className="space-y-2">
                        {budgetExpenses.map(e => (
                            <div key={e.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                                    <span className="font-medium">{e.name}</span>
                                </div>
                                <span className="font-semibold">₹{e.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
