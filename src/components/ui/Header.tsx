import { shadow } from "@/styles/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./button";
import DarkModeToggle from "./DarkModeToggle";

function Header() {
const user = null;

  return (
    <header className="relative flex h-24 w-full items-center justify-between bg-popover px-3 sm:px-8"
    style={{boxShadow: shadow}}
    >
        <Link className="flex items-end gap-2" href='/'>
            <Image src="/smart-docs.png" 
                height={60} 
                width={60} 
                alt="logo" 
                className="rounded-full" 
                priority 
            />
            <h1 className="flex flex-col pb-1 text-2xl font-semibold leading-6">Smart <span>Docs</span></h1>
        </Link>
        <div className="flex gap-4">
            {user ? (
                "Logout"
            ) : 
            (
                <>
                <Button asChild className="hidden sm:block">
                    <Link href="/sign-up" >Cadastre-se</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                </Button>
                </>
            )}
            <DarkModeToggle />
        </div>
    </header>
  )
}

export default Header