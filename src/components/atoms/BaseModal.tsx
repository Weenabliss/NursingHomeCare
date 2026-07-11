import React, { useEffect, useCallback, useState } from "react";
import { X, AlertCircle } from "lucide-react";
import styles from "./BaseModal.module.scss";
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
  isDirty?: boolean;
  noPadding?: boolean;
  isDanger?: boolean;
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
  isDirty,
  noPadding = false,
  isDanger = false,
}) => {
  const { t } = useTranslation();
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleClose = useCallback(() => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

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
      className={styles.overlay} 
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={styles.modal} style={{ maxWidth, position: "relative" }}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={noPadding ? styles.bodyNoPadding : styles.body}>{children}</div>

        {(onConfirm || footerLeftContent || footerRightContent) && (
          showConfirmClose ? (
            <div className={styles.footer} style={{ backgroundColor: "#fef2f2", borderTopColor: "#fecaca" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, color: "#b91c1c" }}>
                <AlertCircle size={18} />
                <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>Hủy bỏ các thay đổi chưa lưu?</span>
              </div>
              <div className={styles.footerRight}>
                <BaseButton variant="outline" onClick={() => setShowConfirmClose(false)}>
                  {t("common.cancel")}
                </BaseButton>
                <BaseButton variant="danger" onClick={() => {
                  setShowConfirmClose(false);
                  onClose();
                }}>
                  Đóng
                </BaseButton>
              </div>
            </div>
          ) : (
            <div className={styles.footer}>
              <div className={styles.footerLeft}>{footerLeftContent}</div>
              <div className={styles.footerRight}>
                {footerRightContent}
                {!footerRightContent && (
                  <BaseButton variant="outline" onClick={handleClose}>
                    {cancelText || t("common.cancel")}
                  </BaseButton>
                )}
                {onConfirm && (
                  <BaseButton variant={isDanger ? "danger" : "primary"} onClick={onConfirm} disabled={isDirty === false}>
                    {confirmText || t("common.confirm")}
                  </BaseButton>
                )}
              </div>
            </div>
          )
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
