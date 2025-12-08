import { z } from 'zod';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'text/plain'
];

export const DocumentQueryParamsSchema = z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(100).optional(),
    sortBy: z.enum(['name', 'lastEdited', 'type']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
});

export const UploadDocumentRequestSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 50MB')
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            'File type not supported. Please upload PDF, DOCX,TXT files'
        ),
    name: z.string().min(1).max(255).optional(),
    type: z.string().optional(),
});