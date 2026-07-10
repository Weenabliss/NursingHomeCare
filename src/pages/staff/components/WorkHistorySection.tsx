import React from "react";
import { useTranslation } from "react-i18next";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { BaseTimeline } from "../../../components/molecules/BaseTimeline";
import { useFormModal } from "../../../hooks/useFormModal";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

export const WorkHistorySection: React.FC<{ staff: Staff }> = ({ staff }) => {
  const { t } = useTranslation();
  const { isOpen, isDirty, localData, setLocalData, openModal, closeModal, markDirty } = useFormModal(staff.workHistory);

  return (
    <>
      <BaseCard
        isSelected={isOpen}
        onClick={openModal}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <h3 className={styles.infoSectionTitle}>Quá trình công tác</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem", flex: 1, maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
          {staff.workHistory.map((history, idx, arr) => (
            <div key={history.id} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative", paddingBottom: idx === arr.length - 1 ? "0" : "1.5rem" }}>

              {/* Vertical Line */}
              {idx !== arr.length - 1 && (
                <div style={{ position: "absolute", left: "139px", top: "14px", height: "100%", width: "2px", backgroundColor: "#e2e8f0" }}></div>
              )}

              {/* LEFT COLUMN: Floating Dates */}
              <div
                style={{
                  width: "110px",
                  flexShrink: 0,
                  textAlign: "right",
                  paddingTop: "2px"
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>
                  {history.startDate}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px", fontWeight: 500 }}>
                  {history.endDate ? `Đến ${history.endDate}` : "Hiện tại"}
                </div>
              </div>

              {/* TIMELINE NODE: Glowing Circle */}
              <div style={{
                position: "relative",
                marginTop: "8px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
                boxShadow: "0 0 0 4px #e0e7ff",
                flexShrink: 0,
                zIndex: 1
              }}></div>

              {/* RIGHT COLUMN: Sleek Card */}
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
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "default"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                      {history.role}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Bộ phận trực thuộc: <span style={{ fontWeight: 500, color: "var(--text-main)" }}>{history.department}</span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "16px",
                    backgroundColor: "#e0e7ff",
                    color: "var(--primary-dark)"
                  }}>
                    Đã ghi nhận
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      <BaseModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Quá trình công tác"
        confirmText={t("common.save")}
        onConfirm={closeModal}
        isDirty={isDirty}
        maxWidth="600px"
      >
        <BaseTimeline>
          {localData.map((history, idx, arr) => (
            <BaseTimeline.Item key={history.id} isLast={idx === arr.length - 1}>
                {/* Row 1 */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
                  <div style={{ width: "160px" }}>
                    <BaseInput label="Từ ngày" type="date" defaultValue={history.startDate} onChange={markDirty} />
                  </div>
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <BaseSelect
                      label="Phòng ban"
                      defaultValue={history.department}
                      options={[
                        { label: "Khoa Y Tế", value: "Khoa Y Tế" },
                        { label: "Tổ Điều Dưỡng", value: "Tổ Điều Dưỡng" },
                        { label: "Phòng Hành Chính", value: "Phòng Hành Chính" },
                        { label: "Kế Toán", value: "Kế Toán" },
                        { label: "Bảo Vệ", value: "Bảo Vệ" },
                        { label: "Tổ Bếp", value: "Tổ Bếp" },
                      ]}
                      onChange={markDirty}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
                  <div style={{ width: "160px" }}>
                    <BaseInput label="Đến ngày" type="date" defaultValue={history.endDate || ""} onChange={markDirty} />
                  </div>
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <BaseSelect
                      label="Chức vụ"
                      defaultValue={history.role}
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
                      onChange={markDirty}
                    />
                  </div>
                </div>
            </BaseTimeline.Item>
          ))}
          <BaseButton
            variant="outline"
            style={{ alignSelf: "flex-start", marginTop: "1.5rem", marginLeft: "36px" }}
            onClick={() => {
              setLocalData([...localData, { id: `new-${Date.now()}`, role: "", department: "", startDate: "" }]);
              markDirty();
            }}
          >
            + Thêm mới
          </BaseButton>
        </BaseTimeline>
      </BaseModal>
    </>
  );
};
