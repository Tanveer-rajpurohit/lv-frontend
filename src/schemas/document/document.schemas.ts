import z from "zod";
import { StageStatus, UploadMethod, WebhookEventType, WebSocketMessageType } from "../../constants/document-upload";

export const apiErrorSchema = z.object({
    code: z.string(),
    message: z.string(),
    field: z.string().optional(),
    maxSize: z.number().optional(),
    stage: z.string().optional(),
    recoverable: z.boolean().optional(),
});

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        data: dataSchema.optional(),
        error: apiErrorSchema.optional(),
        message: z.string().optional(),
    });



// --- Document Upload Schemas ---
export const initUploadRequestSchema = z.object({
    projectId: z.string(),
    fileName: z.string(),
    fileSize: z.number(),
    fileType: z.string(),
    checksum: z.string().optional(),
});

export const initUploadDataSchema = z.object({
    documentId: z.string(),
    uploadUrl: z.string().optional(),
    uploadEndpoint: z.string().optional(),
    uploadMethod: z.enum([UploadMethod.S3_PRESIGNED, UploadMethod.DIRECT]),
    expiresAt: z.string().optional(),
    maxFileSize: z.number().optional(),
    sessionId: z.string(),
});

export const initUploadResponseSchema = apiResponseSchema(initUploadDataSchema);

export const uploadCompleteRequestSchema = z.object({
    sessionId: z.string(),
    s3Key: z.string().optional(),
    checksum: z.string().optional(),
});

export const uploadedDocumentDataSchema = z.object({
    documentId: z.string(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    status: z.string(),
    uploadedAt: z.string().optional(),
    processingQueued: z.boolean().optional(),
});

export const uploadCompleteResponseSchema = apiResponseSchema(uploadedDocumentDataSchema);

// --- Document Processing Schemas ---
export const processingStageDetailSchema = z.object({
    stage: z.string(),
    status: z.enum([
        StageStatus.PENDING,
        StageStatus.PROCESSING,
        StageStatus.COMPLETED,
        StageStatus.FAILED,
        StageStatus.CANCELLED,
    ]),
    progress: z.number().optional(),
    message: z.string().optional(),
    startedAt: z.string().optional(),
    completedAt: z.string().optional(),
});

export const currentProcessingStageSchema = z.object({
    stage: z.string(),
    progress: z.number(),
    message: z.string(),
    startedAt: z.string(),
});

export const documentStatusDataSchema = z.object({
    documentId: z.string(),
    fileName: z.string(),
    status: z.string(),
    processingStage: currentProcessingStageSchema.optional(),
    stages: z.array(processingStageDetailSchema),
});

export const documentStatusResponseSchema = apiResponseSchema(documentStatusDataSchema);

// --- WebSocket Schemas ---
export const wsSubscribeMessageSchema = z.object({
    action: z.literal('subscribe'),
    documentIds: z.array(z.string()),
});

export const wsUnsubscribeMessageSchema = z.object({
    action: z.literal('unsubscribe'),
    documentIds: z.array(z.string()),
});

export const wsProcessingUpdateDataSchema = z.object({
    documentId: z.string(),
    projectId: z.string(),
    status: z.string(),
    stage: z.string(),
    progress: z.number(),
    message: z.string(),
    timestamp: z.string(),
});

export const wsProcessingUpdateSchema = z.object({
    type: z.literal(WebSocketMessageType.PROCESSING_UPDATE),
    data: wsProcessingUpdateDataSchema,
});

export const extractedDataSchema = z.object({
    wordCount: z.number(),
    pageCount: z.number(),
    citationCount: z.number(),
    referenceCount: z.number(),
});

export const wsProcessingCompleteDataSchema = z.object({
    documentId: z.string(),
    projectId: z.string(),
    status: z.string(),
    extractedData: extractedDataSchema,
    completedAt: z.string(),
});

export const wsProcessingCompleteSchema = z.object({
    type: z.literal(WebSocketMessageType.PROCESSING_COMPLETE),
    data: wsProcessingCompleteDataSchema,
});

export const wsErrorDataSchema = z.object({
    documentId: z.string(),
    projectId: z.string(),
    status: z.string(),
    error: apiErrorSchema,
    timestamp: z.string(),
});

export const wsProcessingErrorSchema = z.object({
    type: z.literal(WebSocketMessageType.PROCESSING_ERROR),
    data: wsErrorDataSchema,
});

export const wsMessageSchema = z.discriminatedUnion('type', [
    wsProcessingUpdateSchema,
    wsProcessingCompleteSchema,
    wsProcessingErrorSchema,
]);

// --- Document Details Schemas ---
export const documentMetadataSchema = z.object({
    wordCount: z.number(),
    pageCount: z.number(),
    citationCount: z.number(),
    referenceCount: z.number(),
    author: z.string().optional(),
    createdDate: z.string().optional(),
});

export const documentContentStructureSchema = z.object({
    sections: z.array(z.any()),
    citations: z.array(z.any()),
    references: z.array(z.any()),
});

export const documentContentSchema = z.object({
    text: z.string(),
    structure: documentContentStructureSchema,
});

export const documentDetailsSchema = z.object({
    documentId: z.string(),
    projectId: z.string(),
    fileName: z.string(),
    originalName: z.string(),
    fileSize: z.number(),
    fileType: z.string(),
    status: z.string(),
    uploadedAt: z.string(),
    processedAt: z.string().optional(),
    metadata: documentMetadataSchema,
    content: documentContentSchema,
    s3Url: z.string(),
});

export const documentDetailsResponseSchema = apiResponseSchema(documentDetailsSchema);

// --- Cancel/Delete Schemas ---
export const cancelDocumentRequestSchema = z.object({
    reason: z.string().optional(),
});

export const cancelDocumentDataSchema = z.object({
    documentId: z.string(),
    status: z.string(),
    cancelledAt: z.string(),
});

export const cancelDocumentResponseSchema = apiResponseSchema(cancelDocumentDataSchema);

export const deleteDocumentDataSchema = z.object({
    documentId: z.string(),
    deleted: z.boolean(),
    deletedAt: z.string(),
});

export const deleteDocumentResponseSchema = apiResponseSchema(deleteDocumentDataSchema);

// --- Batch Status Schemas ---
export const batchDocumentSummarySchema = z.object({
    documentId: z.string(),
    fileName: z.string(),
    status: z.string(),
    progress: z.number(),
    currentStage: z.string().optional(),
});

export const batchStatusSummarySchema = z.object({
    uploading: z.number(),
    processing: z.number(),
    completed: z.number(),
    failed: z.number(),
});

export const batchStatusDataSchema = z.object({
    projectId: z.string(),
    total: z.number(),
    summary: batchStatusSummarySchema,
    documents: z.array(batchDocumentSummarySchema),
});

export const batchStatusResponseSchema = apiResponseSchema(batchStatusDataSchema);

// --- Retry Schemas ---
export const retryProcessingRequestSchema = z.object({
    fromStage: z.string().optional(),
});

export const retryProcessingDataSchema = z.object({
    documentId: z.string(),
    status: z.string(),
    retryAttempt: z.number(),
    queuedAt: z.string(),
});

export const retryProcessingResponseSchema = apiResponseSchema(retryProcessingDataSchema);

// --- Webhook Schemas ---
export const webhookPayloadSchema = z.object({
    event: z.enum([
        WebhookEventType.DOCUMENT_UPLOADED,
        WebhookEventType.DOCUMENT_PROCESSING_STARTED,
        WebhookEventType.DOCUMENT_PROCESSING_COMPLETED,
        WebhookEventType.DOCUMENT_PROCESSING_FAILED,
    ]),
    timestamp: z.string(),
    data: z.object({
        documentId: z.string(),
        projectId: z.string(),
        fileName: z.string(),
        status: z.string(),
    }),
});

// ============================================================================
// TYPESCRIPT INTERFACES (Inferred from Zod)
// ============================================================================

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: ApiError;
    message?: string;
};


