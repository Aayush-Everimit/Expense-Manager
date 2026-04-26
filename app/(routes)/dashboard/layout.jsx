import SideNav from "@/app/(routes)/dashboard/_components/SideNav";
import DashboardHeader from "@/app/(routes)/dashboard/_components/DashboardHeader";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen">

            {/* SIDEBAR — desktop only */}
            <div className="hidden md:block w-64 shrink-0">
                <SideNav />
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />
                <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">
                    {children}
                </main>
            </div>

        </div>
    );
}