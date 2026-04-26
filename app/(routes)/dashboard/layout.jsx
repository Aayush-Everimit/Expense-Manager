import SideNav from "@/app/(routes)/dashboard/_components/SideNav";
import DashboardHeader from "@/app/(routes)/dashboard/_components/DashboardHeader";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen">

            {/* SIDEBAR */}
            <div className="hidden md:block w-64">
                <SideNav />
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <DashboardHeader />

                {/* CONTENT */}
                <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                    {children}
                </main>

            </div>
        </div>
    );
}