export type DocumentType =
  | "article"
  | "research_paper"
  | "assignment"
  | "scratch"
  | ""
  | "ideation";

export enum Privacy {
    PRIVATE = "private",
    PUBLIC = "public"
}

export interface StudentProjectCard {
    id: string
    title: string
    type: DocumentType
    lastEdited: string
    isPrivate?: boolean
    authors?: string[]
    subject?: string
}

export interface StudentProjectCardResponse {
    id: string
    title: string
    type: DocumentType
    lastEdited: string
    isPrivate?: boolean
    authors?: string[]
    subject?: string
}

export interface WorkspaceProjectResponse {
    workspaces: WorkspaceProject[]
}

export interface WorkspaceProject {
    id: string
    user_id: string
    title: string
    category: DocumentType
    metadata: { data: any },
    content: { data: any },
    access_type: Privacy
    updated_at: string
}

export interface SubscriptionFeedback {
    user_id: string
    subscription_type: string
}
