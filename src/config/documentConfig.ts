export interface FormField {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type?: "text" | "multi-entry";
}

export interface DocumentTypeConfig {
  value: string;
  label: string;
  fields: FormField[];
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    value: "article",
    label: "Article",
    fields: [
      {
        name: "authorNames",
        label: "Author Names",
        placeholder: "For eg. Aarav Singh",
        required: true,
        type: "multi-entry",
      },
      {
        name: "instituteName",
        label: "Institution Name",
        placeholder: "For eg. National Law University Delhi",
        required: true,
      },
      {
        name: "supervisorFaculties",
        label: "Supervisor / Faculty",
        placeholder: "For eg. Prof. Aditya",
        required: true,
        type: "multi-entry",
      },
    ],
  },
  {
    value: "research_paper",
    label: "Research Paper",
    fields: [
      {
        name: "authorNames",
        label: "Author Names",
        placeholder: "For eg. Aarav Singh",
        required: true,
        type: "multi-entry",
      },
      {
        name: "instituteName",
        label: "Institution Name",
        placeholder: "For eg. National Law University Delhi",
        required: true,
      },
      {
        name: "supervisorFaculties",
        label: "Supervisor / Faculty",
        placeholder: "For eg. Prof. Aditya",
        required: true,
        type: "multi-entry",
      },
    ],
  },
  {
    value: "assignment",
    label: "Assignment",
    fields: [
      { name: "subjectName", label: "Subject", placeholder: "Enter subject name", required: true },
      { name: "studentName", label: "Student Name", placeholder: "Enter student name", required: true },
      { name: "rollNo", label: "Roll No", placeholder: "Enter roll number", required: true },
      { name: "submittedTo", label: "Submitted To", placeholder: "For eg. Prof. Aditya", required: true },
    ],
  },
  {
    value: "ideation",
    label: "Ideation",
    fields: [],
  },
  {
    value: "scratch",
    label: "Scratch",
    fields: [],
  },
];
