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