import {formatDecimals} from "../../helpers"
/**
 * The formatCurrency function formats a random number into en-US currency format.
 * @param number
 * @returns Currency value  based on US format rules.
 */
export const formatCurrency = (number: number | null): string => {
    if (isNaN(Number(number)) || number === null) {
      return "--";
    }
  
    const num = Number(number?.toString().replace(",", "."));
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