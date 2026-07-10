import React from "react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

interface TimekeepingTabProps {
  staff: Staff;
}

export const TimekeepingTab: React.FC<TimekeepingTabProps> = ({ staff }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <BaseCard>
        <h3 className={styles.infoSectionTitle}>Lịch sử quẹt thẻ (Check-in/out)</h3>

        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <div>Ngày</div>
            <div>Check In</div>
            <div>Check Out</div>
            <div>Trạng thái</div>
          </div>

          {staff.timeLogs &&
            staff.timeLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "0.95rem",
                }}
              >
                <div style={{ color: "var(--text-main)", fontWeight: 500 }}>{log.date}</div>

                <div style={{ color: log.checkIn === "--:--" ? "var(--text-muted)" : "var(--text-main)" }}>
                  {log.checkIn}
                </div>

                <div style={{ color: log.checkOut === "--:--" ? "var(--text-muted)" : "var(--text-main)" }}>
                  {log.checkOut}
                </div>

                <div>
                  {log.status === "on_time" && (
                    <span
                      style={{
                        backgroundColor: "#dcfce7",
                        color: "#16a34a",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Đúng giờ
                    </span>
                  )}
                  {log.status === "late" && (
                    <span
                      style={{
                        backgroundColor: "#ffedd5",
                        color: "#ea580c",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Đi muộn
                    </span>
                  )}
                  {log.status === "early" && (
                    <span
                      style={{
                        backgroundColor: "#fef08a",
                        color: "#854d0e",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Về sớm
                    </span>
                  )}
                  {log.status === "overtime" && (
                    <span
                      style={{
                        backgroundColor: "#e0e7ff",
                        color: "#4f46e5",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Tăng ca
                    </span>
                  )}
                  {log.status === "missing" && (
                    <span
                      style={{
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Vắng mặt
                    </span>
                  )}
                </div>
              </div>
            ))}

          {(!staff.timeLogs || staff.timeLogs.length === 0) && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              Không có dữ liệu chấm công.
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
};
