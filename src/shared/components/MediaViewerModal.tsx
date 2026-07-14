import React from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "./BaseModal";
import styles from "./MediaViewerModal.module.scss";

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  type?: "pdf" | "image" | "auto";
  title?: string;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ isOpen, onClose, url, type = "auto", title }) => {
  const { t } = useTranslation();
  if (!url) return null;

  // Attempt to guess type if "auto"
  const isPdf = type === "pdf" || (type === "auto" && url.toLowerCase().includes(".pdf"));
  // Object URLs are likely images in this app context, unless explicitly pdf
  const isImage = type === "image" || (!isPdf && type === "auto");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || t("mediaViewer.title")}
      maxWidth={isPdf ? "900px" : "600px"}
    >
      <div className={styles.container}>
        {isPdf ? (
          <iframe
            src={url}
            className={styles.pdfFrame}
            title={t("mediaViewer.pdfPreview")}
          />
        ) : isImage ? (
          <img
            src={url}
            alt={t("mediaViewer.scan")}
            className={styles.image}
          />
        ) : (
          <div className={styles.unsupported}>
            {t("mediaViewer.unsupported")}
          </div>
        )}
      </div>
    </BaseModal>
  );
};
