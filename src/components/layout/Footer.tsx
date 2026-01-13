"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const Footer = () => {
    return (
        <footer className="bg-white border-t-2 border-border pt-12 md:pt-16 pb-6 md:pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Logo size="lg" className="mb-4" />
                        <p className="font-medium text-gray-600 mb-6">
                            Pick better strategies, make better decisions. Expert insights for affiliate marketing success.
                        </p>
                        <div className="flex gap-4">
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 border-2 border-border rounded-full hover:bg-primary transition-colors hard-shadow"
                                aria-label="Twitter"
                            >
                                <Twitter size={20} />
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 border-2 border-border rounded-full hover:bg-primary transition-colors hard-shadow"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                            <a 
                                href="https://linkedin.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 border-2 border-border rounded-full hover:bg-primary transition-colors hard-shadow"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold uppercase text-lg mb-6">Explore</h3>
                        <ul className="space-y-4">
                            <li><Link href="/#topics" className="font-medium hover:underline">Topics</Link></li>
                            <li><Link href="/#about" className="font-medium hover:underline">About</Link></li>
                            <li><Link href="/blog" className="font-medium hover:underline">All Articles</Link></li>
                            <li><Link href="/#contact" className="font-medium hover:underline">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold uppercase text-lg mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li><Link href="/#privacy" className="font-medium hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/#terms" className="font-medium hover:underline">Terms of Service</Link></li>
                            <li><Link href="/#cookies" className="font-medium hover:underline">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold uppercase text-lg mb-6">Subscribe</h3>
                        <p className="font-medium text-gray-600 mb-4">
                            Get the latest updates directly in your inbox.
                        </p>
                        <form 
                            className="flex flex-col sm:flex-row gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
                                if (email) {
                                    // In a real app, you'd send this to your newsletter API
                                    alert(`Thanks for subscribing! We'll send updates to ${email}`);
                                    form.reset();
                                }
                            }}
                        >
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                className="flex-1 h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary text-base"
                            />
                            <button 
                                type="submit"
                                className="h-12 w-full sm:w-12 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-gray-800 transition-colors rounded-[10px] touch-manipulation"
                                aria-label="Subscribe to newsletter"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t-2 border-border pt-8 text-center font-bold text-sm uppercase">
                    © {new Date().getFullYear()} PickBettr. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
