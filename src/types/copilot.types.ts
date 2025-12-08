import { OutputData } from "@editorjs/editorjs";

// ========== FACT CHECKER TYPES ==========

export interface FactCheckClaim {
    claim: string;
    verdict: string;
    source: string;
    source_type: string;
    checked_on: string;
    legal_authority_level: string;
    citation_provided: string;
    confidence_score?: number;
}

export interface FactCheckResponse {
    success?: boolean;
    data: {
        total_claims_extracted: number;
        verified_claims?: number;
        accuracy_score?: number;
        confidence_score?: number;
        claims_breakdown: {
            statute: number;
            legal_fact: number;
        };
        fact_checks?: FactCheckClaim[];
        unverifiable_claims?: string[];
        recommendations: string[];
        timestamp: string;
        confidence_data?: {
            overall_confidence?: number;
            accuracy_score?: number;
            verification_rate?: number;
            total_verified?: number;
        };
    };
}

export interface FactCheckRequest {
    blog_content: string;
    topic: string;
    format_style: number;
    validate_citations: boolean;
    include_bibliography: boolean;
    previous_word_count: number;
    enable_ethics_check: boolean;
    enable_compliance_check: boolean;
}

export interface FactCheckSummary {
    totalClaims: number;
    verifiedClaims: number;
    unverifiableClaims: number;
    accuracyScore: number;
    confidenceScore: number;
    recommendations: string[];
}

export interface ComplianceViolation {
    violation_id: string;
    sentence: string;
    violation_type: string;
    category: number;
    severity: string;
    severity_level: number;
    explanation: string;
    corrected_sentence: string;
    start_index: number;
    end_index: number;
    line_number: number;
    confidence_score: number;
    legal_references: string[];
}

export interface ComplianceCheckResponse {
    status: string;
    overall_score: number;
    detection_confidence?: string;
    total_violations?: number;
    metadata: {
        checked_at: string;
        document_type: string;
    },
    violations: Array<{
        violation_id: string;
        sentence: string;
        violation_type: string;
        severity: string;
        explanation?: string;
        corrected_sentence?: string;
        confidence_score?: number;
        legal_references?: string[];
    }>;
}

export interface ComplianceCheckRequest {
    text: string;
    request_id?: string;
    metadata?: {
        document_type?: string;
        jurisdiction?: string;
        document_id?: string;
    };
    check_types?: string[];
    min_severity?: number;
    detailed_analysis?: boolean;
}

// ========== ARGUMENT LOGIC TYPES ==========
export interface ArgumentLogicStatement {
    id: string;
    block_id: string;
    wrongStatement: string;
    correctedStatement: string;
}

export interface ArgumentLogicResponse {
    statements: ArgumentLogicStatement[];
    contradiction_score: number;
}

// ========== ENRICHED COPILOT TYPES ========== 
export interface Source {
    id: string;
    name: string;
    date: string;
    url: string;
}

export interface Fact {
    id: string;
    block_id: string;
    wrongStatement: string;
    correctedStatement: string;
}

export interface FactChecker {
    fact: Fact;
    confidence: number;
    verdict: string;
    sources: Source[];
}

export interface ComplianceStatement {
    id: string;
    block_id: string;
    wrongStatement: string;
}

export interface ViolatedPolicies {
    id: string;
    name: string;
    date: string;
    url: string;
}

export interface Compliance {
    statement: ComplianceStatement;
    confidence: number;
    verdict: string;
    policies: ViolatedPolicies[];
    justification: string;
}

export interface ArgumentLogic {
    statements: ArgumentLogicStatement[];
    contradiction_score: number;
}

// Backend types
export interface BackendArgumentLine {
    id: string;
    text: string;
    position?: number;
    start_char?: number;
    end_char?: number;
}

export interface BackendContradictionItem {
    line1: any;
    line2: any;
    contradiction_score?: number;
    confidence?: number;
    suggestions?: string[];
}

export interface BackendContradictionSet {
    set_id: string;
    lines: BackendArgumentLine[];
    score?: number;
    contradictions?: BackendContradictionItem[];
    timestamp?: string;
    verified?: boolean;
}

export interface BackendArgumentLogicResponse {
    success?: boolean;
    message?: string;
    lines_detected?: number;
    lines?: BackendArgumentLine[];
    contradiction_sets?: BackendContradictionSet[];
    analysis?: {
        total_lines_analyzed?: number;
        total_contradiction_sets?: number;
        highest_contradiction_score?: number;
        average_contradiction_score?: number;
        strong_contradictions?: number;
        moderate_contradictions?: number;
        mild_contradictions?: number;
        most_problematic_lines?: string[];
    };
    model_info?: {
        model_name?: string;
        provider?: string;
        version?: string;
        is_ready?: boolean;
    };
    processing_time_ms?: number;
    error?: any;
    metadata?: Record<string, any>;
}

// UPDATE THIS - Add optional factSummary
export interface CopilotResponse {
    projectId: string;
    Analysispercentage: number;

    fact: FactChecker | FactChecker[] | null;
    compliance: Compliance | Compliance[] | null;
    argumentLogic: ArgumentLogic | ArgumentLogic[] | null;

    factSummary?: FactCheckSummary;
    factScore?: number
    complianceScore?: number
    argumentScore?: number
}
