import { z } from "zod"

// Schema for individual section within fullContent
export const ExploreSectionSchema = z.object({
    title: z.string().min(1, "Section title is required"),
    content: z.string().min(1, "Section content is required"),
})

// Schema for fullContent
export const ExploreFullContentSchema = z.object({
    introduction: z.string().min(1, "Introduction is required"),
    sections: z.array(ExploreSectionSchema).min(1, "At least one section is required"),
})

// Main ExploreItem schema
export const ExploreItemSchema = z.object({
    id: z.string().min(1, "ID is required"),
    title: z.string().min(1, "Title is required"),
    url: z.string().url("Invalid URL format"),
    description: z.string().min(1, "Description is required"),
    fullContent: ExploreFullContentSchema,
})

export const ExploreItemsRequestSchema = z.object({
    query: z.string().min(1, "Query is required"),
    user_id: z.string().min(1, "User ID is required"),
})

// Array schema for multiple items
export const ExploreItemsArraySchema = z.array(ExploreItemSchema)

// Type exports (inferred from schemas)
export type ExploreSection = z.infer<typeof ExploreSectionSchema>
export type ExploreFullContent = z.infer<typeof ExploreFullContentSchema>
export type ExploreItem = z.infer<typeof ExploreItemSchema>
export type ExploreItemsArray = z.infer<typeof ExploreItemsArraySchema>

//helper function
export function validateExploreItem(data: unknown): ExploreItem {
    return ExploreItemSchema.parse(data)
}

export function validateExploreItems(data: unknown): ExploreItem[] {
    return ExploreItemsArraySchema.parse(data)
}