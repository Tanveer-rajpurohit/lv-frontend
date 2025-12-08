export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closable?: boolean;
    overlayClosable?: boolean;
    className?: string;
    zIndex?: number;
}

//project dialog
export interface ProjectDialogProps extends Omit<DialogProps, 'children'> {
    onSubmit: (data: ProjectFormData) => Promise<void> | void;
    isLoading?: boolean;
}

export interface ProjectFormData {
    name: string;
    type: 'scratch' | 'upload';
    files: File[];
}

//toast
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}
