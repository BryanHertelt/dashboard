import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The formatCurrency function formats a random number into en-US currency format.
 * @param number
 * @returns Currency value  based on US format rules.
 */
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

/**
 * Use this function to return any value, which should have not more than tow digits.
 * @param number
 * @returns A value with a maximum of two digits.
 */
export const formatValue = (number: number): string => {
  if (isNaN(Number(number))) {
    console.error("Type error in formatValue");
    return "--";
  }
  const formattedValue = Number(number).toFixed(2);

  return formattedValue;
};

/**
 * Use this for typechecking in data fetching components, which rely on a certain dataformat to work.
 * @param value The parameter could be any dataformat.
 * @returns Wether the argument is an object or not.
 */
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
