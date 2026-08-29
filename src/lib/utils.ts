import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "Data not officially published";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatLpa(lpa: number | null | undefined): string {
  if (lpa === null || lpa === undefined) {
    return "Not published";
  }
  return `₹${lpa.toFixed(2)} LPA`;
}
