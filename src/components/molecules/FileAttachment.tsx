import React, { useRef } from "react";
import { Eye, Upload } from "lucide-react";
import { BaseInput } from "../atoms/BaseInput";
import { BaseButton } from "../atoms/BaseButton";

interface FileAttachmentProps {
  /** Current URL value shown in the input */
  value: string;
  /** Label for the URL input field */
  label?: string;
  /** Unique ID used for the hidden file input — must be unique per instance */
  uploadId: string;
  /** Accept MIME types for the file picker, e.g. "image/*" or "application/pdf,image/*" */
  accept?: string;
  /** Label for the upload button */
  uploadLabel?: string;
  /** Called when the URL input changes */
  onUrlChange: (url: string) => void;
  /** Called when a file is selected — receives the object URL */
  onFileSelect: (objectUrl: string) => void;
  /** Called when the preview button is clicked */
  onPreview?: () => void;
}

/**
 * Reusable molecule for attaching a file (image or PDF).
 *
 * Renders:
 *   [URL input field]  [Preview button?]  [Upload button]
 *
 * Used in CertificatesSection (image) and ContractsSection (PDF/image).
 */
export const FileAttachment: React.FC<FileAttachmentProps> = ({
  value,
  label = "URL Đính kèm",
  uploadId,
  accept = "image/*",
  uploadLabel = "Tải lên",
  onUrlChange,
  onFileSelect,
  onPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", width: "100%" }}>
      {/* URL input */}
      <div style={{ flex: 1 }}>
        <BaseInput
          label={label}
          value={value}
          onChange={(e) => onUrlChange(e.target.value)}
        />
      </div>

      {/* Preview button — only shown when there is a URL */}
      {value && onPreview && (
        <BaseButton
          variant="outline"
          type="button"
          style={{ height: "38px" }}
          onClick={onPreview}
        >
          <Eye size={16} style={{ marginRight: "4px" }} /> Xem
        </BaseButton>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        id={uploadId}
        onChange={handleFileChange}
      />

      {/* Upload trigger button */}
      <BaseButton
        variant="outline"
        type="button"
        style={{ height: "38px" }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={16} style={{ marginRight: "4px" }} /> {uploadLabel}
      </BaseButton>
    </div>
  );
};
