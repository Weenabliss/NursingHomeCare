import React, { useRef } from "react";
import { Eye, Upload } from "lucide-react";
import { BaseInput } from "./BaseInput";
import { BaseButton } from "./BaseButton";
import styles from "./FileAttachment.module.scss";

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
    <div className={styles.container}>
      {/* URL input */}
      <div className={styles.inputWrapper}>
        <BaseInput
          label={label}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUrlChange(e.target.value)}
        />
      </div>

      {/* Preview button — only shown when there is a URL */}
      {value && onPreview && (
        <BaseButton
          variant="outline"
          type="button"
          className={styles.btn}
          onClick={onPreview}
        >
          <Eye size={16} className={styles.icon} /> Xem
        </BaseButton>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className={styles.hiddenInput}
        id={uploadId}
        onChange={handleFileChange}
      />

      {/* Upload trigger button */}
      <BaseButton
        variant="outline"
        type="button"
        className={styles.btn}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={16} className={styles.icon} /> {uploadLabel}
      </BaseButton>
    </div>
  );
};
