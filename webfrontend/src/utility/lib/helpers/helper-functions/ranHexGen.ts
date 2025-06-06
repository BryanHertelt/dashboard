import { icongray } from "../helper-config/colors";
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

  export const ranHexGen = (tresholdValue: number): string[] => {
    const bottomHue = 200;
    const topHue = 220;
    const saturation = 100;
    const bottomLightness = 90;
    const topLightness = 34;
  
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
