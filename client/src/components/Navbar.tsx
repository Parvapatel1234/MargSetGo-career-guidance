"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="glass fixed w-full z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-24">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <div className="relative h-20 w-60">
                                <Image
                                    src="/logo.jpg"
                                    alt="MargSetGo Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-6">
                        <Link href="/auth/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                            Login
                        </Link>
                        <Link href="/auth/register" className="btn-primary">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-gray-100 absolute w-full">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <Link href="/auth/login" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition">
                            Login
                        </Link>
                        <Link href="/auth/register" className="block w-full text-center px-3 py-2 rounded-lg text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
