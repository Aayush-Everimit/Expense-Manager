"use client";

import { useState } from "react";
import { X, Wallet } from "lucide-react";

export default function AddExpenseToBudgetModal({ budget, setOpen, refresh }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    if (!budget) return null;

    const available = budget.available ?? 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !amount) return;

        const amt = Number(amount);

        setLoading(true);
        await fetch("/api/expenses", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.trim(),
                amount: amt,
                category: budget.name,
                budgetId: budget.id,
            }),
        });

        setName("");
        setAmount("");
        setOpen(null);
        setLoading(false);
        refresh();
    };

    const isOver = Number(amount) > available && available >= 0;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in"
             style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>

            <div className="bg-white rounded-2xl w-[400px] shadow-2xl animate-scale-in overflow-hidden">

                {/* Header */}
                <div className="p-6 pb-5 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                 style={{ background: "var(--accent)" }}>
                                <Wallet size={18} style={{ color: "var(--primary)" }} />
                            </div>
                            <div>
                                <h2 className="font-bold text-base">Log Expense</h2>
                                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                    Budget: <span className="font-semibold">{budget.name}</span>
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg"
                                style={{ background: "var(--muted)" }}>
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Budget Status */}
                <div className="mx-6 mt-5 p-3 rounded-xl flex items-center justify-between"
                     style={{ background: "var(--muted)" }}>
                    <div>
                        <p className="text-xs opacity-50 font-medium">Available</p>
                        <p className="font-bold text-lg">₹{available.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-50 font-medium">Total Limit</p>
                        <p className="font-semibold">₹{budget.amount.toLocaleString()}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1.5 block">
                            Expense Name
                        </label>
                        <input
                            placeholder="e.g. Groceries, Netflix, Fuel"
                            className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all"
                            style={{ borderColor: "var(--border)", background: "var(--muted)" }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1.5 block">
                            Amount (₹)
                        </label>
                        <input
                            placeholder="0"
                            type="number"
                            min="1"
                            className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all"
                            style={{
                                borderColor: isOver ? "oklch(0.577 0.245 27.325)" : "var(--border)",
                                background: "var(--muted)",
                            }}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                        {isOver && (
                            <p className="text-xs mt-1.5 font-medium" style={{ color: "oklch(0.577 0.245 27.325)" }}>
                                ⚠ This exceeds your available budget by ₹{(Number(amount) - available).toLocaleString()}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={() => setOpen(null)}
                                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                            style={{ background: "var(--primary)" }}
                        >
                            {loading ? "Saving..." : "Log Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
