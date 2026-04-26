import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.svg";
import heroImg from "../../public/hero.svg";
import { Button } from "@/components/ui/button";

function Hero() {
    return (
        <section className="flex items-center justify-center py-20 px-5">

            {/* Container */}
            <div className="flex w-full max-w-6xl items-center">

                {/* LEFT CONTENT */}
                <div className="flex-1 flex flex-col justify-center">

                    <Image src={logo} alt="Logo" width={80} height={80} priority />

                    <h1 className="text-4xl md:text-5xl font-bold mt-6">
                        Take Control of Your Expenses
                    </h1>

                    <p className="text-gray-500 mt-4">
                        Track, manage, and optimize your spending effortlessly.
                    </p>

                    {/* CTA */}
                    <div className="mt-8">
                        <Button asChild>
                            <Link href="/sign-in">Get Started</Link>
                        </Button>
                    </div>

                </div>

                {/* RIGHT IMAGE */}
                <div className="flex-1 flex justify-end">
                    <Image
                        src={heroImg}
                        alt="Expense Tracker Preview"
                        width={450}
                        height={450}
                        className="object-contain"
                        priority
                    />
                </div>

            </div>
        </section>
    );
}

export default Hero;