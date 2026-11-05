import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal accesible: cierra con Escape, clic en el fondo o la X,
 * bloquea el scroll de la página y devuelve el foco al cerrarse.
 */
const Modal = ({ title, icon, onClose, children, dismissible = true }) => {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const firstField = panel?.querySelector("input, button:not([data-modal-close])");
    (firstField ?? panel)?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape" && dismissible) {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [dismissible, onClose]);

  return createPortal(
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-background-dark/55 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => { if (event.target === event.currentTarget && dismissible) onClose(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="modal-panel relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-background p-6 text-text shadow-2xl outline-none sm:p-8"
      >
        {dismissible && (
          <button type="button" data-modal-close onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-2 text-text-secondary transition hover:bg-primary-light/40 hover:text-text">
            <X size={18} />
          </button>
        )}
        {icon && <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div>}
        <h2 id={titleId} className={`${icon ? "mt-5" : ""} pr-8 text-2xl font-semibold`}>{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
