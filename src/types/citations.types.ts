import { OutputData as EditorOutputData } from "@editorjs/editorjs";

export interface CitationsDisplayData {
    id: string;
    wordCounts: number;
    data: Citation[];
}

export interface Citations {
    [key: string]: Citation[]; // Key could be blockId or section name
}

// Extend the metadata structure
export interface ProjectMetadata {
    data?: any; // Existing metadata
    citations?: Citations; // Add citations here
}

export interface Citation {
    id: string;
    source: string;
    title: string;
    author: string;
    link: string;
    position?: {
        start: number;
        end: number;
    };
}

export interface CitationsData {
    wordCounts: number;
    id: string;
    text: string;
}

export interface CitationDataRequest {
    blog_content: string;
    topic?: string;
    format_style?: number;
    validate_citations?: boolean;
    include_bibliography?: boolean;
    previous_word_count?: number;
    enable_ethics_check?: boolean;
    enable_compliance_check?: boolean;
}

export interface CitationSaveDataRequest {
    blockId: string;
    citationId: string;
    projectId: string;
}
