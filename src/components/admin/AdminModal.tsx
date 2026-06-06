"use client";

import { useId } from "react";
import { createPortal } from "react-dom";
import type { FormEventHandler, ReactNode } from "react";
import { AdminScrollbar } from "@/components/admin/AdminScrollArea";

type AdminModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  size?: "md" | "lg" | "wide" | "xl";
  as?: "div" | "form";
  onSubmit?: FormEventHandler<HTMLFormElement>;
};

const sizeClassName = {
  md: "admin-modal-md",
  lg: "admin-modal-lg",
  wide: "admin-modal-wide",
  xl: "admin-modal-xl",
};

export function AdminModal({
  title,
  children,
  onClose,
  footer,
  size = "lg",
  as = "div",
  onSubmit,
}: AdminModalProps) {
  const titleId = useId();
  const portalTarget =
    typeof document === "undefined"
      ? null
      : document.querySelector<HTMLElement>(".admin-shell") ?? document.body;

  const content = (
    <>
      <div className="admin-modal-header">
        <h2 id={titleId}>{title}</h2>
        <button type="button" onClick={onClose} className="admin-modal-close" aria-label="关闭弹窗">
          ×
        </button>
      </div>
      <AdminScrollbar className="admin-modal-body" scrollableNodeClassName="admin-modal-body-viewport">
        {children}
      </AdminScrollbar>
      {footer && <div className="admin-modal-footer">{footer}</div>}
    </>
  );

  const modal = (
    <div className="admin-modal-backdrop" role="presentation">
      {as === "form" ? (
        <form
          onSubmit={onSubmit}
          className={`admin-clean-scrollbar admin-modal-panel ${sizeClassName[size]}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {content}
        </form>
      ) : (
        <div
          className={`admin-clean-scrollbar admin-modal-panel ${sizeClassName[size]}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {content}
        </div>
      )}
    </div>
  );

  if (!portalTarget) return null;

  return createPortal(modal, portalTarget);
}
