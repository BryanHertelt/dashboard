import { clsx, type ClassValue } from "clsx";
import { format } from "path";
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

  let num = Number(number.toString().replace(",", "."));
  const roundedNumber = Number(num.toFixed(2));

  if (num > 0 && num < 1) {
    const formattedDecimals = formatDecimals(num, roundedNumber);
    return `$${formattedDecimals}`;
  }

  const formattedCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(num));
  return formattedCurrency;
};

/**
 * Use this function to return any value, which should have not more than tow digits.
 * @param number
 * @returns A value with a maximum of two digits.
 */
export const formatValue = (number: number): string | undefined => {
  if (isNaN(Number(number.toString().replace(",", ".")))) {
    console.error("Type error in formatValue");
    return "--";
  }

  const num = Number(number.toString().replace(",", "."));
  let roundedNumber = Number(num.toFixed(2));

  if (num > 0 && num < 1) {
    roundedNumber = Number(num.toFixed(4));
    const formattedDecimals = formatDecimals(num, roundedNumber);
    return formattedDecimals;
  }

  if (roundedNumber < 1000000) {
    return roundedNumber.toFixed(2);
  } else if (roundedNumber >= 1000000 && roundedNumber < 1000000000) {
    return `${(roundedNumber / 1000000).toFixed(2)} M`;
  } else if (roundedNumber >= 1000000000 && roundedNumber < 1000000000000) {
    return `${(roundedNumber / 1000000000).toFixed(2)} B`;
  } else if (roundedNumber >= 1000000000000) {
    return `${(roundedNumber / 1000000000000).toFixed(2)} T`;
  }
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

export const formatDecimals = (num: number, roundedNumber: number) => {
  if (
    Number(num.toString().replace(",", ".")) > 0 &&
    Number(num.toString().replace(",", ".")) < 1
  ) {
    let numStr = num.toString().replace(",", ".");
    if (numStr.indexOf("e") !== -1) {
      const exponent = parseInt(numStr.split("-")[1], 10);
      const result = num.toFixed(exponent);
      numStr = result;
    }
    const decimalPart = numStr.split(".")[1];
    let leadingZeros = (decimalPart.match(/^0+/)?.[0].length || 0) - 1;

    if (leadingZeros >= 2) {
      const trimmedDecimals = decimalPart.replace(/^0+/, "");
      const noTrailingZeros = trimmedDecimals.replace(/0+$/, "");
      const firstDigits = noTrailingZeros.slice(0, 2);

      const subscriptMap: any = {
        "0": "\u2080",
        "1": "\u2081",
        "2": "\u2082",
        "3": "\u2083",
        "4": "\u2084",
        "5": "\u2085",
        "6": "\u2086",
        "7": "\u2087",
        "8": "\u2088",
        "9": "\u2089",
      };

      const subscriptZeros = leadingZeros
        .toString()
        .split("")
        .map((digit) => subscriptMap[digit])
        .join("");

      return `0.0${subscriptZeros} ${firstDigits}`;
    }
  }
  return roundedNumber.toString();
};
