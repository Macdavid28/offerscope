import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    SGD: "S$",
    HKD: "HK$",
    CHF: "Fr.",
    AED: "د.إ",
    SAR: "ر.س",
    RUB: "₽",
  };
  return symbols[currency] || (currency?.length === 3 ? currency : "$");
}
