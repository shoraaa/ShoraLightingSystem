
export abstract class Color {
    static customColors: Array<number> = [];

    public static register(name: string, color: string): void {
        Color.customColors[name] = Color.toHex(color);
    }

    public static toHex(color: string): number {
        if (Color.customColors[color]) {
            return Color.customColors[color];
        }
        if (color.length == 6) {
            return parseInt(color, 16);
        }
        return parseInt(color.substr(1), 16);
    }

}
