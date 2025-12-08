"use client";

interface LoaderProps {
  message?: string;
}

export default function Loader({ message }: LoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
