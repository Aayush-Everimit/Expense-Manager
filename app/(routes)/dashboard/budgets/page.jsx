"use client";

import { useEffect, useState } from "react";
import AddBudgetModal from "./_components/AddBudgetModal";
import AddExpenseToBudgetModal from "./_components/AddExpenseToBudgetModal";
import BudgetCard from "./_components/BudgetCard";
import { PiggyBank } from "lucide-react";

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        const [bRes, eRes] = await Promise.all([
            fetch("/api/budgets", { credentials: "include" }),
            fetch("/api/expenses", { credentials: "include" }),
        ]);
        const [bData, eData] = await Promise.all([bRes.json(), eRes.json()]);
        setBudgets(Array.isArray(bData) ? bData : []);
        setExpenses(Array.isArray(eData) ? eData : []);
        setLoading(false);
    };

    const deleteBudget = async (id) => {
        if (!confirm("Delete this budget? Budget expenses won't be deleted.")) return;
        await fetch(`/api/budgets/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        fetchAll();
    };

    useEffect(() => { fetchAll(); }, []);

    // Enrich budgets with spending info
    const enriched = budgets.map(b => {
        const budgetExpenses = expenses.filter(e => e.budgetId === b.id);
        const spent = budgetExpenses.reduce((s, e) => s + e.amount, 0);
        const available = b.amount - spent;
        const pct = b.amount > 0 ? Math.min((spent / b.amount) * 100, 100) : 0;
        return { ...b, spent, available, pct, budgetExpenses };
    });

    const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0);
    const totalSpent = enriched.reduce((s, b) => s + b.spent, 0);

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Budgets</h2>
                    <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        Manage spending limits across categories
                    </p>
                </div>
                <button
                    onClick={() => setOpenAdd(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "var(--primary)" }}
                >
                    <span className="text-base leading-none">+</span>
                    New Budget
                </button>
            </div>

            {/* SUMMARY BANNER */}
            {budgets.length > 0 && (
                <div className="rounded-2xl p-5 flex items-center justify-between gap-4"
                     style={{ background: "var(--primary)", color: "white" }}>
                    <div>
                        <p className="text-sm opacity-70 font-medium">Total Budgeted</p>
                        <p className="text-2xl font-bold mt-0.5">₹{totalBudgeted.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm opacity-70 font-medium">Spent</p>
                        <p className="text-2xl font-bold mt-0.5">₹{totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-70 font-medium">Remaining</p>
                        <p className="text-2xl font-bold mt-0.5">₹{(totalBudgeted - totalSpent).toLocaleString()}</p>
                    </div>
                    <div className="hidden md:block text-right">
                        <PiggyBank size={48} className="opacity-20" />
                    </div>
                </div>
            )}

            {/* BUDGET CARDS */}
            {loading ? (
                <div className="grid md:grid-cols-3 gap-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse h-48"
                             style={{ borderColor: "var(--border)" }} />
                    ))}
                </div>
            ) : enriched.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                    <PiggyBank size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="font-semibold">No budgets yet</p>
                    <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                        Create a budget to start tracking your spending limits
                    </p>
                    <button
                        onClick={() => setOpenAdd(true)}
                        className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                        style={{ background: "var(--primary)" }}
                    >
                        + Create First Budget
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                    {enriched.map((b, i) => (
                        <BudgetCard
                            key={b.id}
                            budget={b}
                            index={i}
                            onAddExpense={() => setSelectedBudget(b)}
                            onDelete={() => deleteBudget(b.id)}
                        />
                    ))}
                </div>
            )}

            {/* MODALS */}
            <AddBudgetModal open={openAdd} setOpen={setOpenAdd} refresh={fetchAll} />
            <AddExpenseToBudgetModal
                budget={selectedBudget}
                setOpen={() => setSelectedBudget(null)}
                refresh={fetchAll}
            />
        </div>
    );
}
