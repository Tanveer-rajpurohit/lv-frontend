import { z } from 'zod';

// Document status enum
export const DocumentStatusSchema = z.enum(['pending', 'uploading', 'completed', 'failed']);

// Document schema - file_size is a string from API
export const DocumentSchema = z.object({
    id: z.string(),
    file_name: z.string(),
    file_size: z.string(), // Changed from z.number() to z.string()
    file_type: z.string(),
    status: DocumentStatusSchema,
    s3_key: z.string().optional(),
    checksum: z.string().optional(),
    created_at: z.string(),
    uploaded_at: z.string().optional(),
    metadata: z.any().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
    page: z.number(),
    page_size: z.number(),
    total: z.number(),
});

// DocumentsData schema - adjusted to match actual API response structure
export const DocumentsDataSchema = z.object({
    documents: z.array(DocumentSchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
});

// DocumentQueryParams schema
export const DocumentQueryParamsSchema = z.object({
    page: z.number().optional(),
    page_size: z.number().optional(),
    status: DocumentStatusSchema.optional(),
});

// InitUploadFileRequest schema
export const InitUploadFileRequestSchema = z.object({
    file_name: z.string(),
    file_size: z.number(),
    file_type: z.string(),
    checksum: z.string(),
});

// InitUploadRequest schema
export const InitUploadRequestSchema = z.object({
    files: z.array(InitUploadFileRequestSchema),
});

// UploadUrlInfo schema
export const UploadUrlInfoSchema = z.object({
    document_id: z.string(),
    file_name: z.string(),
    upload_url: z.string(),
    s3_key: z.string(),
    expires_in: z.number(),
});

// InitUploadResponse schema
export const InitUploadResponseSchema = z.object({
    success: z.boolean(),
    upload_urls: z.array(UploadUrlInfoSchema),
    total_files: z.number(),
});

// CompleteUploadRequest schema
export const CompleteUploadRequestSchema = z.object({
    document_id: z.string(),
    s3_key: z.string(),
    metadata: z.any().optional(),
});

// Add a wrapper schema for single document upload response
export const UploadDocumentResponseSchema = z.object({
    success: z.boolean(),
    document: DocumentSchema,
});

// Add wrapper schema for multiple document upload
export const UploadMultipleDocumentsResponseSchema = z.object({
    success: z.boolean(),
    documents: z.array(DocumentSchema),
});

export type UploadMultipleDocumentsResponse = z.infer<typeof UploadMultipleDocumentsResponseSchema>;

// CompleteUploadResponse schema
export const CompleteUploadResponseSchema = z.object({
    success: z.boolean(),
    document_id: z.string(),
    status: z.string(),
});

// ViewDocumentResponse schema
export const ViewDocumentResponseSchema = z.object({
    success: z.boolean(),
    document_id: z.string(),
    file_name: z.string(),
    file_type: z.string(),
    file_size: z.string(), // Changed to string
    presigned_url: z.string(),
    uploaded_at: z.string(),
});

// DownloadDocumentResponse schema
export const DownloadDocumentResponseSchema = z.object({
    success: z.boolean(),
    document_id: z.string(),
    url: z.string(),
    expires_in: z.number(),
});

// DeleteDocumentResponse schema
export const DeleteDocumentResponseSchema = z.object({
    success: z.boolean(),
    document_id: z.string(),
    deleted: z.boolean(),
    deleted_at: z.string(),
});

// Type inference helpers
export type Document = z.infer<typeof DocumentSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type DocumentsData = z.infer<typeof DocumentsDataSchema>;
export type DocumentQueryParams = z.infer<typeof DocumentQueryParamsSchema>;
export type InitUploadFileRequest = z.infer<typeof InitUploadFileRequestSchema>;
export type InitUploadRequest = z.infer<typeof InitUploadRequestSchema>;
export type UploadUrlInfo = z.infer<typeof UploadUrlInfoSchema>;
export type InitUploadResponse = z.infer<typeof InitUploadResponseSchema>;
export type CompleteUploadRequest = z.infer<typeof CompleteUploadRequestSchema>;
export type CompleteUploadResponse = z.infer<typeof CompleteUploadResponseSchema>;
export type ViewDocumentResponse = z.infer<typeof ViewDocumentResponseSchema>;
export type DownloadDocumentResponse = z.infer<typeof DownloadDocumentResponseSchema>;
export type DeleteDocumentResponse = z.infer<typeof DeleteDocumentResponseSchema>;
export type UploadDocumentResponse = z.infer<typeof UploadDocumentResponseSchema>;
