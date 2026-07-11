import React from "react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { getTimekeepingStatusBadge } from "../../../components/atoms/BaseBadge";
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
          {/* Header row */}
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
                {/* Status badge via helper — no more repeated inline spans */}
                <div>{getTimekeepingStatusBadge(log.status)}</div>
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
