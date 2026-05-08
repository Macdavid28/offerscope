"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/submit", label: "Submit Data" },
  { href: "/compare", label: "Compare" },
];

export const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-all hover:text-primary",
              pathname === link.href ? "text-primary underline underline-offset-8 decoration-2" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden rounded-xl bg-muted/50" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-[65px] z-50 bg-background/95 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-right-full duration-300">
          <nav className="flex flex-col p-8 space-y-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-3xl font-black tracking-tighter transition-colors",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Compensation Intelligence v1.0</p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
