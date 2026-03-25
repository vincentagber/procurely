import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, currency = "NGN") {
  if (currency === "NGN") {
    const formatted = new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // Keep consistent with original behavior for NGN
    }).format(value);
    return `₦ ${formatted}`;
  }

  // Fallback for other currencies
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0, // Keep consistent with original behavior
  }).format(value).replace("$", "$ ");
}
