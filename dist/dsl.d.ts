import { Color, FileResponse, TypeStyle } from 'figma-js';
declare type Typography = Pick<TypeStyle, 'italic' | 'fontWeight' | 'fontSize' | 'lineHeightPx' | 'fontFamily' | 'fontPostScriptName'> & {
    name: string;
};
declare type ColorData = {
    name: string;
    color: Color;
    opacity: number;
};
declare type IconName = string;
declare type IconSVGContent = string;
declare type Icons = Record<IconName, IconSVGContent>;
declare function generateDSL(rawData: FileResponse, skipIcons?: boolean): Promise<{
    typography: Typography[] | undefined;
    colors: ColorData[] | undefined;
    icons: Icons | undefined;
}>;
export { generateDSL, Typography, ColorData, Icons };
