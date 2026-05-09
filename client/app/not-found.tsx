"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Search, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative h-32 w-32 rounded-3xl bg-card border shadow-2xl flex items-center justify-center">
          <Ghost className="h-16 w-16 text-primary animate-bounce" />
        </div>
        <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-zinc-900 border-4 border-background flex items-center justify-center font-black text-white text-xs">
          404
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-black tracking-tighter italic">
          Page <span className="text-primary">Not Found.</span>
        </h1>
        <p className="text-muted-foreground font-medium leading-relaxed">
          The page you're looking for either doesn't exist or has
          been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button className="rounded-2xl h-14 px-8 font-bold gap-2 shadow-xl shadow-primary/20">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Explore Dashboard
          </Link>
        </Button>
        <Button
          variant="outline"
          className="rounded-2xl h-14 px-8 font-bold gap-2"
        >
          <Link href="/" className="flex items-center gap-2">
            <MoveLeft className="h-4 w-4" />
            Back Home
          </Link>
        </Button>
      </div>

      <div className="mt-20 opacity-20 grayscale pointer-events-none select-none">
        <p className="font-mono text-[10px] uppercase tracking-[0.5em]">
          System Error: Page_Not_Located // Error_Code: 0x404
        </p>
      </div>
    </div>
  );
}
