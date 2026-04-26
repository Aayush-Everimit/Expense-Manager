"use client";

import { X, Trash2 } from "lucide-react";

export default function ExpenseDetailsModal({ open, setOpen, data, onDelete }) {
    if (!open || !data.length) return null;

    const total = data.reduce((sum, e) => sum + e.amount, 0);
    const category = data[0]?.category || "Uncategorized";

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in"
             style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>

            <div className="bg-white rounded-2xl w-[480px] max-h-[80vh] flex flex-col shadow-2xl animate-scale-in overflow-hidden">

                {/* Header */}
                <div className="p-6 pb-5 border-b flex items-center justify-between"
                     style={{ borderColor: "var(--border)" }}>
                    <div>
                        <h2 className="font-bold text-lg">{category}</h2>
                        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                            {data.length} entries · Total: <span className="font-bold text-foreground">₹{total.toLocaleString()}</span>
                        </p>
                    </div>
                    <button onClick={() => setOpen(false)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl"
                            style={{ background: "var(--muted)" }}>
                        <X size={16} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: "var(--border)" }}>
                    {data.map((e) => (
                        <div key={e.id} className="flex items-center justify-between px-6 py-4 group hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                     style={{ background: "var(--chart-1)" }}>
                                    {e.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{e.name}</p>
                                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                        {new Date(e.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric", month: "short", year: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold">₹{e.amount.toLocaleString()}</span>
                                <button
                                    onClick={() => {
                                        if (confirm(`Delete "${e.name}"?`)) onDelete(e.id);
                                    }}
                                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                >
                                    <Trash2 size={14} style={{ color: "oklch(0.577 0.245 27.325)" }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-5 border-t" style={{ borderColor: "var(--border)" }}>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
