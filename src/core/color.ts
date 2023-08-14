import { defaultColors } from "./parameters";

export function stringToHex(color: string): number {
    if (color.length == 6) {
        return parseInt(this, 16);
    }
    return parseInt(color.substr(1), 16);
}

export function toHex(color: string): number {
    if (defaultColors[color]) {
        return defaultColors[color];
    }
   return stringToHex(color);
}