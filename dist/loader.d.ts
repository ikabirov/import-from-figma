import { Config } from './config';
declare function initializeLoader(config: Config): void;
declare function loadRoot(): import("axios").AxiosPromise<import("figma-js").FileResponse>;
declare function loadNodes(ids: string[]): Promise<({
    readonly document: import("figma-js").Node;
    readonly components: {
        readonly [key: string]: import("figma-js").ComponentMetadata;
    };
    readonly styles: {
        readonly [key: string]: import("figma-js").Style;
    };
    readonly schemaVersion: number;
} | null)[]>;
declare function loadNode(nodeId: string): Promise<{
    readonly document: import("figma-js").Node;
    readonly components: {
        readonly [key: string]: import("figma-js").ComponentMetadata;
    };
    readonly styles: {
        readonly [key: string]: import("figma-js").Style;
    };
    readonly schemaVersion: number;
} | null>;
declare function loadSvgUrls(ids: string[]): Promise<Record<string, string>>;
export { initializeLoader, loadRoot, loadNode, loadNodes, loadSvgUrls };
