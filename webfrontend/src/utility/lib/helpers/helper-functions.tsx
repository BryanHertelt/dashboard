import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (number: number): string => {
  if (isNaN(Number(number))) {
    console.error("Type error in formatCurrency");
    return "--";
  }
  const formattedCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(number));
  return formattedCurrency;
};

export const formatValue = (number: number): string => {
  if (isNaN(Number(number))) {
    console.error("Type error in formatValue");
    return "--";
  }
  const formattedValue = Number(number).toFixed(2);

  return formattedValue;
};

export const isObject = (value: any) => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof RegExp) &&
    !(value instanceof Date) &&
    !(value instanceof Set) &&
    !(value instanceof Map)
  );
};
