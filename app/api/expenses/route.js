import { db } from "@/lib/db";
import { Expenses } from "@/lib/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
    const user = await currentUser();
    if (!user) return NextResponse.json([]);

    const data = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.userId, user.id));

    return NextResponse.json(data);
}

export async function POST(req) {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    await db.insert(Expenses).values({
        name: body.name,
        amount: Number(body.amount),
        category: body.category,
        budgetId: body.budgetId ? Number(body.budgetId) : null,
        userId: user.id,
    });

    return NextResponse.json({ success: true });
}
