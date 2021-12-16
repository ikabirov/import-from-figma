import { Color } from 'figma-js';
declare type ColorData = {
    name: string;
    color: Color;
    opacity: number;
};
declare function writeColors(colors: ColorData[], getCssRootSelector?: (theme: string) => string): Promise<void>;
export { writeColors };
