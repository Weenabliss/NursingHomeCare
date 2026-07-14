import React from "react";
import { ShieldAlert, Award, FileText, Plus } from "lucide-react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { BaseButton } from "../../../shared/components/BaseButton";
import { useStaffDiscipline } from "../../../modules/hr/hooks/useDisciplineQuery";
import type { Staff, DisciplineRecord } from "../../../modules/hr/types";
import { DisciplineModal } from "../../../modules/hr/components/DisciplineModal";

interface DisciplineTabProps {
  staff: Staff;
}

export const DisciplineTab: React.FC<DisciplineTabProps> = ({ staff }) => {
  const { data: records, isLoading } = useStaffDiscipline(staff.personal.id || "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getSeverityBadge = (severity: DisciplineRecord["severity"]) => {
    switch (severity) {
      case "low": return <span style={{ color: "#0369a1", backgroundColor: "#e0f2fe", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Nhắc nhở</span>;
      case "medium": return <span style={{ color: "#b45309", backgroundColor: "#fef3c7", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Khiển trách</span>;
      case "high": return <span style={{ color: "#b91c1c", backgroundColor: "#fecaca", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Cảnh cáo</span>;
      case "termination": return <span style={{ color: "#7f1d1d", backgroundColor: "#fca5a5", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Sa thải</span>;
      default: return null;
    }
  };

  const getRewardBadge = (type: DisciplineRecord["rewardType"]) => {
    switch (type) {
      case "bonus": return <span style={{ color: "#15803d", backgroundColor: "#dcfce7", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Thưởng tiền</span>;
      case "certificate": return <span style={{ color: "#0369a1", backgroundColor: "#e0f2fe", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Bằng khen</span>;
      case "promotion": return <span style={{ color: "#6d28d9", backgroundColor: "#ede9fe", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Thăng chức</span>;
      default: return <span style={{ color: "#475569", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Khác</span>;
    }
  };

  const rewards = records?.filter(r => r.type === "reward") || [];
  const violations = records?.filter(r => r.type === "violation") || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <BaseCard style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <Award size={40} color="#16a34a" />
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>Khen thưởng</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#16a34a" }}>
              {rewards.length} <span style={{ fontSize: "1rem", fontWeight: 500 }}>lần</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
          <ShieldAlert size={40} color="#dc2626" />
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>Vi phạm kỷ luật</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#dc2626" }}>
              {violations.length} <span style={{ fontSize: "1rem", fontWeight: 500 }}>lần</span>
            </div>
          </div>
        </BaseCard>
      </div>

      <BaseCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Hồ sơ Khen thưởng / Kỷ luật</h3>
          <BaseButton variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Thêm Quyết định
          </BaseButton>
        </div>

        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải...</div>
        ) : records?.length ? (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th style={{ padding: "0.75rem" }}>Ngày QĐ</th>
                <th style={{ padding: "0.75rem" }}>Loại</th>
                <th style={{ padding: "0.75rem" }}>Hình thức</th>
                <th style={{ padding: "0.75rem" }}>Lý do</th>
                <th style={{ padding: "0.75rem" }}>Xử lý / Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border)", backgroundColor: r.type === "reward" ? "#f8fafc" : "#fff" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 500 }}>{r.date}</td>
                  <td style={{ padding: "0.75rem" }}>
                    {r.type === "reward" ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#16a34a", fontWeight: 600 }}><Award size={14}/> Khen thưởng</span>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#dc2626", fontWeight: 600 }}><ShieldAlert size={14}/> Kỷ luật</span>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {r.type === "reward" ? getRewardBadge(r.rewardType) : getSeverityBadge(r.severity)}
                  </td>
                  <td style={{ padding: "0.75rem", color: "var(--text-main)", maxWidth: "200px" }}>{r.reason}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ fontWeight: 600 }}>{r.actionTaken || "—"}</div>
                    {r.amount && <div style={{ color: r.type === "reward" ? "#16a34a" : "#dc2626", fontSize: "0.85rem" }}>{r.type === "reward" ? "+" : "-"}{formatCurrency(r.amount)}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <p>Không có hồ sơ khen thưởng hay kỷ luật.</p>
          </div>
        )}
      </BaseCard>

      <DisciplineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffId={staff.personal.id || ""}
      />
    </div>
  );
};
