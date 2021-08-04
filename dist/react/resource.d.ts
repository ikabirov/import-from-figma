import { Config } from '../config';
declare function initializeReactResource(config: Config): void;
declare function saveColorTheme(name: string, content: string): void;
declare function saveFontsCss(content: string): void;
declare function saveIconSvg(path: string, content: string): void;
declare function saveIconComponent(name: string, content: string): void;
declare function saveIconsIndex(): void;
export { initializeReactResource, saveColorTheme, saveFontsCss, saveIconComponent, saveIconSvg, saveIconsIndex, };
