import React, { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
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
  hideFooter?: boolean;
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
  hideFooter = false,
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

  return createPortal(
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

        {(onConfirm || footerLeftContent || footerRightContent) && !hideFooter && (
          showConfirmClose ? (
            <div className={`${styles.footer} ${styles.dangerMode}`}>
              <div className={styles.dangerAlert}>
                <AlertCircle size={18} />
                <span>{t("modal.unsavedChanges")}</span>
              </div>
              <div className={styles.footerRight}>
                <BaseButton variant="outline" onClick={() => setShowConfirmClose(false)}>
                  {t("common.cancel")}
                </BaseButton>
                <BaseButton variant="danger" onClick={() => {
                  setShowConfirmClose(false);
                  onClose();
                }}>
                  {t("common.close")}
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
    </div>,
    document.body
  );
};
