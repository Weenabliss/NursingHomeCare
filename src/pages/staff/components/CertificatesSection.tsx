import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Award, Trash2, Plus, BookOpen, AlertTriangle } from "lucide-react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { BaseModal } from "../../../shared/components/BaseModal";
import { BaseInput } from "../../../shared/components/BaseInput";
import { BaseButton } from "../../../shared/components/BaseButton";

import { useFormModal } from "../../../shared/hooks/useFormModal";
import type { Staff } from "../../../modules/hr/types";
import { useStaffTrainingHistory, useCertificateWarnings } from "../../../modules/hr/hooks/useTrainingQuery";
import { BaseSelect } from "../../../shared/components/BaseSelect";
import styles from "../StaffDetail.module.scss";

type InternalTraining = Staff["medicalCredentials"]["internalTrainings"][number];

export const CertificatesSection: React.FC<{ staff: Staff }> = ({ staff }) => {
  const { t } = useTranslation();
  const { isOpen, isDirty, localData, setLocalData, openModal, closeModal, markDirty, updateItem } =
    useFormModal(staff.medicalCredentials.internalTrainings);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const selected = localData[selectedIdx] as InternalTraining | undefined;

  const { data: trainingHistory } = useStaffTrainingHistory(staff.personal.id || "");
  const { data: warnings } = useCertificateWarnings();
  const staffWarning = warnings?.find(w => w.staffId === staff.personal.id);

  const handleAddNew = () => {
    const newItem: InternalTraining = {
      courseId: "cpr",
      completionDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className={styles.infoSectionTitle} style={{ margin: 0 }}>Đào tạo & CCHN</h3>
          {staffWarning && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#dc2626", fontSize: "0.8rem", fontWeight: 600 }}>
              <AlertTriangle size={16} />
              CCHN sắp hết hạn ({staffWarning.daysRemaining} ngày)
            </div>
          )}
        </div>
        
        <div
          className="custom-scrollbar"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1rem",
            flex: 1,
            overflowY: "auto",
            paddingRight: "0.5rem"
          }}
        >
          {/* Lịch sử đào tạo từ API */}
          {trainingHistory && trainingHistory.length > 0 && (
            <div>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem", marginTop: 0 }}>Khóa học nội bộ</h4>
              {trainingHistory.map((history, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", marginBottom: "0.5rem" }}>
                  <BookOpen size={20} color="#0284c7" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Khóa học ID: {history.courseId}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Trạng thái: {history.status} | Điểm: {history.score || "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bằng cấp & Chứng chỉ */}
          <div>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem", marginTop: 0 }}>Bằng cấp & Chứng chỉ</h4>
            {staff.medicalCredentials.internalTrainings.map((cert, idx) => {
              const isExpiring = !!cert.expiryDate && new Date(cert.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", marginBottom: "0.5rem", backgroundColor: isExpiring ? "#fef2f2" : "#fff" }}>
                  <Award size={20} color={isExpiring ? "#dc2626" : "#d97706"} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: isExpiring ? "#dc2626" : "var(--text-main)" }}>
                      {cert.courseId.toUpperCase()}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: isExpiring ? "#dc2626" : "var(--text-muted)" }}>
                      HH: {cert.expiryDate || "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BaseCard>

      {/* ── SPLIT PANE MODAL ────────────────────────────────────── */}
      <BaseModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Quản lý Bằng cấp & Chứng chỉ"
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
                const cert = item as InternalTraining;
                const isSelected = idx === selectedIdx;
                const isExpiring = !!cert.expiryDate && new Date(cert.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                return (
                  <div
                    key={idx}
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
                        Khóa học: {cert.courseId.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: isSelected ? "rgba(255,255,255,0.75)" : isExpiring ? "#dc2626" : "var(--text-muted)",
                          marginTop: "2px",
                          fontWeight: isExpiring ? 600 : 400,
                        }}
                      >
                        {cert.expiryDate ? `HH: ${cert.expiryDate}` : cert.completionDate || "Chưa có ngày"}
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
                      Khóa học {selected.courseId.toUpperCase()}
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

                  <BaseSelect
                    label="Khóa đào tạo"
                    defaultValue={selected.courseId}
                    options={[
                      { label: "Cấp cứu cơ bản (CPR)", value: "cpr" },
                      { label: "Sa sút trí tuệ (Dementia)", value: "dementia" },
                      { label: "Kiểm soát nhiễm khuẩn (IPC)", value: "ipc" },
                      { label: "Kỹ năng nâng đỡ (Manual Handling)", value: "manual_handling" },
                      { label: "VSATTP", value: "food_safety" },
                    ]}
                    onChange={(e) => updateItem<InternalTraining>(selectedIdx, "courseId", e.target.value)}
                  />
                  <BaseInput
                    label="Ngày hoàn thành"
                    type="date"
                    value={selected.completionDate}
                    onChange={(e: any) => updateItem<InternalTraining>(selectedIdx, "completionDate", e.target.value)}
                  />
                  <BaseInput
                    label="Ngày hết hạn"
                    type="date"
                    value={selected.expiryDate || ""}
                    onChange={(e: any) => updateItem<InternalTraining>(selectedIdx, "expiryDate", e.target.value)}
                  />
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
    </>
  );
};
