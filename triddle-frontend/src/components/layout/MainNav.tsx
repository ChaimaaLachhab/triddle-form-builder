"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MainNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 flex items-center justify-between h-16">
                <Logo href="/" />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="/#features" className="text-gray-700 hover:text-primary transition-colors">
                        Features
                    </a>
                    <a href="/#pricing" className="text-gray-700 hover:text-primary transition-colors">
                        Pricing
                    </a>
                    <a href="/#contact" className="text-gray-700 hover:text-primary transition-colors">
                        Contact
                    </a>
                </nav>

                {/* Desktop Authentication */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/login" passHref legacyBehavior>
                        <Button 
                            variant="outline" 
                            className="border-transparent hover:text-black hover:border-primary hover:bg-transparent"
                        >
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup" passHref legacyBehavior>
                        <Button>Create Account</Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? (
                            <X className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                        <a
                            href="/#features"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Features
                        </a>
                        <a
                            href="/#pricing"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pricing
                        </a>
                        <a
                            href="/#contact"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </a>
                    </div>
                    <div className="px-5 py-4 border-t border-gray-200 bg-white">
                        <div className="flex flex-col space-y-3">
                            <Link
                                href="/login"
                                passHref
                                legacyBehavior
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Button 
                                    variant="outline" 
                                    className="justify-center w-full border-transparent hover:text-black hover:border-primary hover:bg-transparent"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link
                                href="/signup"
                                passHref
                                legacyBehavior
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Button className="justify-center w-full">Create Account</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}