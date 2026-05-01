import { useEffect } from "react";
import type { ReactNode } from "react";
import { CloseIcon } from "../../icons/icon";

type ModalProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
  onClose?: () => void;
};

const Modal = ({ children, title, description, onClose }: ModalProps) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/60"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
    >
      <div className="w-full max-w-[640px] rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 px-8 pb-3 pt-7">
          <div>
            {title ? (
              <h2 className="text-[2.1rem] font-semibold leading-tight text-slate-900 dark:text-slate-100">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-[1.05rem] text-slate-500 dark:text-slate-400">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Close modal"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <div className="px-8 pb-7">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
