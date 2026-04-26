"use client";

import { useEffect, useState } from "react";
import AddExpenseModal from "./_components/AddExpenseModal";
import ExpenseCard from "./_components/ExpenseCard";
import ExpenseDetailsModal from "./_components/ExpenseDetailsModal";
import { Wallet } from "lucide-react";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchExpenses = async () => {
        const res = await fetch("/api/expenses", { credentials: "include" });
        const data = await res.json();
        setExpenses(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    const deleteCategory = async (category) => {
        const res = await fetch("/api/expenses/deleteByCategory", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category }),
        });
        if (res.ok) fetchExpenses();
    };

    const deleteExpense = async (id) => {
        await fetch(`/api/expenses/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        fetchExpenses();
        // close details modal if open
        if (selected) {
            setSelected(prev => prev ? prev.filter(e => e.id !== id) : null);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const grouped = expenses.reduce((acc, e) => {
        const key = e.category || "Uncategorized";
        acc[key] = acc[key] || [];
        acc[key].push(e);
        return acc;
    }, {});

    const categories = Object.keys(grouped);
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Expenses</h2>
                    <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {expenses.length} entries · ₹{totalSpent.toLocaleString()} total
                    </p>
                </div>
                <button
                    onClick={() => { setSelectedCategory(null); setOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "var(--primary)" }}
                >
                    <span className="text-base leading-none">+</span>
                    Add Expense
                </button>
            </div>

            {/* FILTER TABS */}
            {categories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setFilter("all")}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                        style={{
                            background: filter === "all" ? "var(--primary)" : "var(--muted)",
                            color: filter === "all" ? "white" : "var(--muted-foreground)",
                        }}
                    >
                        All ({expenses.length})
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                            style={{
                                background: filter === cat ? "var(--primary)" : "var(--muted)",
                                color: filter === cat ? "white" : "var(--muted-foreground)",
                            }}
                        >
                            {cat} ({grouped[cat].length})
                        </button>
                    ))}
                </div>
            )}

            {/* CARDS */}
            {loading ? (
                <div className="grid md:grid-cols-3 gap-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse h-36"
                             style={{ borderColor: "var(--border)" }} />
                    ))}
                </div>
            ) : Object.keys(grouped).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                    <Wallet size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="font-semibold">No expenses yet</p>
                    <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                        Start logging your spending to see insights
                    </p>
                    <button
                        onClick={() => setOpen(true)}
                        className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                        style={{ background: "var(--primary)" }}
                    >
                        + Add First Expense
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                    {Object.entries(grouped)
                        .filter(([cat]) => filter === "all" || cat === filter)
                        .map(([cat, items], i) => (
                            <ExpenseCard
                                key={cat}
                                category={cat}
                                items={items}
                                index={i}
                                onClick={() => setSelected(items)}
                                onAdd={(cat) => { setSelectedCategory(cat); setOpen(true); }}
                                onDelete={deleteCategory}
                            />
                        ))}
                </div>
            )}

            {/* MODALS */}
            <AddExpenseModal
                open={open}
                setOpen={setOpen}
                refresh={fetchExpenses}
                defaultCategory={selectedCategory}
            />

            <ExpenseDetailsModal
                open={!!selected}
                setOpen={() => setSelected(null)}
                data={selected || []}
                onDelete={deleteExpense}
            />
        </div>
    );
}
