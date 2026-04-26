import { db } from "@/lib/db";
import { Expenses } from "@/lib/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" });

    const { category } = await req.json();

    await db.delete(Expenses).where(
        and(
            eq(Expenses.userId, user.id),
            eq(Expenses.category, category)
        )
    );

    return NextResponse.json({ success: true });
}