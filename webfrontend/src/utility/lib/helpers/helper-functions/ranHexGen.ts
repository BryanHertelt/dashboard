/**
 * `HSLToHex` converts a color value from HSL (Hue, Saturation, Lightness)
 * format into a hexadecimal color string.
 *
 * The HSLToHex is called by the ranHexGen (random Hex Generator) for the DistributionComponent. 
 * ### Parameters
 * @param h - Hue value (0–360), representing the color type on the color wheel.
 * @param s - Saturation percentage (0–100), representing the intensity of the color.
 * @param l - Lightness percentage (0–100), representing the brightness of the color.
 *
 * ### Behavior
 * - Uses the HSL-to-RGB conversion formula to compute red, green, and blue components.
 * - Normalizes saturation and lightness into 0–1 ranges for calculation.
 * - Computes intermediate RGB values by applying chroma transformations.
 * - Converts RGB values to hexadecimal format.
 *
 * @returns A hexadecimal color string (e.g., `#AABBCC`) representing the HSL input.
 */
const HSLToHex = (h:number, s:number, l:number) => {
    s /= 100;
    l /= 100;
    const k = (n:number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n:number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const rgb = [Math.round(255 * f(0)), Math.round(255 * f(8)),Math.round(255 * f(4))];
    const hex =  "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    return hex
  };


  /**
 * `ranHexGen` generates an array of hexadecimal color strings based on a given threshold value.
 * It linearly interpolates hues and lightness values across a specified range to create
 * visually distinct but related colors for use in charts or visual groupings.
 * The ranHexGen is used in DistributionComponent. 
 *
 * ### Parameters
 * @param tresholdValue - The number of distinct colors to generate.
 *   - If `0`, returns an empty array.
 *   - If `1`, returns a predefined light blue color (`#C4DDFF`).
 *
 * ### Color Range
 * - Hue: from 200 (light blue) to 220 (slightly darker blue).
 * - Saturation: fixed at 100%.
 * - Lightness: interpolated from 90% (lightest) to 34% (darkest).
 *
 * ### Behavior
 * - When `tresholdValue > 1`, the function creates `tresholdValue` colors by linearly interpolating
 *   between the hue and lightness boundaries, while keeping saturation fixed.
 * - Each HSL combination is converted to hex using the `HSLToHex` utility.
 *
 * @returns An array of hex color strings (e.g., `["#C4DDFF", "#3399FF", ...]`) with length equal to `tresholdValue`.
 */
  export const ranHexGen = (tresholdValue: number): string[] => {
    const bottomHue = 220;
    const topHue = 200;
    const saturation = 100;
    const bottomLightness = 34;
    const topLightness = 90;
  
    if (tresholdValue  == 1) return ["#C4DDFF"];
    if(tresholdValue == 0) return [];

    const colors: string[] = [];
  
    for (let i = 0; i < tresholdValue; i++) {
      const t = i / (tresholdValue - 1); 
      const h = bottomHue + (topHue - bottomHue) * t;
      const l = bottomLightness + (topLightness - bottomLightness) * t;
      colors.push(HSLToHex(h, saturation, l));
    }
  
    return colors;
  };
