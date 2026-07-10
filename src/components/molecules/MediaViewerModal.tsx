import React from "react";
import { BaseModal } from "../atoms/BaseModal";

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  type?: "pdf" | "image" | "auto";
  title?: string;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ isOpen, onClose, url, type = "auto", title = "Xem tài liệu" }) => {
  if (!url) return null;

  // Attempt to guess type if "auto"
  const isPdf = type === "pdf" || (type === "auto" && url.toLowerCase().includes(".pdf"));
  // Object URLs are likely images in this app context, unless explicitly pdf
  const isImage = type === "image" || (!isPdf && type === "auto");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={isPdf ? "900px" : "600px"}
    >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc", borderRadius: "8px", overflow: "hidden", padding: "1rem" }}>
        {isPdf ? (
          <iframe
            src={url}
            style={{ width: "100%", height: "70vh", border: "none", borderRadius: "8px" }}
            title="PDF Preview"
          />
        ) : isImage ? (
          <img
            src={url}
            alt="Bản quét"
            style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "4px" }}
          />
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            Định dạng tài liệu không được hỗ trợ để xem trước.
          </div>
        )}
      </div>
    </BaseModal>
  );
};
