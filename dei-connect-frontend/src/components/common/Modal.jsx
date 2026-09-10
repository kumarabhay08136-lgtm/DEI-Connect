import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto p-md flex items-start sm:items-center justify-center">
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg glass-panel bg-white rounded-3xl shadow-glass p-lg sm:p-xl animate-fade-in my-8 sm:my-0 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-start justify-between mb-lg">
          {title && (
            <h3 className="font-heading text-headline-md text-primary">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-xl">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
