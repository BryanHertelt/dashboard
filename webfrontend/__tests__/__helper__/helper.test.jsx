import { formatCurrency,formatValue, isObject, cn} from "../../src/utility/lib/helpers/helper-functions";
import { twMerge } from "tailwind-merge";
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
    it("formatCurrency returns an empty string, if value is neither string nor number", () => {
        const formattedCurrency = formatCurrency("1,00")
        expect(formattedCurrency).toBe("--")
    })
})

describe("isObject function", () => {
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
});
