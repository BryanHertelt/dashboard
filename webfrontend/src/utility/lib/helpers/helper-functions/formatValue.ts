import { formatDecimals } from "../../helpers";
/**
 * Use this function to return any value, which should have not more than tow digits.
 * @param number
 * @returns A value with a maximum of two digits.
 */
export const formatValue = (number: number): string | undefined => {
    if (isNaN(Number(number.toString().replace(",", ".")))) {
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