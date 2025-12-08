import { CorrectedGrammerMistake, CorrectedMistake } from "./spellcheck.types";
import EditorJS, { OutputData } from '@editorjs/editorjs';

export interface EditorStats {
    wordCount: number;
    charCount: number;
    readingTime: number;
}

export interface EditorSaveState {
    isSaving: boolean;
    lastSaved: Date | null;
    error: string | null;
}

export interface EditorProps {
    projectId: string;
    initialData?: any;
    onSave?: (data: any) => Promise<void>;
    readOnly?: boolean;
    placeholder?: string;
    autofocus?: boolean;
    minHeight?: number;
}

export interface EditorInstance {
    save: () => Promise<OutputData>;
    clear: () => Promise<void>;
    render: (data: OutputData) => Promise<void>;
    destroy: () => Promise<void>;
}

export interface UseEditorReturn {
    editorRef: React.RefObject<HTMLDivElement | null>;
    isReady: boolean;
    saveState: EditorSaveState;
    handleSave: () => Promise<void>;
    handleClear: () => Promise<void>;
    correctedMistakes: CorrectedMistake[];
    correctedGrammerMistakes: CorrectedGrammerMistake[];
    stats: EditorStats;
    onStatsChange?: (stats: EditorStats) => void;
    editorInstance: React.RefObject<EditorJS | null>;
    getContent: () => Promise<any>
    editorApi: React.RefObject<any | null>;
}

export interface SelectedContext {
    text: string;
    blockId: string;
    blockIndex: number;
    blockType?: string;
}

export interface BlockMutationEvent {
    target: any;
    type: 'block-added' | 'block-removed' | 'block-changed' | 'block-moved';
    detail: {
        index: number;
        target?: {
            id: string;
        };
    };
}
