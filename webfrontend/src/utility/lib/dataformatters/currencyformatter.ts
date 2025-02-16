export const formatCurrency = (number: number):string => {
const formattedCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
return formattedCurrency 
};