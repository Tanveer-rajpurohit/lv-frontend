import { z } from "zod";

enum Privacy {
  PRIVATE = "private",
  PUBLIC = "public"
}

export const PrivacyEnum = z.enum(
  Object.values(Privacy) as [
    Privacy.PRIVATE,
    Privacy.PUBLIC
  ]
);

export const projectCardSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    privacy: PrivacyEnum,
    footerLabel: z.string(),
  })
)

export const blogCardSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    likes: z.number(),
    views: z.string(),
  })
);

export type ProjectCard = z.infer<typeof projectCardSchema>;
export type BlogCard = z.infer<typeof blogCardSchema>;
