import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Award, ImageIcon } from "lucide-react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { MediaViewerModal } from "../../../components/molecules/MediaViewerModal";
import { FileAttachment } from "../../../components/molecules/FileAttachment";
import { useFormModal } from "../../../hooks/useFormModal";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

type Cert = Staff["certificates"][number];

export const CertificatesSection: React.FC<{ staff: Staff }> = ({ staff }) => {
  const { t } = useTranslation();
  const { isOpen, isDirty, localData, setLocalData, openModal, closeModal, markDirty, updateItem } =
    useFormModal(staff.certificates);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const selected = localData[selectedIdx] as Cert | undefined;

  const handleAddNew = () => {
    const newItem: Cert = {
      id: `new-cert-${Date.now()}`,
      name: "",
      issuer: "",
      issueDate: "",
    };
    const newData = [...localData, newItem];
    setLocalData(newData);
    setSelectedIdx(newData.length - 1);
    markDirty();
    setTimeout(() => {
      const el = document.getElementById("certificates-list");
      if (el) el.scrollTop = el.scrollHeight;
    }, 10);
  };

  const handleDelete = (idx: number) => {
    const newData = localData.filter((_, i) => i !== idx);
    setLocalData(newData);
    setSelectedIdx(Math.min(selectedIdx, newData.length - 1));
    markDirty();
  };

  return (
    <>
      <BaseCard isSelected={isOpen} onClick={openModal} style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <h3 className={styles.infoSectionTitle}>Hồ sơ &amp; Bằng cấp</h3>
        <div
          className="custom-scrollbar"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridAutoRows: "100%",
            gap: "var(--spacing-sm)",
            marginTop: "var(--spacing-sm)",
            marginLeft: "-2rem",
            marginRight: "-2rem",
            paddingLeft: "2rem",
            paddingRight: "1rem",
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            scrollSnapType: "y mandatory",
            scrollbarGutter: "stable",
          }}
        >
          {staff.certificates.map((cert) => {
            const isExpiring = staff.certWarning && !!cert.expiryDate;
            return (
              <div
                key={cert.id}
                style={{
                  position: "relative",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  scrollSnapAlign: "start",
                }}
              >
                {/* Top: icon + name + issuer + scan */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "0 12px", minHeight: 0 }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                    backgroundColor: "#fef3c7", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#d97706",
                  }}>
                    <Award size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: cert.imageUrl ? "60px" : "0" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cert.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{cert.issuer || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Scan Button (Absolute Top Right) */}
                {cert.imageUrl && (
                  <div
                    onClick={(e) => { e.stopPropagation(); setPreviewImageUrl(cert.imageUrl || null); }}
                    style={{
                      position: "absolute",
                      top: 0, right: 0,
                      display: "flex", alignItems: "center", gap: "4px",
                      padding: "4px 8px",
                      backgroundColor: "#eef2ff",
                      color: "var(--primary)",
                      fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
                      borderBottomLeftRadius: "8px",
                      cursor: "pointer",
                      boxShadow: "-2px 2px 5px rgba(0,0,0,0.02)"
                    }}
                    title="Xem bản quét"
                  >
                    <ImageIcon size={12} /> Bản quét
                  </div>
                )}
                {/* Date strip */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--border)", backgroundColor: "#f8fafc", flexShrink: 0 }}>
                  <div style={{ padding: "5px 10px", borderRight: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ngày cấp</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)", marginTop: "1px" }}>{cert.issueDate || "—"}</div>
                  </div>
                  <div style={{ padding: "5px 10px" }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: isExpiring ? "#dc2626" : "var(--text-muted)" }}>
                      {isExpiring ? "⚠ Hết hạn" : "Hết hạn"}
                    </div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, marginTop: "1px", color: isExpiring ? "#dc2626" : "var(--text-main)" }}>{cert.expiryDate || "—"}</div>
                  </div>
                </div>
              </div>
            );
          })}





        </div>
      </BaseCard>

      {/* ── SPLIT PANE MODAL ────────────────────────────────────── */}
      <BaseModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Hồ sơ & Bằng cấp"
        confirmText={t("common.save")}
        onConfirm={closeModal}
        isDirty={isDirty}
        maxWidth="1100px"
        noPadding
      >
        <div style={{ display: "flex", height: "72vh", overflow: "hidden" }}>
          {/* ── LEFT PANE ── */}
          <div
            style={{
              width: "340px",
              flexShrink: 0,
              borderRight: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f8fafc",
              borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
            }}
          >
            <div id="certificates-list" style={{ flex: 1, overflowY: "auto", padding: "0.75rem", minHeight: 0, scrollBehavior: "smooth" }}>
              {localData.map((item, idx) => {
                const cert = item as Cert;
                const isSelected = idx === selectedIdx;
                const isExpiring =
                  staff.certWarning && staff.certificates.some((c) => c.id === cert.id && c.expiryDate);
                return (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedIdx(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-md)",
                      padding: "var(--spacing-md) var(--spacing-lg)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      marginBottom: "0.25rem",
                      backgroundColor: isSelected ? "var(--primary)" : "transparent",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : "#fef3c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: isSelected ? "#ffffff" : "#d97706",
                      }}
                    >
                      <Award size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: isSelected ? "#ffffff" : "var(--text-main)",
                        }}
                      >
                        {cert.name || "Chưa đặt tên"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: isSelected ? "rgba(255,255,255,0.75)" : isExpiring ? "#dc2626" : "var(--text-muted)",
                          marginTop: "2px",
                          fontWeight: isExpiring ? 600 : 400,
                        }}
                      >
                        {cert.expiryDate ? `HH: ${cert.expiryDate}` : cert.issueDate || "Chưa có ngày"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)" }}>
              <BaseButton variant="outline" style={{ width: "100%" }} onClick={handleAddNew}>
                <Plus size={15} style={{ marginRight: "6px" }} />
                Thêm bằng cấp mới
              </BaseButton>
            </div>
          </div>

          {/* ── RIGHT PANE: Detail Form ── */}
          <div style={{ flex: 1, padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", gap: "var(--spacing-md)", overflowY: "auto", minHeight: 0 }}>
            {selected ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                      {selected.name || "Bằng cấp " + (selectedIdx + 1)}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Chỉnh sửa thông tin hồ sơ / bằng cấp
                    </div>
                  </div>
                  {localData.length > 1 && (
                    <BaseButton
                      variant="danger"
                      style={{ padding: "6px 10px" }}
                      onClick={() => handleDelete(selectedIdx)}
                    >
                      <Trash2 size={15} />
                    </BaseButton>
                  )}
                </div>

                <div style={{ height: "1px", backgroundColor: "var(--border)" }} />

                {/* Unified 2-column grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <BaseInput
                    label="Tên bằng cấp / chứng chỉ"
                    value={selected.name}
                    onChange={(e) => updateItem<Cert>(selectedIdx, "name", e.target.value)}
                  />
                  <BaseInput
                    label="Nơi cấp"
                    value={selected.issuer}
                    onChange={(e) => updateItem<Cert>(selectedIdx, "issuer", e.target.value)}
                  />
                  <BaseInput
                    label="Ngày cấp"
                    type="date"
                    value={selected.issueDate}
                    onChange={(e) => updateItem<Cert>(selectedIdx, "issueDate", e.target.value)}
                  />
                  <BaseInput
                    label="Ngày hết hạn"
                    type="date"
                    value={selected.expiryDate || ""}
                    onChange={(e) => updateItem<Cert>(selectedIdx, "expiryDate", e.target.value)}
                  />
                </div>

                {/* Image preview area + upload */}
                <div style={{ display: "flex", gap: "var(--spacing-md)", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <FileAttachment
                      label="URL Ảnh chụp bằng cấp"
                      uploadId={`cert-upload-${selected.id}`}
                      value={selected.imageUrl || ""}
                      accept="image/*"
                      uploadLabel="Tải lên"
                      onUrlChange={(url) => updateItem<Cert>(selectedIdx, "imageUrl", url)}
                      onFileSelect={(url) => updateItem<Cert>(selectedIdx, "imageUrl", url)}
                    />
                  </div>

                  {/* Mini thumbnail */}
                  {selected.imageUrl && (
                    <div
                      onClick={() => setPreviewImageUrl(selected.imageUrl || null)}
                      title="Xem ảnh lớn"
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        overflow: "hidden",
                        cursor: "pointer",
                        flexShrink: 0,
                        marginTop: "22px",
                      }}
                    >
                      <img
                        src={selected.imageUrl}
                        alt="thumbnail"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  gap: "0.75rem",
                }}
              >
                <Award size={36} strokeWidth={1.5} />
                <p style={{ margin: 0 }}>Nhấn "+ Thêm bằng cấp mới" để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </BaseModal>

      <MediaViewerModal
        isOpen={!!previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        url={previewImageUrl}
        type="image"
      />
    </>
  );
};
