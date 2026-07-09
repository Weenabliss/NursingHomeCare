import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BaseButton } from "./BaseButton";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  maxWidth?: string;
  footerLeftContent?: React.ReactNode;
  footerRightContent?: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText,
  cancelText,
  maxWidth = "500px",
  footerLeftContent,
  footerRightContent,
}) => {
  const { t } = useTranslation();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-md) var(--spacing-lg)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              color: "var(--primary-dark)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: "var(--spacing-lg)",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {children}
        </div>

        {(onConfirm || footerRightContent || footerLeftContent) && (
          <div
            style={{
              padding: "var(--spacing-md) var(--spacing-lg)",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>{footerLeftContent}</div>
            <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
              {footerRightContent ? (
                footerRightContent
              ) : (
                <>
                  <BaseButton variant="outline" onClick={onClose}>
                    {cancelText || t("hr.cancel")}
                  </BaseButton>
                  {onConfirm && <BaseButton onClick={onConfirm}>{confirmText || t("hr.save")}</BaseButton>}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
