"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Topics", href: "/#topics" },
        { name: "Blog", href: "/blog" },
        { name: "About", href: "/#about" },
        { name: "Contact", href: "/#contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-border">
            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                {/* Logo - single instance */}
                <div className="flex items-center">
                    <Logo size="md" />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm lg:text-base font-bold uppercase hover:text-primary transition-colors"
                            scroll={link.href.startsWith('/#')}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/blog">
                        <Button size="sm" variant="primary" sharp="br">
                            Read Articles
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 -mr-2 touch-manipulation"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-white border-b-2 border-border absolute w-full left-0 top-16 flex flex-col p-4 gap-3 shadow-xl z-50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-base font-bold uppercase hover:text-primary py-2 px-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors touch-manipulation"
                            onClick={() => setIsOpen(false)}
                            scroll={link.href.startsWith('/#')}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/blog" className="w-full mt-2" onClick={() => setIsOpen(false)}>
                        <Button className="w-full" variant="primary" sharp="br">
                            Read Articles
                        </Button>
                    </Link>
                </div>
            )}
        </header>
    );
};
