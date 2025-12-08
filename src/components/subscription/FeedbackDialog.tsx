"use client";

import type React from "react";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: string;
  title: string;
  subtitle: string;
  steps: Array<{
    text: string;
  }>;
  onHighlightClick?: (text: string) => void;
}

export default function FeedbackDialog({
  isOpen,
  onClose,
  icon = "✓",
  title,
  subtitle,
  steps,
  onHighlightClick,
}: FeedbackDialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const parseStepText = (text: string) => {
    const parts: Array<{ type: "text" | "highlight"; content: string }> = [];
    let lastIndex = 0;
    const regex = /\[([^\]]+)\]/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        });
      }

      parts.push({
        type: "highlight",
        content: match[1],
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: "text", content: text }];
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative"
        onClick={handleContentClick}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="text-4xl mb-4 block">{icon}</span>
          <h1 className="text-2xl font-bold mb-2 text-[#393634]">{title}</h1>
        </div>

        <p className="text-center text-gray-600 mb-6">{subtitle}</p>

        <div className="bg-stone-50 rounded-lg p-6">
          <p className="text-sm font-medium mb-3 text-[#393634]">Next steps:</p>
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li key={index} className="text-sm text-gray-700">
                {parseStepText(step.text).map((part, partIndex) =>
                  part.type === "highlight" ? (
                    <button
                      key={partIndex}
                      className="text-[#393634] underline font-medium hover:text-[#2a2725]"
                      onClick={() => onHighlightClick?.(part.content)}
                    >
                      [{part.content}]
                    </button>
                  ) : (
                    <span key={partIndex}>{part.content}</span>
                  )
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

