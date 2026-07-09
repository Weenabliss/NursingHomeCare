import React, { useEffect } from "react";
import { X } from "lucide-react";
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
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ maxWidth }}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {(onConfirm || footerLeftContent || footerRightContent) && (
          <div className={styles.footer}>
            <div className={styles.footerLeft}>{footerLeftContent}</div>
            <div className={styles.footerRight}>
              {footerRightContent}
              {onClose && !footerRightContent && (
                <BaseButton variant="outline" onClick={onClose}>
                  {cancelText || t("common.cancel")}
                </BaseButton>
              )}
              {onConfirm && (
                <BaseButton variant="primary" onClick={onConfirm}>
                  {confirmText || t("common.confirm")}
                </BaseButton>
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
