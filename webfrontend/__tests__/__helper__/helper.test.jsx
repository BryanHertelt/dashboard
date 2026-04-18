import { cn, formatCurrency, formatValue, isObject, formatDecimals, ranHexGen } from "../../src/utility/lib/helpers";

describe('cn (Classname Merger)', () => {
  it('merges static class names', () => {
    expect(cn('text-red-500', 'font-bold')).toBe('text-red-500 font-bold');
  });

  it('handles conditional logic and falsy values', () => {
    const isHidden = false;
    expect(cn('flex', isHidden && 'hidden', 'p-4')).toBe('flex p-4');
    expect(cn(null, undefined, '')).toBe('');
  });

  it('resolves Tailwind conflicts (tailwind-merge)', () => {
    // tailwind-merge should favor the last class in a conflict
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe("formatCurrency", () => {
  it('formats standard numbers to USD currency string', () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency("1000.1")).toBe("$1,000.10");
  });

  it("handles extreme decimals with subscript notation", () => {
    // Verifying "Subscript notation" for tiny numbers
    expect(formatCurrency(0.00000000000012)).toBe("$0.0₁₁ 1");
    expect(formatCurrency(0.0000003)).toBe("$0.0₅ 3");
  });

  it("returns fallback for invalid inputs", () => {
    expect(formatCurrency("invalid")).toBe("--");
    expect(formatCurrency(null)).toBe("--");
  });
});

describe("formatValue", () => {
  it('rounds to 2 decimal places by default', () => {
    expect(formatValue(1.2314)).toBe("1.23");
    expect(formatValue("1.236")).toBe("1.24");
  });

  it("abbreviates large numbers (M, B, T)", () => {
    expect(formatValue(8_570_000)).toBe("8.57 M");
    expect(formatValue(8_570_000_000)).toBe("8.57 B");
    expect(formatValue(8_570_000_000_000)).toBe("8.57 T");
  });

  it("handles malformed string numbers gracefully", () => {
    expect(formatValue("1,0,0")).toBe("--");
    expect(formatValue("A")).toBe("--");
  });
});

describe("isObject", () => {
  it("returns true for plain and constructed objects", () => {
    expect(isObject({})).toBe(true);
    expect(isObject(new Object())).toBe(true);
    class Test {}
    expect(isObject(new Test())).toBe(true);
  });

  it("returns false for non-object types (arrays, null, functions)", () => {
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject("string")).toBe(false);
  });
});

describe("formatDecimals", () => {
  it('converts exponential notation to subscript formatting', () => {
    // 1.23e-5 = 0.0000123. Leading zeros: 4. Subscript: 3 (zeros after first 0.)
    expect(formatDecimals(1.23e-5, 0.00001)).toBe("0.0₃ 12");
  });

  it('handles comma-separated strings as numbers', () => {
    expect(formatDecimals("0,0002", 0)).toBe("0.0₂ 2");
  });
});

describe("ranHexGen (Color Generator)", () => {
  it("generates a specific number of hex codes", () => {
    const count = 5;
    const colors = ranHexGen(count);
    expect(colors).toHaveLength(count);
    colors.forEach(color => expect(color).toMatch(/^#/));
  });

  it("returns an empty array for 0", () => {
    expect(ranHexGen(0)).toEqual([]);
  });

  it("returns a specific default for threshold 1", () => {
    expect(ranHexGen(1)).toEqual(["#C4DDFF"]);
  });
});