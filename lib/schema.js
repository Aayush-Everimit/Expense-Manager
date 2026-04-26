import {
    pgTable,
    serial,
    varchar,
    integer,
    timestamp
} from "drizzle-orm/pg-core";


// 🧾 EXPENSES TABLE
export const Expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    amount: integer("amount").notNull(),

    category: varchar("category", { length: 255 }), // 👈 ADD THIS

    icon: varchar("icon", { length: 255 }),

    budgetId: integer("budget_id"), // 🔗 link to budget

    userId: varchar("user_id", { length: 255 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});


// 💰 BUDGETS TABLE
export const Budgets = pgTable("budgets", {
    id: serial("id").primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    amount: integer("amount").notNull(), // total budget

    icon: varchar("icon", { length: 255 }),

    userId: varchar("user_id", { length: 255 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});