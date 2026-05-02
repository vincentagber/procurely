import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(valueInKobo: number, currency = "NGN") {
  const naira = valueInKobo / 100;
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(naira);
  return `₦${formatted}`;
}
