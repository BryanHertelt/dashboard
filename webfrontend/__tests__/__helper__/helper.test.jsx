import { formatCurrency,formatValue, isObject, cn} from "../../src/utility/lib/helpers/helper-functions";
import { twMerge } from "tailwind-merge";
import { formatDecimals } from "../../src/utility/lib/helpers/helper-functions";
import clsx from "clsx";

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('text-red-500', 'font-bold')).toBe('text-red-500 font-bold');
  });

  it('should handle conditional class names', () => {
    expect(cn('text-red-500', false && 'hidden', 'font-bold')).toBe('text-red-500 font-bold');
  });

  it('should merge conflicting Tailwind classes correctly', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should ignore falsy values', () => {
    expect(cn(null, undefined, '', 'text-green-500')).toBe('text-green-500');
  });
});

describe("tests for helper: formatCurrency", () => {
    it('formatCurrency should return a formatted number',() => {
        const formattedCurrency = formatCurrency(1000)
        expect(formattedCurrency).toBe("$1,000.00")
    }); 
    it("correctly formats small decimals", ()=> {
      const smallDecimal = formatCurrency(0.00000000000012) 
      expect(smallDecimal).toBe("$0.0₁₁ 1")
      const singleDigitDecimal = formatCurrency(0.0000003) 
      expect(singleDigitDecimal).toBe("$0.0₅ 3")
      const oneZeroDecimal = formatCurrency(0.03)
      expect(oneZeroDecimal).toBe("$0.03")
})
    it("formatCurrency handles strings gracefully", () => {
        const formattedCurrency = formatCurrency("1000.1")
        expect(formattedCurrency).toBe("$1,000.10")
    }) 
    it("formatCurrency returns an empty string, if value is neither string nor number", () => {
        const formattedCurrency = formatCurrency("1,00")
        expect(formattedCurrency).toBe("--")
    })
})

describe("tests for helper: formatValue", () => {
    it('formatValue should return max 2 decimals', ()=> {
        const formattedValue = formatValue(1.2314)
        expect(formattedValue).toBe("1.23")
    } ) 
    it('formatValue handels strings gracefully', ()=> {
        const formattedString = formatValue("1.236")
        expect(formattedString).toBe("1.24")
    })
    it("formatCurrency handles edge cases", () => {
        const multipleCommas = formatValue("1,0,0")
        expect(multipleCommas).toBe("--")

        const letter = formatValue("A")
        expect(letter).toBe("--")

        const object = formatValue({"1,0": "1"})
        expect(object).toBe("--")

        const round = formatValue("999999.999")
        expect(round).toBe("1.00 M")

        const comma = formatValue("999999,942")
        expect(comma).toBe("999999.94")


    })
    it("correctly formats higher numbers", () => {
      const underMillion = formatValue("999999.1235")
      expect(underMillion).toBe("999999.12")
      const million = formatValue(8569959.989)
      expect(million).toBe("8.57 M")
      const billion = formatValue(8569999959.989)
      expect(billion).toBe("8.57 B")
      const trillion = formatValue(8569999959900.989)
      expect(trillion).toBe("8.57 T")
      const overTrillion = formatValue(8569999959900000000.989)
      expect(overTrillion).toBe("8569999.96 T")
    })

    it("correctly formats small decimals", ()=> {
      const smallDecimal = formatValue(0.00000000000012) 
      expect(smallDecimal).toBe("0.0₁₁ 1")
      const singleDigitDecimal = formatValue(0.0000003) 
      expect(singleDigitDecimal).toBe("0.0₅ 3")
      const oneZeroDecimal = formatValue(0.03)
      expect(oneZeroDecimal).toBe("0.03")
})

describe("test for helper: isObject", () => {
  test("should return true for plain objects", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: "value" })).toBe(true);
    expect(isObject(Object.create(null))).toBe(true); 
  });

  test("should return false for null", () => {
    expect(isObject(null)).toBe(false);
  });

  test("should return false for arrays", () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
    expect(isObject(new Array(5))).toBe(false);
  });

  test("should return false for regular expressions", () => {
    expect(isObject(/abc/)).toBe(false);
    expect(isObject(new RegExp("abc"))).toBe(false);
  });

  test("should return false for Date objects", () => {
    expect(isObject(new Date())).toBe(false);
  });

  test("should return false for Set objects", () => {
    expect(isObject(new Set())).toBe(false);
    expect(isObject(new Set([1, 2, 3]))).toBe(false);
  });

  test("should return false for Map objects", () => {
    expect(isObject(new Map())).toBe(false);
    expect(isObject(new Map([[1, "one"]]))).toBe(false);
  });

  test("should return false for primitive values", () => {
    expect(isObject(42)).toBe(false);
    expect(isObject("hello")).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(Symbol("symbol"))).toBe(false);
    expect(isObject(BigInt(1234))).toBe(false);
  });

  test("should return false for functions", () => {
    expect(isObject(function () {})).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(class {})).toBe(false);
  });

  test("should return true for objects with constructors", () => {
    class MyClass {}
    expect(isObject(new MyClass())).toBe(true);
  });

  test("should return true for objects created with Object()", () => {
    expect(isObject(Object())).toBe(true);
    expect(isObject(new Object())).toBe(true);
  });
})}) 

describe("test for helper: formatDecimals", () => {
  it('returns formatted string with subscript when number is in exponential notation (e.g. 1.23e-5)', () => {
    const num = 1.23e-5;
    const roundedNumber = 0.00001;
    expect(formatDecimals(num, roundedNumber)).toBe("0.0₃ 12");
  });
  it('returns roundedNumber string when there are fewer than 3 leading zeros after decimal', () => {
    const num = 0.00123;
    const roundedNumber = 0.001;
    expect(formatDecimals(num, roundedNumber)).toBe('0.001');
  });
  it('handles case with exactly 2 leading zeros - should NOT use subscript', () => {
    const num = 0.001234;
    const roundedNumber = 0.001;
    expect(formatDecimals(num, roundedNumber)).toBe('0.001');
  });
  it('handles number with no leading zeros in decimal part', () => {
    const num = 0.12;
    const roundedNumber = 0.12;
    expect(formatDecimals(num, roundedNumber)).toBe('0.12');
  });
  it('handles number that becomes exponential like 1e-8 and uses correct formatting', () => {
    const num = 1e-8;
    const roundedNumber = 0;
    expect(formatDecimals(num, roundedNumber)).toBe('0.0₆ 1');
  });
  it('handles trailing zeros after leading zeros (e.g. 0.0000100)', () => {
    const num = 0.0000100;
    const roundedNumber = 0.00001;
    expect(formatDecimals(num, roundedNumber)).toBe("0.0₃ 1");
  });
  it('handles number with long chain of zeros before and after digits (e.g. 0.0000045000)', () => {
    const num = 0.0000045000;
    const roundedNumber = 0.0000045;
    expect(formatDecimals(num, roundedNumber)).toBe("0.0₄ 45");
  });
  it('handles case where decimal part is empty (e.g. integer)', () => {
    const num = 1;
    const roundedNumber = 1;
    expect(formatDecimals(num, roundedNumber)).toBe('1');
  });
  it("handles , notation", () => {
    const num = "0,0002"
    const roundedNumber = 0 
    expect(formatDecimals(num, roundedNumber)).toBe("0.0₂ 2")
  })
})
