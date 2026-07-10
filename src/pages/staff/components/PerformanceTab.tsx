import React from "react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

interface PerformanceTabProps {
  staff: Staff;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ staff }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <BaseCard>
        <h3 className={styles.infoSectionTitle}>Lịch sử hoạt động</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
          {staff.activities.map((act) => (
            <div
              key={act.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", minWidth: "120px" }}>
                {act.date}
              </div>
              <div style={{ flex: 1, fontSize: "0.95rem", color: "var(--text-main)" }}>{act.description}</div>
              <div>
                {act.type === "system" && (
                  <span
                    style={{
                      backgroundColor: "#f3f4f6",
                      color: "#4b5563",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Hệ thống
                  </span>
                )}
                {act.type === "audit" && (
                  <span
                    style={{
                      backgroundColor: "#e0e7ff",
                      color: "#4f46e5",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Hồ sơ
                  </span>
                )}
                {act.type === "performance" && (
                  <span
                    style={{
                      backgroundColor: "#fef9c3",
                      color: "#ca8a04",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Thành tích
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
};
