import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <SignIn
                appearance={{
                    elements: {
                        card: "shadow-xl rounded-2xl",
                        headerTitle: "text-2xl font-bold",
                        headerSubtitle: "text-gray-500",
                        socialButtonsBlockButton: "border border-gray-300",
                        formButtonPrimary:
                            "bg-black hover:bg-gray-800 text-white",
                    },
                }}
            />
        </div>
    );
}