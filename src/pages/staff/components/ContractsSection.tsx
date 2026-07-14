import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, ScrollText, FileText } from "lucide-react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { MediaViewerModal } from "../../../components/molecules/MediaViewerModal";
import { FileAttachment } from "../../../components/molecules/FileAttachment";
import { getContractStatusBadge } from "../../../components/atoms/BaseBadge";
import { useFormModal } from "../../../hooks/useFormModal";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

type Contract = Staff["contracts"][number];

export const ContractsSection: React.FC<{ staff: Staff }> = ({ staff }) => {
  const { t } = useTranslation();
  const { isOpen, isDirty, localData, setLocalData, openModal, closeModal, markDirty, updateItem } =
    useFormModal(staff.contracts);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const selected = localData[selectedIdx] as Contract | undefined;

  const handleAddNew = () => {
    const newItem: Contract = {
      id: `new-${Date.now()}`,
      type: "Thử việc",
      status: "active",
      startDate: "",
    };
    const newData = [...localData, newItem];
    setLocalData(newData);
    setSelectedIdx(newData.length - 1);
    markDirty();
    setTimeout(() => {
      const el = document.getElementById("contracts-list");
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
      <BaseCard
        isSelected={isOpen}
        onClick={openModal}
        style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
      >
        <h3 className={styles.infoSectionTitle}>Hợp đồng lao động</h3>
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
          {staff.contracts.map((contract) => (
            <div
              key={contract.id}
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
              {/* Top: badge + name + doc link */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "0 12px", minHeight: 0 }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                  backgroundColor: "#e0e7ff", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "var(--primary)",
                }}>
                  <ScrollText size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingRight: contract.documentUrl ? "60px" : "0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>{contract.type}</span>
                    {getContractStatusBadge(contract.status)}
                  </div>
                </div>
              </div>
              
              {/* Scan Button (Absolute Top Right) */}
              {contract.documentUrl && (
                <div
                  onClick={(e) => { e.stopPropagation(); setPreviewPdfUrl(contract.documentUrl || null); }}
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
                  <FileText size={12} /> Bản quét
                </div>
              )}
              {/* Date strip — fixed height at bottom */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--border)", backgroundColor: "#f8fafc", flexShrink: 0 }}>
                <div style={{ padding: "5px 10px", borderRight: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bắt đầu</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)", marginTop: "1px" }}>{contract.startDate || "—"}</div>
                </div>
                <div style={{ padding: "5px 10px" }}>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Kết thúc</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)", marginTop: "1px" }}>{contract.endDate || "Vô hạn"}</div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </BaseCard>

      {/* ── SPLIT PANE MODAL ────────────────────────────────────── */}
      <BaseModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Hợp đồng lao động"
        confirmText={t("common.save")}
        onConfirm={closeModal}
        isDirty={isDirty}
        maxWidth="1100px"
        noPadding
      >
        <div style={{ display: "flex", height: "72vh", overflow: "hidden" }}>
          {/* ── LEFT PANE: List ── */}
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
            <div id="contracts-list" style={{ flex: 1, overflowY: "auto", padding: "0.75rem", minHeight: 0, scrollBehavior: "smooth" }}>
              {localData.map((item, idx) => {
                const c = item as Contract;
                const isSelected = idx === selectedIdx;
                return (
                  <div
                    key={c.id}
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
                        backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : "#e0e7ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: isSelected ? "#ffffff" : "var(--primary)",
                      }}
                    >
                      <ScrollText size={16} />
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
                        {c.type || "Chưa đặt loại"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: isSelected ? "rgba(255,255,255,0.75)" : "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {c.startDate || "Chưa có ngày"}
                      </div>
                    </div>
                    {/* Tiny status indicator */}
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        backgroundColor:
                          c.status === "active"
                            ? "#22c55e"
                            : c.status === "expired"
                            ? "#f97316"
                            : "#94a3b8",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)" }}>
              <BaseButton variant="outline" style={{ width: "100%" }} onClick={handleAddNew}>
                <Plus size={15} style={{ marginRight: "6px" }} />
                Thêm hợp đồng mới
              </BaseButton>
            </div>
          </div>

          {/* ── RIGHT PANE: Detail Form ── */}
          <div style={{ flex: 1, padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", gap: "var(--spacing-md)", overflowY: "auto", minHeight: 0 }}>
            {selected ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                      <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                        {selected.type || "Hợp đồng " + (selectedIdx + 1)}
                      </div>
                      {getContractStatusBadge(selected.status)}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Chỉnh sửa thông tin hợp đồng
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <BaseSelect
                    label="Loại hợp đồng"
                    defaultValue={selected.type}
                    options={[
                      { label: "Thử việc", value: "Thử việc" },
                      { label: "Có thời hạn 1 năm", value: "Có thời hạn 1 năm" },
                      { label: "Có thời hạn 3 năm", value: "Có thời hạn 3 năm" },
                      { label: "Vô thời hạn", value: "Vô thời hạn" },
                    ]}
                    onChange={(e) => updateItem<Contract>(selectedIdx, "type", e.target.value)}
                  />
                  <BaseSelect
                    label="Trạng thái"
                    defaultValue={selected.status}
                    options={[
                      { label: "Hiệu lực", value: "active" },
                      { label: "Hết hạn", value: "expired" },
                      { label: "Đã chấm dứt", value: "terminated" },
                    ]}
                    onChange={(e) => updateItem<Contract>(selectedIdx, "status", e.target.value)}
                  />
                  <BaseInput
                    label="Từ ngày"
                    type="date"
                    defaultValue={selected.startDate}
                    onChange={(e: any) => updateItem<Contract>(selectedIdx, "startDate", e.target.value)}
                  />
                  <BaseInput
                    label="Đến ngày"
                    type="date"
                    defaultValue={selected.endDate || ""}
                    onChange={(e: any) => updateItem<Contract>(selectedIdx, "endDate", e.target.value)}
                  />
                </div>

                {/* Attachment row — full width */}
                <FileAttachment
                  label="URL Bản quét Hợp đồng"
                  uploadId={`file-upload-${selected.id}`}
                  value={selected.documentUrl || ""}
                  accept="application/pdf,image/*"
                  uploadLabel="Đính kèm"
                  onUrlChange={(url) => updateItem<Contract>(selectedIdx, "documentUrl", url)}
                  onFileSelect={(url) => updateItem<Contract>(selectedIdx, "documentUrl", url)}
                  onPreview={() => setPreviewPdfUrl(selected.documentUrl || null)}
                />
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
                <ScrollText size={36} strokeWidth={1.5} />
                <p style={{ margin: 0 }}>Nhấn "+ Thêm hợp đồng mới" để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </BaseModal>

      <MediaViewerModal
        isOpen={!!previewPdfUrl}
        onClose={() => setPreviewPdfUrl(null)}
        url={previewPdfUrl}
        type="pdf"
      />
    </>
  );
};
