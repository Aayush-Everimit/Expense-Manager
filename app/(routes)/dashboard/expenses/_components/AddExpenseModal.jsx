"use client";

import { useEffect, useState } from "react";
import { X, Wallet } from "lucide-react";

export default function AddExpenseModal({ open, setOpen, refresh, defaultCategory }) {
    const [form, setForm] = useState({ name: "", amount: "", category: "" });
    const [loading, setLoading] = useState(false);
    const [budgets, setBudgets] = useState([]);
    const [linkedBudget, setLinkedBudget] = useState("");

    useEffect(() => {
        if (open) {
            setForm(prev => ({ ...prev, category: defaultCategory || "" }));
            // fetch budgets to allow linking
            fetch("/api/budgets", { credentials: "include" })
                .then(r => r.json())
                .then(d => setBudgets(Array.isArray(d) ? d : []));
        }
    }, [open, defaultCategory]);

    if (!open) return null;

    const handleClose = () => {
        setForm({ name: "", amount: "", category: "" });
        setLinkedBudget("");
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.amount) return;
        setLoading(true);

        await fetch("/api/expenses", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                name: form.name.trim(),
                budgetId: linkedBudget ? Number(linkedBudget) : null,
            }),
        });

        setForm({ name: "", amount: "", category: "" });
        setLinkedBudget("");
        setOpen(false);
        setLoading(false);
        refresh();
    };

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
                            <h2 className="font-bold text-lg">Add Expense</h2>
                        </div>
                        <button onClick={handleClose}
                                className="w-8 h-8 flex items-center justify-center rounded-lg"
                                style={{ background: "var(--muted)" }}>
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1.5 block">Name</label>
                        <input
                            placeholder="e.g. Lunch, Electricity bill"
                            className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                            style={{ borderColor: "var(--border)", background: "var(--muted)" }}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1.5 block">Amount (₹)</label>
                        <input
                            type="number"
                            placeholder="0"
                            min="1"
                            className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                            style={{ borderColor: "var(--border)", background: "var(--muted)" }}
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1.5 block">Category</label>
                        <input
                            placeholder="e.g. Food, Transport, Health"
                            className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                            style={{ borderColor: "var(--border)", background: "var(--muted)" }}
                            value={form.category}
                            disabled={!!defaultCategory}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            required
                        />
                    </div>

                    {budgets.length > 0 && (
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1.5 block">
                                Link to Budget <span className="normal-case opacity-60">(optional)</span>
                            </label>
                            <select
                                className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                                style={{ borderColor: "var(--border)", background: "var(--muted)" }}
                                value={linkedBudget}
                                onChange={(e) => setLinkedBudget(e.target.value)}
                            >
                                <option value="">— No budget —</option>
                                {budgets.map(b => (
                                    <option key={b.id} value={b.id}>{b.name} (₹{b.amount})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={handleClose}
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
                            {loading ? "Saving..." : "Add Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
