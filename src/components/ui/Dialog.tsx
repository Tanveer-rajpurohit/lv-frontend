"use client";

import type { ReactNode } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}

export default function Dialog({ isOpen, onClose, size = "md", className, children }: DialogProps) {
  if (!isOpen) return null;

  const maxWidth = size === "lg" ? "max-w-3xl" : size === "md" ? "max-w-xl" : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`w-full ${maxWidth} rounded-lg bg-white p-4 shadow-lg dialog-container ${className ?? ""}`}>
        <button className="mb-2 text-sm text-gray-500" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
