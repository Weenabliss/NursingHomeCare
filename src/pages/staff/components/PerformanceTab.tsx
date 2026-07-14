import React, { useState } from "react";
import { Star, AlertTriangle, FileText, CheckCircle, Plus } from "lucide-react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { BaseButton } from "../../../shared/components/BaseButton";
import { useStaffReviews, useStaffIncidents } from "../../../modules/hr/hooks/usePerformanceQuery";
import type { Staff, MedicalIncident } from "../../../modules/hr/types";

interface PerformanceTabProps {
  staff: Staff;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ staff }) => {
  const { data: reviews, isLoading: isLoadingReviews } = useStaffReviews(staff.personal.id || "");
  const { data: incidents, isLoading: isLoadingIncidents } = useStaffIncidents(staff.personal.id || "");

  const [activeView, setActiveView] = useState<"reviews" | "incidents">("reviews");

  const getIncidentSeverityBadge = (severity: MedicalIncident["severity"]) => {
    switch (severity) {
      case "low": return <span style={{ color: "#0369a1", backgroundColor: "#e0f2fe", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Nhẹ</span>;
      case "medium": return <span style={{ color: "#b45309", backgroundColor: "#fef3c7", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Trung bình</span>;
      case "high": return <span style={{ color: "#b91c1c", backgroundColor: "#fecaca", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Nghiêm trọng</span>;
      case "critical": return <span style={{ color: "#7f1d1d", backgroundColor: "#fca5a5", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Đặc biệt nghiêm trọng</span>;
    }
  };

  const getIncidentTypeLabel = (type: MedicalIncident["type"]) => {
    switch (type) {
      case "medication_error": return "Sai sót thuốc";
      case "fall": return "Sự cố té ngã";
      case "protocol_violation": return "Vi phạm quy trình";
      case "other": return "Khác";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <BaseCard style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#fdf4ff", borderColor: "#f5d0fe" }}>
          <Star size={40} color="#c026d3" />
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>Điểm đánh giá trung bình</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#c026d3" }}>
              {reviews?.length ? (reviews.reduce((sum, r) => sum + (r.overallScore || 0), 0) / reviews.length).toFixed(1) : "—"} / 5.0
            </div>
          </div>
        </BaseCard>

        <BaseCard style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
          <AlertTriangle size={40} color="#dc2626" />
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>Sự cố y khoa ghi nhận</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#dc2626" }}>
              {incidents?.length || 0} <span style={{ fontSize: "1rem", fontWeight: 500 }}>sự cố</span>
            </div>
          </div>
        </BaseCard>
      </div>

      <BaseCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setActiveView("reviews")}
              style={{
                background: "none", border: "none", padding: "0.5rem 0", cursor: "pointer",
                fontWeight: activeView === "reviews" ? 600 : 400,
                color: activeView === "reviews" ? "var(--primary)" : "var(--text-muted)",
                borderBottom: activeView === "reviews" ? "2px solid var(--primary)" : "2px solid transparent"
              }}
            >
              Lịch sử Đánh giá
            </button>
            <button
              onClick={() => setActiveView("incidents")}
              style={{
                background: "none", border: "none", padding: "0.5rem 0", cursor: "pointer",
                fontWeight: activeView === "incidents" ? 600 : 400,
                color: activeView === "incidents" ? "var(--primary)" : "var(--text-muted)",
                borderBottom: activeView === "incidents" ? "2px solid var(--primary)" : "2px solid transparent"
              }}
            >
              Sự cố Y khoa
            </button>
          </div>
          <BaseButton variant="primary">
            <Plus size={16} /> {activeView === "reviews" ? "Tạo đánh giá" : "Ghi nhận sự cố"}
          </BaseButton>
        </div>

        {activeView === "reviews" && (
          <div>
            {isLoadingReviews ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải...</div>
            ) : reviews?.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ fontWeight: 600, color: "var(--primary)", fontSize: "1.1rem" }}>{r.periodLabel}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f0fdf4", color: "#16a34a", padding: "4px 12px", borderRadius: "16px", fontWeight: 700 }}>
                        <Star size={16} fill="#16a34a" /> {r.overallScore?.toFixed(2)} / 5
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "var(--radius-sm)" }}>
                      {r.criteria.map((c, i) => (
                        <div key={i}>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.name}</div>
                          <div style={{ fontWeight: 600, fontSize: "1rem" }}>{c.score} / 5</div>
                        </div>
                      ))}
                    </div>
                    {r.feedback && (
                      <div style={{ marginTop: "1rem", fontSize: "0.9rem", fontStyle: "italic", color: "var(--text-main)" }}>
                        "{r.feedback}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                <CheckCircle size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
                <p>Chưa có đánh giá hiệu suất nào.</p>
              </div>
            )}
          </div>
        )}

        {activeView === "incidents" && (
          <div>
            {isLoadingIncidents ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải...</div>
            ) : incidents?.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "0.75rem" }}>Ngày</th>
                    <th style={{ padding: "0.75rem" }}>Loại sự cố</th>
                    <th style={{ padding: "0.75rem" }}>Mức độ</th>
                    <th style={{ padding: "0.75rem" }}>Mô tả</th>
                    <th style={{ padding: "0.75rem" }}>Xử lý</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(i => (
                    <tr key={i.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "0.75rem", fontWeight: 500 }}>{i.date}</td>
                      <td style={{ padding: "0.75rem", fontWeight: 600 }}>{getIncidentTypeLabel(i.type)}</td>
                      <td style={{ padding: "0.75rem" }}>{getIncidentSeverityBadge(i.severity)}</td>
                      <td style={{ padding: "0.75rem", color: "var(--text-main)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.description}</td>
                      <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>{i.resolution || "Chưa xử lý"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                <FileText size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
                <p>Không có sự cố y khoa nào được ghi nhận.</p>
              </div>
            )}
          </div>
        )}
      </BaseCard>
    </div>
  );
};
