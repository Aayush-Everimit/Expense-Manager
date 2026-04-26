import { db } from "@/lib/db";
import { Budgets } from "@/lib/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function DELETE(req, { params }) {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await db
        .delete(Budgets)
        .where(and(eq(Budgets.id, Number(id)), eq(Budgets.userId, user.id)));

    return NextResponse.json({ success: true });
}
