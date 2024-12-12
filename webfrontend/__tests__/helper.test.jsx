import {formatCurrency} from "../src/utility/lib/currencyformatter"

it('formatCurrency should return a formatted number',() => {
    const formattedvalue = formatCurrency(1000)
    expect(formattedvalue).toBe("$1,000.00")
}); 