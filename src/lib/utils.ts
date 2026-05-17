import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number, unit?: string): string {
  const formatted = new Intl.NumberFormat("en-IN").format(n);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function getStockUrgency(
  current: number,
  min: number
): "critical" | "low" | "warning" {
  const ratio = current / min;
  if (ratio <= 0.25) return "critical";
  if (ratio <= 0.5) return "low";
  return "warning";
}
