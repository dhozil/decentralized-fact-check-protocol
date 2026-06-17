"use client";

import { useEffect, useState } from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "pending" | "info";
  title: string;
  message: string;
  txHash?: string;
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function showToast(toast: Omit<Toast, "id">) {
  const t = { ...toast, id: String(++toastId) };
  listeners.forEach((fn) => fn(t));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 6000);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            bg-white border border-border shadow-lg p-4 animate-slide-in
            ${t.type === "success" ? "border-l-4 border-l-green-700" : ""}
            ${t.type === "error" ? "border-l-4 border-l-accent" : ""}
            ${t.type === "pending" ? "border-l-4 border-l-yellow-600" : ""}
            ${t.type === "info" ? "border-l-4 border-l-blue-700" : ""}
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">
              {t.type === "success" && "✓"}
              {t.type === "error" && "✕"}
              {t.type === "pending" && "○"}
              {t.type === "info" && "i"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm font-bold">{t.title}</p>
              <p className="font-body text-xs text-muted mt-1">{t.message}</p>
              {t.txHash && (
                <a
                  href={`https://explorer-bradbury.genlayer.com/tx/${t.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent underline mt-2 inline-block font-mono"
                >
                  View on Explorer →
                </a>
              )}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-muted hover:text-foreground text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
