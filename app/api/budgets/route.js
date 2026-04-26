import { db } from "@/lib/db";
import { Budgets } from "@/lib/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json([], { status: 200 });
    }

    const data = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.userId, user.id));

    return NextResponse.json(data);
}

export async function POST(req) {
    const user = await currentUser();

    console.log("POST USER:", user?.id);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await db.insert(Budgets).values({
        name: body.name,
        amount: Number(body.amount),
        userId: user.id, // 🔥 real user
    });

    return NextResponse.json({ success: true });
}