// Upload Types
export type InitUploadRequest = z.infer<typeof initUploadRequestSchema>;
export type InitUploadData = z.infer<typeof initUploadDataSchema>;
export type InitUploadResponse = z.infer<typeof initUploadResponseSchema>;
export type UploadCompleteRequest = z.infer<typeof uploadCompleteRequestSchema>;
export type UploadedDocumentData = z.infer<typeof uploadedDocumentDataSchema>;
export type UploadCompleteResponse = z.infer<typeof uploadCompleteResponseSchema>;

// Processing Types
export type ProcessingStageDetail = z.infer<typeof processingStageDetailSchema>;
export type CurrentProcessingStage = z.infer<typeof currentProcessingStageSchema>;
export type DocumentStatusData = z.infer<typeof documentStatusDataSchema>;
export type DocumentStatusResponse = z.infer<typeof documentStatusResponseSchema>;

// WebSocket Types
export type WsSubscribeMessage = z.infer<typeof wsSubscribeMessageSchema>;
export type WsUnsubscribeMessage = z.infer<typeof wsUnsubscribeMessageSchema>;
export type WsProcessingUpdateData = z.infer<typeof wsProcessingUpdateDataSchema>;
export type WsProcessingUpdate = z.infer<typeof wsProcessingUpdateSchema>;
export type ExtractedData = z.infer<typeof extractedDataSchema>;
export type WsProcessingCompleteData = z.infer<typeof wsProcessingCompleteDataSchema>;
export type WsProcessingComplete = z.infer<typeof wsProcessingCompleteSchema>;
export type WsErrorData = z.infer<typeof wsErrorDataSchema>;
export type WsProcessingError = z.infer<typeof wsProcessingErrorSchema>;
export type WsMessage = z.infer<typeof wsMessageSchema>;

// Document Types
export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;
export type DocumentContentStructure = z.infer<typeof documentContentStructureSchema>;
export type DocumentContent = z.infer<typeof documentContentSchema>;
export type DocumentDetails = z.infer<typeof documentDetailsSchema>;
export type DocumentDetailsResponse = z.infer<typeof documentDetailsResponseSchema>;

// Cancel/Delete Types
export type CancelDocumentRequest = z.infer<typeof cancelDocumentRequestSchema>;
export type CancelDocumentData = z.infer<typeof cancelDocumentDataSchema>;
export type CancelDocumentResponse = z.infer<typeof cancelDocumentResponseSchema>;
export type DeleteDocumentData = z.infer<typeof deleteDocumentDataSchema>;
export type DeleteDocumentResponse = z.infer<typeof deleteDocumentResponseSchema>;

// Batch Types
export type BatchDocumentSummary = z.infer<typeof batchDocumentSummarySchema>;
export type BatchStatusSummary = z.infer<typeof batchStatusSummarySchema>;
export type BatchStatusData = z.infer<typeof batchStatusDataSchema>;
export type BatchStatusResponse = z.infer<typeof batchStatusResponseSchema>;

// Retry Types
export type RetryProcessingRequest = z.infer<typeof retryProcessingRequestSchema>;
export type RetryProcessingData = z.infer<typeof retryProcessingDataSchema>;
export type RetryProcessingResponse = z.infer<typeof retryProcessingResponseSchema>;

// Webhook Types
export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;