import React from 'react';
import Image from "next/image";
import logo from "../../public/logo.svg"
import {Button} from "@/components/ui/button";
import Link from "next/link";
function Header() {
    return (
        <div className="p-5 flex justify-between items-center border shadow-md">
            <Image src={logo} alt="Logo"/>

            <Button asChild>
                <Link href="/sign-in">Get Started</Link>
            </Button>

        </div>
    )
}

export default Header;