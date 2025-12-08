export interface SpellMistake {
    blockId: string;
    mistakes: Array<{ word: string; position?: number }>;
}

export interface CorrectedMistake {
    blockId: string;
    mistakes: Array<{ word: string; position: number }>;
}

export interface GrammerCheckRequest {
    blockId: string;
    text: string;
}

export interface CorrectedGrammerMistake {
    blockId: string;
    correction: Array<{
        text: string
        wrongText: string
    }>
}
