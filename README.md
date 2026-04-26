💸 Expense Tracker

A full-stack expense tracking application designed to help you manage daily spending, categorize expenses, and monitor budgets through a simple and intuitive interface.

🚀 Features

🔐 Authentication: Secure login and user management using Clerk.

💰 Expense Management: Easily add, update, and delete your daily expenses.

📊 Categorization: Group expenses by category for better organization.

📈 Interactive Dashboard:

Visualized total spending.

Detailed category breakdowns.

Feed of recent transactions.

🧾 Budgeting System: Set limits and track your progress against them.

⚡ Real-time Updates: Instant UI feedback on data changes.

🧠 Smart UX: Hover actions, smooth modals, and responsive feedback.

🛠️ Tech Stack

Frontend: Next.js (App Router), React

Backend: Next.js API Routes

Database: Neon (PostgreSQL)

ORM: Drizzle ORM

Authentication: Clerk

Styling: Tailwind CSS

Deployment: Vercel

📂 Project Structure

app/
├── (routes)/
│   ├── dashboard/
│   ├── budgets/
│   └── expenses/
├── api/
│   ├── budgets/
│   └── expenses/
lib/
├── db.js
└── schema.js


⚙️ Environment Variables

Create a .env.local file in the root directory and add the following:

DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard


🧑‍💻 Installation & Setup

Clone the repository

git clone [https://github.com/Aayush-Everimit/Expense_Tracker.git](https://github.com/Aayush-Everimit/Expense_Tracker.git)
cd Expense_Tracker


Install dependencies

npm install


Run the development server

npm run dev


📊 Usage

Sign in using the Clerk authentication portal.

Create budgets for different spending categories (e.g., Food, Rent, Entertainment).

Add expenses specifically under those budgets.

View insights on the main dashboard to track your financial health.

🚀 Deployment

The app is optimized for deployment on Vercel.

Connect your GitHub repository to your Vercel account.

Add the environment variables listed above in the Vercel project settings.

Deploy!

🧠 Future Improvements

📅 Date-based filtering: Filter expenses by specific weeks, months, or custom ranges.

📉 Monthly analytics: Graphical representations of spending trends over time.

✏️ Enhanced Editing: Detailed edit functionality for existing records.

🧾 Exporting: Generate reports in CSV or PDF formats.

📱 Mobile UX: Further optimizations for small-screen devices.

📄 License

This project is for personal and educational use.

👨‍💻 Author

Aayush Gautam
