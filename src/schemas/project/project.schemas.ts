import z from "zod";

enum Privacy {
    PRIVATE = "private",
    PUBLIC = "public"
}

export enum ProjectCategory {
    ARTICLE = "article",
    ASSIGNMENT = "assignment",
    RESEARCH_PAPER = "research_paper",
    IDEATION = "ideation"
}

export const ProjectCategoryEnum = z.enum(
    Object.values(ProjectCategory) as [
        ProjectCategory.ARTICLE,
        ProjectCategory.ASSIGNMENT,
        ProjectCategory.RESEARCH_PAPER,
        ProjectCategory.IDEATION
    ]
);

export const PrivacyEnum = z.enum(
    Object.values(Privacy) as [
        Privacy.PRIVATE,
        Privacy.PUBLIC
    ]
);

const projectDocumentSchema = z.object({
    documentId: z.string(),
    fileName: z.string(),
    status: z.string(),
    url: z.string(),
});

export const citationSchema = z.object({
    id: z.string(),
    source: z.string(),
    title: z.string(),
    author: z.string(),
    year: z.string().optional(),
    url: z.string().optional(),
    publisher: z.string().optional(),
    position: z.object({
        start: z.number(),
        end: z.number()
    }).optional(),
    addedAt: z.string().optional(),
});

export const citationsSchema = z.record(z.string(), z.array(citationSchema));


const editorBlockSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.record(z.string(), z.any()),
});

const outputDataSchema = z.object({
    time: z.number().optional(),
    blocks: z.array(editorBlockSchema),
    version: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export const searchProjectRequestSchema = z.object({
    query: z.string()
})

export const searchProjectSchema = z.object({
    id: z.string(),
    title: z.string(),
    category: ProjectCategoryEnum.optional(),
    metadata: z.object({ data: z.any() }).optional(),
    content: z.object({
        data: z.any()
    }).optional(),
    access_type: PrivacyEnum.optional(),
    updated_at: z.string()
})

export const createProjectRequestSchema = z.object({
    title: z.string().min(1, 'Project name is required'),
    category: z.enum(["article", "assignment", "research_paper", "scratch", "ideation"]),
    metadata: z.record(z.string(), z.any()).optional(),
    content: z.record(z.string(), z.any()).optional(),
    access_type: z.enum([Privacy.PRIVATE, Privacy.PUBLIC]),
});

export const projectDataSchema = z.object({
    workspace: z.object({
        id: z.string(),
        user_id: z.string(),
        title: z.string(),
        category: ProjectCategoryEnum.optional(),
        metadata: z.object({ data: z.any() }).optional(),
        content: z.object({
            data: z.any()
        }).optional(),
        access_type: PrivacyEnum.optional(),
        updated_at: z.string()
    })
});

export const getProjectContentSchema = z.object({
    data: outputDataSchema || null
})

export const projectWithCitationsSchema = z.object({
    editorData: outputDataSchema,
    citations: z.record(z.string(), z.array(z.object({
        id: z.string(),
        source: z.string(),
        title: z.string(),
        author: z.string(),
        position: z.object({
            start: z.number(),
            end: z.number()
        }).optional(),
    }))).optional(),
});

export type ProjectWithCitations = z.infer<typeof projectWithCitationsSchema>;

export const getProjectByIdSchema = z.object({
    workspace: z.object({
        id: z.string(),
        user_id: z.string(),
        title: z.string(),
        category: ProjectCategoryEnum.optional(),
        metadata: z.object({ data: z.any() }).optional(),
        content: z.object({
            data: z.object({
                data: outputDataSchema
            })
        }).optional(),
        access_type: PrivacyEnum.optional(),
        updated_at: z.string()
    })
});

export const workspaceSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    title: z.string(),
    category: ProjectCategoryEnum.optional(),
    metadata: z.object({
        data: z.any()  // Can contain any key-value pairs
    }).optional(),
    content: z.object({
        data: z.any()  // Can contain any key-value pairs
    }).optional(),
    access_type: PrivacyEnum.optional(),
    updated_at: z.string()
});

export const fetchStudentProjectsSchema = z.object({
    workspaces: z.array(workspaceSchema)  // Array of workspace objects directly
});

export const updateProjectRequestSchema = z.object({
    title: z.string().optional(),
    content: z.object({
        data: outputDataSchema
    }).optional(),
    access_type: z.enum([Privacy.PRIVATE, Privacy.PUBLIC]).optional(),
});

export const updateProjectResponseSchema = z.object({
    workspace: z.object({
        id: z.string(),
        user_id: z.string(),
        title: z.string().optional(),
        category: ProjectCategoryEnum.optional(),
        metadata: z.object({
            data: z.any()
        }).optional(),
        content: z.object({
            data: z.object({
                data: outputDataSchema
            })
        }).optional(),
        access_type: PrivacyEnum.optional(),
        updated_at: z.string()
    })
})

export const deleteProjectResponseSchema = z.object({
    message: z.string()
})

export const projectResponseSchema = z.object({
    success: z.boolean(),
    data: getProjectByIdSchema,
});

export const vilationSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
        text: z.string(),
    }),
})

export const getComplianceSchema = z.object({
    success: z.boolean(),
    data: z.array(vilationSchema),
})

export const createProjectResponseSchema = projectDataSchema;

// Project Types
export type CreateProjectRequest = z.infer<typeof createProjectRequestSchema>;
export type ProjectData = z.infer<typeof projectDataSchema>;
export type CreateProjectResponse = z.infer<typeof createProjectResponseSchema>;
export type GetProjectById = z.infer<typeof getProjectByIdSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectRequestSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;