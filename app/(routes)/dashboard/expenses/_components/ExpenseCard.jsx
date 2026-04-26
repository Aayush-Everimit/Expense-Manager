"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const COLORS = [
    "oklch(0.65 0.22 265)",
    "oklch(0.62 0.18 160)",
    "oklch(0.7 0.2 55)",
    "oklch(0.65 0.22 330)",
    "oklch(0.68 0.18 200)",
    "oklch(0.68 0.2 20)",
];

export default function ExpenseCard({ category, items, index, onClick, onAdd, onDelete }) {
    const [showActions, setShowActions] = useState(false);
    const total = items.reduce((sum, e) => sum + e.amount, 0);
    const color = COLORS[index % COLORS.length];

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm(`Delete all expenses in "${category}"?`)) {
            onDelete(category);
        }
    };

    return (
        <div
            className="bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg animate-fade-in-up group"
            style={{ borderColor: "var(--border)", animationDelay: `${index * 60}ms` }}
            onClick={onClick}
        >
            {/* Top color bar */}
            <div className="h-1" style={{ background: color }} />

            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                             style={{ background: color }}>
                            {category[0].toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold">{category}</h3>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                {items.length} entr{items.length !== 1 ? "ies" : "y"}
                            </p>
                        </div>
                    </div>
                    <p className="text-lg font-bold">₹{total.toLocaleString()}</p>
                </div>

                {/* Mini expense list preview */}
                <div className="space-y-1.5 mb-4">
                    {items.slice(0, 2).map(e => (
                        <div key={e.id} className="flex justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
                            <span className="truncate">{e.name}</span>
                            <span className="font-medium ml-2">₹{e.amount.toLocaleString()}</span>
                        </div>
                    ))}
                    {items.length > 2 && (
                        <p className="text-xs" style={{ color: color }}>
                            +{items.length - 2} more
                        </p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(category); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                        style={{ background: color + "22", color: color }}
                    >
                        <Plus size={13} /> Add
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-red-50"
                        style={{ background: "var(--muted)", color: "oklch(0.577 0.245 27.325)" }}
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
}
