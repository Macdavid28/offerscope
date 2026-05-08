import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-10 text-center">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
          Unmask Your <span className="text-primary italic">True Worth.</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Real-time compensation intelligence for the modern workforce. 
          Compare offers, track market trends, and negotiate with confidence.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link 
          href="/dashboard" 
          className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg font-bold rounded-full shadow-xl shadow-primary/20")}
        >
          Explore Dashboard
        </Link>
        <Link 
          href="/submit" 
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-lg font-bold rounded-full border-2")}
        >
          Submit Your Data
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl pt-10">
        {[
          { title: "Real Data", desc: "Sourced directly from tech professionals globally." },
          { title: "Smart Filters", desc: "Filter by role, level, location and specific companies." },
          { title: "Comparison Engine", desc: "Side-by-side analysis of total compensation packages." }
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
