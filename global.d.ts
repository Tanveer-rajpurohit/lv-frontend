
declare module '@editorjs/editorjs' {
    export default class EditorJS {
        constructor(config: any);
        isReady: Promise<void>;
        save(): Promise<any>;
        clear(): Promise<void>;
        destroy(): void;
    }

    export interface OutputData {
        time?: number;
        blocks: Array<{
            id: string;
            type: string;
            data: any;
        }>;
        version?: string;
    }
}

declare module 'editorjs-undo' {
    export default class Undo {
        constructor(editor: EditorJS);
    }
}

