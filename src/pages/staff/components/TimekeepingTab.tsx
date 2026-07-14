import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Activity, CheckCircle, XCircle } from "lucide-react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { BaseButton } from "../../../shared/components/BaseButton";
import { useAttendanceSummary, useAttendanceByStaff } from "../../../modules/hr/hooks/useAttendanceQuery";
import type { Staff } from "../../../modules/hr/types";


interface TimekeepingTabProps {
  staff: Staff;
}

export const TimekeepingTab: React.FC<TimekeepingTabProps> = ({ staff }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const { data: summary, isLoading: isLoadingSummary } = useAttendanceSummary(staff.personal.id || "", currentMonth, currentYear);
  const { data: records, isLoading: isLoadingRecords } = useAttendanceByStaff(staff.personal.id || "");

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const monthRecords = records?.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Month Navigation & Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <BaseButton variant="outline" onClick={handlePrevMonth} style={{ padding: "0.5rem" }}>
            <ChevronLeft size={20} />
          </BaseButton>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600, minWidth: "150px", textAlign: "center" }}>
            Tháng {currentMonth}/{currentYear}
          </h3>
          <BaseButton variant="outline" onClick={handleNextMonth} style={{ padding: "0.5rem" }}>
            <ChevronRight size={20} />
          </BaseButton>
        </div>
        <div>
          <BaseButton variant="primary">
            <Clock size={16} /> Import Excel
          </BaseButton>
        </div>
      </div>

      {isLoadingSummary ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải dữ liệu chấm công...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            <BaseCard style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <CheckCircle size={32} color="#16a34a" />
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Số công làm việc</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16a34a" }}>{summary?.totalPresentDays || 0}</div>
              </div>
            </BaseCard>
            
            <BaseCard style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#fef2f2", borderColor: "#fecdd3" }}>
              <XCircle size={32} color="#dc2626" />
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Vắng mặt</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#dc2626" }}>{summary?.totalAbsentDays || 0}</div>
              </div>
            </BaseCard>

            <BaseCard style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#fffbeb", borderColor: "#fde68a" }}>
              <Clock size={32} color="#d97706" />
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Đi muộn/Về sớm</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#d97706" }}>{summary?.totalLateMinutes || 0} <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>phút</span></div>
              </div>
            </BaseCard>

            <BaseCard style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#f5f3ff", borderColor: "#ddd6fe" }}>
              <Activity size={32} color="#7c3aed" />
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Tăng ca / Trực đêm</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#7c3aed" }}>
                  {summary?.totalOvertimeHours || 0}h / {summary?.totalNightShifts || 0}
                </div>
              </div>
            </BaseCard>
          </div>

          <BaseCard>
            <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem" }}>Chi tiết lịch sử chấm công</h4>
            {isLoadingRecords ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải...</div>
            ) : monthRecords?.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "0.75rem" }}>Ngày</th>
                    <th style={{ padding: "0.75rem" }}>Ca làm việc</th>
                    <th style={{ padding: "0.75rem" }}>Check-in</th>
                    <th style={{ padding: "0.75rem" }}>Check-out</th>
                    <th style={{ padding: "0.75rem" }}>Trạng thái</th>
                    <th style={{ padding: "0.75rem" }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {monthRecords.map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "0.75rem", fontWeight: 500 }}>{r.date}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600,
                          backgroundColor: r.shift === "morning" ? "#e0f2fe" : r.shift === "afternoon" ? "#fef3c7" : r.shift === "night" ? "#ede9fe" : "#f1f5f9",
                          color: r.shift === "morning" ? "#0369a1" : r.shift === "afternoon" ? "#b45309" : r.shift === "night" ? "#6d28d9" : "#475569"
                        }}>
                          {r.shift === "morning" ? "Ca sáng" : r.shift === "afternoon" ? "Ca chiều" : r.shift === "night" ? "Ca đêm" : "Hành chính"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", color: r.lateMinutes > 0 ? "#dc2626" : "var(--text-main)" }}>
                        {r.checkInTime || "—"} {r.lateMinutes > 0 && `(Muộn ${r.lateMinutes}p)`}
                      </td>
                      <td style={{ padding: "0.75rem", color: r.earlyLeaveMinutes > 0 ? "#dc2626" : "var(--text-main)" }}>
                        {r.checkOutTime || "—"} {r.earlyLeaveMinutes > 0 && `(Sớm ${r.earlyLeaveMinutes}p)`}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600,
                          backgroundColor: r.status === "present" ? "#dcfce7" : r.status === "late" ? "#fef08a" : r.status === "absent" ? "#fecaca" : "#e2e8f0",
                          color: r.status === "present" ? "#15803d" : r.status === "late" ? "#a16207" : r.status === "absent" ? "#b91c1c" : "#475569"
                        }}>
                          {r.status === "present" ? "Đúng giờ" : r.status === "late" ? "Đi muộn" : r.status === "absent" ? "Vắng mặt" : "Nghỉ phép"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>{r.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                Không có dữ liệu chấm công tháng này
              </div>
            )}
          </BaseCard>
        </>
      )}
    </div>
  );
};
