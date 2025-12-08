import { z } from "zod";

export const CitationSaveDataRequestSchema = z.object({
    blockId: z.string(),
    citationId: z.string(),
    projectId: z.string(),
});