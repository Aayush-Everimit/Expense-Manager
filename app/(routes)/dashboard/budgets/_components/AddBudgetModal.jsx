"use client";

import { useState } from "react";
import { X, PiggyBank } from "lucide-react";

export default function AddBudgetModal({ open, setOpen, refresh }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !amount) return;
        setLoading(true);
        await fetch("/api/budgets", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim(), amount }),
        });
        setName("");
        setAmount("");
        setOpen(false);
        setLoading(false);
        refresh();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in"
             style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>

            <div className="bg-white rounded-2xl w-[380px] shadow-2xl animate-scale-in overflow-hidden">

                {/* Header */}
                <div className="p-6 pb-5 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                 style={{ background: "var(--accent)" }}>
                                <PiggyBank size={18} style={{ color: "var(--primary)" }} />
                            </div>
                            <h2 className="font-bold text-lg">New Budget</h2>
                        </div>
                        <button onClick={() => setOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                                style={{ background: "var(--muted)" }}>
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1.5 block">
                            Budget Name
                        </label>
                        <input
                            placeholder="e.g. Food, Entertainment, Rent"
                            className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                            style={{
                                borderColor: "var(--border)",
                                "--tw-ring-color": "var(--primary)",
                                background: "var(--muted)",
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1.5 block">
                            Budget Limit (₹)
                        </label>
                        <input
                            placeholder="0"
                            type="number"
                            min="1"
                            className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                            style={{
                                borderColor: "var(--border)",
                                "--tw-ring-color": "var(--primary)",
                                background: "var(--muted)",
                            }}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={() => setOpen(false)}
                                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors"
                                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                            style={{ background: "var(--primary)" }}
                        >
                            {loading ? "Creating..." : "Create Budget"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
