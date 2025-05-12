"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { ModeToggle } from "~/components/theme-toggle"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">11LabsClone</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-6">
          <a href="#features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </a>
          <a href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
            Demo
          </a>
          <a href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </a>
          <a href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
            FAQ
          </a>
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <ModeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/sign-in">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/app/sign-up">Try for Free</Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container mx-auto border-t px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#features"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#demo"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/app/sign-in">Log in</Link>
              </Button>
              <Button size="sm" className="w-full" asChild>
                <Link href="/app/sign-up">Try for Free</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
