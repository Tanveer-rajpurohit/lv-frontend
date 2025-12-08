import { OutputData } from "@editorjs/editorjs";
import { ProjectMetadata } from "./citations.types";

export enum Privacy {
  PRIVATE = "private",
  PUBLIC = "public"
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

export enum ProjectType {
  UPLOAD = "upload",
  SCRATCH = "scratch",
  TEMPLATE = "template",
}

export type DocumentType =
  | "article"
  | "research_paper"
  | "assignment"
  | "scratch"
  | ""
  | "ideation";

export type ProjectCategory =
  | "article"
  | "research_paper"
  | "assignment"
  | "scratch"
  | "ideation";

export interface Project {
  projectId: string;
  name: string;
  title?: string;
  type: ProjectType;
  status: "active" | "archived" | "deleted";
  createdAt: string;
  updatedAt: string;
  content?: OutputData | null;
  documents?: ProjectDocument[];
  templateId?: string; // Added for template-based projects
  documentType?: DocumentType; // Added to track document category
}

export interface SearchProject {
  id: string;
  title: string;
  category: DocumentType;
  metadata: { data: any };
  content: { data: any };
  access_type: Privacy;
  updated_at: string;
}

export interface SearchProjectResponse {
  results: SearchProject[];
}

export interface GetProjectContent {
  id: string;
  user_id: string;
  title: string;
  category: DocumentType;
  metadata: { data: any };
  content: {
    data: {
      data: OutputData | null;
    };
  };
  access_type: Privacy;
  updated_at: string;
}

//get project by Id
export interface GetProjectByIdResponse {
  workspace: GetProjectContent;
}

export interface ProjectDocument {
  documentId: string;
  fileName: string;
  status: string;
  url: string;
}

export interface UpdateProjectRequest {
  title?: string;
  content?: { data: OutputData };
  access_type?: Privacy;
  metadata?: {
    data: any;
  };
}

interface UpdateProjectData {
  id: string;
  user_id: string;
  title?: string;
  category?: ProjectCategory;
  metadata?: { data: any };
  content?: { data: OutputData };
  access_type?: Privacy;
  updated_at?: string;
}

export interface UpdateProjectResponse {
  workspace: UpdateProjectData;
}

export interface ProjectResponse {
  success: boolean;
  data: Project;
}

// ============ Create Project Types ============

export interface CreateProject {
  name: string;
  type: ProjectType;
  templateId?: string; // Added for template-based creation
  templateData?: Record<string, string | string[]>; // Added for template form data
  documentType?: DocumentType; // Added to track document category
}

export interface CreateProjectResponse {
  workspace: WorkspaceProject;
}

export interface ExportOptions {
  format?: "pdf" | "docx";
  pageSize?: "A4" | "Letter" | "Legal";
  includeCoverPage?: boolean;
  useResearchPaperFormat?: boolean;
  useArticleFormat?: boolean;
}

export interface ExportProjectRequest {
  title: string,
  content: string,
  doc_type: number,
  metadata: ProjectMetadata,
  include_cover: boolean,
  export_format: number,
  page_size: string,
  color_scheme: number,
  include_page_numbers: boolean,
  include_toc: boolean
}

export interface ExportProjectResponse {
  file_data: string; // base64 encoded
  file_name: string;
}

export interface Template {
  templateId: string;
  title: string;
  tags: string[];
  category: DocumentType;
  content: OutputData;
}

/**
 * @deprecated Use CreateProject instead for unified project creation
 * This interface is maintained for backward compatibility
 */
export interface CreateDocumentRequest {
  documentName: string;
  documentType: DocumentType;
  templateId?: string;
  data: Record<string, string | string[]>;
}

/**
 * @deprecated Use CreateProjectResponse instead
 * This interface is maintained for backward compatibility
 */
export interface CreateDocumentResponse {
  documentId: string;
  documentType: DocumentType;
  templateId?: string;
}
