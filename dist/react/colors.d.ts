import { Color } from 'figma-js';
declare type ColorData = {
    name: string;
    color: Color;
    opacity: number;
};
declare function writeColors(colors: ColorData[]): Promise<void>;
export { writeColors };
