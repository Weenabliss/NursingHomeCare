import React, { useState } from "react";

import { Plane, Calendar, Clock, FileText, Plus } from "lucide-react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { BaseButton } from "../../../shared/components/BaseButton";
import { useLeaveByStaff, useLeaveBalance } from "../../../modules/hr/hooks/useLeaveQuery";
import type { Staff, LeaveRequest } from "../../../modules/hr/types";
import { LeaveModal } from "../../../modules/hr/components/LeaveModal";

interface AttendanceTabProps {
  staff: Staff;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ staff }) => {
  const currentYear = new Date().getFullYear();
  const { data: balance, isLoading: isLoadingBalance } = useLeaveBalance(staff.personal.id || "", currentYear);
  const { data: leaves, isLoading: isLoadingLeaves } = useLeaveByStaff(staff.personal.id || "");

  const [activeView, setActiveView] = useState<"balance" | "history">("history");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "approved":
        return <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, backgroundColor: "#dcfce7", color: "#15803d" }}>Đã duyệt</span>;
      case "pending":
        return <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, backgroundColor: "#fef08a", color: "#a16207" }}>Chờ duyệt</span>;
      case "rejected":
        return <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, backgroundColor: "#fecaca", color: "#b91c1c" }}>Từ chối</span>;
      case "cancelled":
        return <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, backgroundColor: "#e2e8f0", color: "#475569" }}>Đã hủy</span>;
    }
  };

  const getTypeLabel = (type: LeaveRequest["type"]) => {
    switch (type) {
      case "annual_leave": return "Phép năm";
      case "sick_leave": return "Nghỉ ốm";
      case "maternity": return "Thai sản";
      case "unpaid_leave": return "Không lương";
      case "bereavement": return "Tang chế";
      case "marriage": return "Kết hôn";
      case "compensatory": return "Nghỉ bù";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Overview Cards */}
      {isLoadingBalance ? (
        <div>Đang tải...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          <BaseCard style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#f0f9ff", borderColor: "#bae6fd" }}>
            <Plane size={32} color="#0284c7" />
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Phép năm khả dụng</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0284c7" }}>
                {(balance?.annualTotal || 12) - (balance?.annualUsed || 0)} / {balance?.annualTotal || 12}
              </div>
            </div>
          </BaseCard>

          <BaseCard style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#fffbeb", borderColor: "#fde68a" }}>
            <Calendar size={32} color="#d97706" />
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Nghỉ ốm đã dùng</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#d97706" }}>{balance?.sickUsed || 0} ngày</div>
            </div>
          </BaseCard>

          <BaseCard style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#fdf4ff", borderColor: "#f5d0fe" }}>
            <Clock size={32} color="#c026d3" />
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Nghỉ bù khả dụng</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#c026d3" }}>
                {(balance?.compensatoryTotal || 0) - (balance?.compensatoryUsed || 0)} ngày
              </div>
            </div>
          </BaseCard>
        </div>
      )}

      {/* Main Content */}
      <BaseCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setActiveView("history")}
              style={{
                background: "none", border: "none", padding: "0.5rem 0", cursor: "pointer",
                fontWeight: activeView === "history" ? 600 : 400,
                color: activeView === "history" ? "var(--primary)" : "var(--text-muted)",
                borderBottom: activeView === "history" ? "2px solid var(--primary)" : "2px solid transparent"
              }}
            >
              Lịch sử xin nghỉ
            </button>
            <button
              onClick={() => setActiveView("balance")}
              style={{
                background: "none", border: "none", padding: "0.5rem 0", cursor: "pointer",
                fontWeight: activeView === "balance" ? 600 : 400,
                color: activeView === "balance" ? "var(--primary)" : "var(--text-muted)",
                borderBottom: activeView === "balance" ? "2px solid var(--primary)" : "2px solid transparent"
              }}
            >
              Cân đối phép
            </button>
          </div>
          <BaseButton variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Tạo đơn xin nghỉ
          </BaseButton>
        </div>

        {activeView === "history" && (
          <div>
            {isLoadingLeaves ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải...</div>
            ) : leaves?.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "0.75rem" }}>Thời gian</th>
                    <th style={{ padding: "0.75rem" }}>Loại phép</th>
                    <th style={{ padding: "0.75rem" }}>Số ngày</th>
                    <th style={{ padding: "0.75rem" }}>Lý do</th>
                    <th style={{ padding: "0.75rem" }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                        {l.startDate} đến {l.endDate}
                      </td>
                      <td style={{ padding: "0.75rem", color: "var(--text-main)" }}>{getTypeLabel(l.type)}</td>
                      <td style={{ padding: "0.75rem", color: "var(--text-main)" }}>{l.totalDays}</td>
                      <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>{l.reason}</td>
                      <td style={{ padding: "0.75rem" }}>{getStatusBadge(l.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                Chưa có đơn xin nghỉ phép nào
              </div>
            )}
          </div>
        )}

        {activeView === "balance" && (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <p>Sổ quỹ phép chi tiết đang được xây dựng...</p>
          </div>
        )}
      </BaseCard>

      <LeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffId={staff.personal.id || ""}
      />
    </div>
  );
};
