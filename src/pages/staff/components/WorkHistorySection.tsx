import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Briefcase, Trash2 } from "lucide-react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { useFormModal } from "../../../hooks/useFormModal";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

type WorkHistory = Staff["workHistory"][number];

export const WorkHistorySection: React.FC<{ staff: Staff }> = ({ staff }) => {
  const { t } = useTranslation();
  const { isOpen, isDirty, localData, setLocalData, openModal, closeModal, markDirty, updateItem } =
    useFormModal(staff.workHistory);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const selected = localData[selectedIdx] as WorkHistory | undefined;

  const handleAddNew = () => {
    const newItem: WorkHistory = {
      id: `new-${Date.now()}`,
      role: "",
      department: "",
      startDate: "",
    };
    const newData = [...localData, newItem];
    setLocalData(newData);
    setSelectedIdx(newData.length - 1);
    markDirty();
    setTimeout(() => {
      const el = document.getElementById("work-history-list");
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
        <h3 className={styles.infoSectionTitle}>Quá trình công tác</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-sm)",
            marginTop: "var(--spacing-sm)",
            flex: 1,
            overflowY: "auto",
            paddingRight: "4px",
            minHeight: 0,
          }}
        >
          {staff.workHistory.map((history, idx, arr) => (
            <div
              key={history.id}
              style={{
                display: "flex",
                gap: "var(--spacing-lg)",
                alignItems: "flex-start",
                position: "relative",
                paddingBottom: idx === arr.length - 1 ? "0" : "var(--spacing-lg)",
              }}
            >
              {idx !== arr.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "139px",
                    top: "14px",
                    height: "100%",
                    width: "2px",
                    backgroundColor: "#e2e8f0",
                  }}
                />
              )}
              <div style={{ width: "110px", flexShrink: 0, textAlign: "right", paddingTop: "2px" }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>
                  {history.startDate}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px", fontWeight: 500 }}>
                  {history.endDate ? `Đến ${history.endDate}` : "Hiện tại"}
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  marginTop: "8px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary)",
                  boxShadow: "0 0 0 4px #e0e7ff",
                  flexShrink: 0,
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>{history.role}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Bộ phận trực thuộc:{" "}
                      <span style={{ fontWeight: 500, color: "var(--text-main)" }}>{history.department}</span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "16px",
                      backgroundColor: "#e0e7ff",
                      color: "var(--primary-dark)",
                    }}
                  >
                    Đã ghi nhận
                  </span>
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
        title="Quá trình công tác"
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
            }}
          >
            {/* List items */}
            <div id="work-history-list" style={{ flex: 1, overflowY: "auto", padding: "0.75rem", minHeight: 0, scrollBehavior: "smooth" }}>
              {localData.map((item, idx) => {
                const h = item as WorkHistory;
                const isSelected = idx === selectedIdx;
                return (
                  <div
                    key={h.id}
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
                      color: isSelected ? "#ffffff" : "var(--text-main)",
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
                      <Briefcase size={16} />
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
                        {h.role || "Chưa đặt tên"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: isSelected ? "rgba(255,255,255,0.75)" : "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {h.startDate || "Chưa có ngày"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add new button at bottom */}
            <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)" }}>
              <BaseButton variant="outline" style={{ width: "100%" }} onClick={handleAddNew}>
                <Plus size={15} style={{ marginRight: "6px" }} />
                Thêm giai đoạn mới
              </BaseButton>
            </div>
          </div>

          {/* ── RIGHT PANE: Detail Form ── */}
          <div style={{ flex: 1, padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", gap: "var(--spacing-md)", overflowY: "auto", minHeight: 0 }}>
            {selected ? (
              <>
                {/* Section label */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                      {selected.role || "Giai đoạn " + (selectedIdx + 1)}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Chỉnh sửa thông tin giai đoạn công tác
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

                {/* Form fields in 2-col grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <BaseInput
                    label="Từ ngày"
                    type="date"
                    defaultValue={selected.startDate}
                    onChange={(e: any) => updateItem<WorkHistory>(selectedIdx, "startDate", e.target.value)}
                  />
                  <BaseInput
                    label="Đến ngày"
                    type="date"
                    defaultValue={selected.endDate || ""}
                    onChange={(e: any) => updateItem<WorkHistory>(selectedIdx, "endDate", e.target.value)}
                  />
                  <BaseSelect
                    label="Phòng ban"
                    defaultValue={selected.department}
                    options={[
                      { label: "Khoa Y Tế", value: "Khoa Y Tế" },
                      { label: "Tổ Điều Dưỡng", value: "Tổ Điều Dưỡng" },
                      { label: "Phòng Hành Chính", value: "Phòng Hành Chính" },
                      { label: "Kế Toán", value: "Kế Toán" },
                      { label: "Bảo Vệ", value: "Bảo Vệ" },
                      { label: "Tổ Bếp", value: "Tổ Bếp" },
                    ]}
                    onChange={(e: any) => updateItem<WorkHistory>(selectedIdx, "department", e.target.value)}
                  />
                  <BaseSelect
                    label="Chức vụ"
                    defaultValue={selected.role}
                    options={[
                      { label: "Bác Sĩ", value: "Bác Sĩ" },
                      { label: "Điều Dưỡng", value: "Điều Dưỡng" },
                      { label: "Lễ Tân", value: "Lễ Tân" },
                      { label: "Nhân Sự", value: "Nhân Sự" },
                      { label: "Kế Toán Viên", value: "Kế Toán Viên" },
                      { label: "Bảo Vệ Viên", value: "Bảo Vệ Viên" },
                      { label: "Đầu Bếp", value: "Đầu Bếp" },
                      { label: "Điều dưỡng viên bậc 1", value: "Điều dưỡng viên bậc 1" },
                      { label: "Điều dưỡng viên bậc 2", value: "Điều dưỡng viên bậc 2" },
                      { label: "Phó tổ trưởng tổ Điều dưỡng", value: "Phó tổ trưởng tổ Điều dưỡng" },
                      { label: "Thực tập sinh", value: "Thực tập sinh" },
                      { label: "Nhân viên thử việc", value: "Nhân viên thử việc" },
                    ]}
                    onChange={(e: any) => updateItem<WorkHistory>(selectedIdx, "role", e.target.value)}
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
                <Briefcase size={36} strokeWidth={1.5} />
                <p style={{ margin: 0 }}>Nhấn "+ Thêm giai đoạn mới" để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </BaseModal>
    </>
  );
};
