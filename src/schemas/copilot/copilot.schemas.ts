import { z } from "zod";

// Violation Schema
export const ViolationSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
        text: z.string(),
    }),
});

// Source Schema
export const SourceSchema = z.object({
    id: z.string(),
    name: z.string(),
    date: z.string(),
    url: z.string().url(),
});

// Fact Schema
export const FactSchema = z.object({
    id: z.string(),
    block_id: z.string(),
    wrongStatement: z.string(),
    correctedStatement: z.string(),
});

// FactChecker Schema
export const FactCheckerSchema = z.object({
    fact: FactSchema,
    confidence: z.number().min(0).max(100),
    verdict: z.string(),
    sources: z.array(SourceSchema),
});

// ComplianceStatement Schema
export const ComplianceStatementSchema = z.object({
    id: z.string(),
    block_id: z.string(),
    wrongStatement: z.string(),
});

// ViolatedPolicies Schema
export const ViolatedPoliciesSchema = z.object({
    id: z.string(),
    name: z.string(),
    date: z.string(),
    url: z.string().url(),
});

// Compliance Schema
export const ComplianceSchema = z.object({
    statement: ComplianceStatementSchema,
    confidence: z.number().min(0).max(100),
    verdict: z.string(),
    policies: z.array(ViolatedPoliciesSchema),
});

// ArgumentLogicStatement Schema
export const ArgumentLogicStatementSchema = z.object({
    id: z.string(),
    block_id: z.string(),
    wrongStatement: z.string(),
    correctedStatement: z.string(),
});

// ArgumentLogic Schema
export const ArgumentLogicSchema = z.object({
    statements: z.array(ArgumentLogicStatementSchema),
    contradiction_score: z.number().min(0).max(100),
});


export const CopilotRequestSchema = z.object({
    content: z.any(),
    projectId: z.string(),
});

// CopilotResponse Schema
export const CopilotResponseSchema = z.object({
    projectId: z.string(),
    Analysispercentage: z.number().min(0).max(100),
    fact: FactCheckerSchema,
    compliance: ComplianceSchema,
    argumentLogic: ArgumentLogicSchema,
});

// Type inference
export type ViolationSchemaType = z.infer<typeof ViolationSchema>;
export type SourceSchemaType = z.infer<typeof SourceSchema>;
export type FactSchemaType = z.infer<typeof FactSchema>;
export type FactCheckerSchemaType = z.infer<typeof FactCheckerSchema>;
export type ComplianceStatementSchemaType = z.infer<typeof ComplianceStatementSchema>;
export type ViolatedPoliciesSchemaType = z.infer<typeof ViolatedPoliciesSchema>;
export type ComplianceSchemaType = z.infer<typeof ComplianceSchema>;
export type ArgumentLogicStatementSchemaType = z.infer<typeof ArgumentLogicStatementSchema>;
export type ArgumentLogicSchemaType = z.infer<typeof ArgumentLogicSchema>;
export type CopilotRequestSchemaType = z.infer<typeof CopilotRequestSchema>;
export type CopilotResponseSchemaType = z.infer<typeof CopilotResponseSchema>;