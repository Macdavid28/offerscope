"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Failed to fetch companies", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
            Global Registry
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter italic">
          Companies <span className="text-primary">Directory.</span>
        </h1>
        <p className="text-muted-foreground font-medium max-w-2xl">
          Explore verified compensation intelligence for the world's leading
          organizations. Select a company to view detailed leveling and median
          data.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Filter by organization name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-white/5 h-16 pl-16 pr-6 rounded-[2rem] text-lg font-bold shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 rounded-[2rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Link
              key={company}
              href={`/company/${company.toLowerCase()}`}
              className="group bg-card border border-white/5 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:border-primary/20 hover:scale-[1.02] transition-all relative overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/5 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-white/5">
                    <Building2 className="h-7 w-7 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black capitalize tracking-tight group-hover:text-primary transition-colors">
                      {company}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      Details <ArrowRight className="h-2 w-2" />
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredCompanies.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-6 bg-muted/20 rounded-[3rem] border border-dashed border-white/10">
              <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto opacity-50">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black tracking-tight">
                  No Organizations Found
                </p>
                <p className="text-muted-foreground font-medium">
                  Be the first to contribute intelligence for this organization.
                </p>
              </div>
              <Button className="rounded-2xl h-14 px-10 font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                <Link href="/submit">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Contribute Now
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
