import React from "react";
import { UserPlus, Clock, CheckCircle } from "lucide-react";
import { BaseButton } from "../../../shared/components/BaseButton";
import { useAllCandidates, useUpdateCandidateStatus } from "../../../modules/hr/hooks/useRecruitmentQuery";
import type { CandidateStatus } from "../../../modules/hr/types";

const BOARD_COLUMNS: { id: CandidateStatus; title: string; color: string }[] = [
  { id: "new", title: "Mới ứng tuyển", color: "#64748b" },
  { id: "screening", title: "Lọc CV", color: "#0ea5e9" },
  { id: "interviewing", title: "Phỏng vấn", color: "#f59e0b" },
  { id: "offered", title: "Gửi Offer", color: "#8b5cf6" },
  { id: "hired", title: "Nhận việc", color: "#10b981" },
  { id: "rejected", title: "Từ chối", color: "#ef4444" },
];

export const RecruitmentPage: React.FC = () => {
  const { data: candidates, isLoading } = useAllCandidates();
  const { mutate: updateStatus } = useUpdateCandidateStatus();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("candidateId", id);
  };

  const handleDrop = (e: React.DragEvent, status: CandidateStatus) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData("candidateId");
    if (candidateId) {
      updateStatus({ id: candidateId, status });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div style={{ padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "var(--text-main)" }}>Tuyển dụng (ATS)</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-muted)" }}>Quản lý ứng viên và quy trình tuyển dụng</p>
        </div>
        <BaseButton variant="primary">
          <UserPlus size={16} /> Thêm Ứng viên
        </BaseButton>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        flex: 1, 
        overflowX: "auto", 
        paddingBottom: "1rem",
        alignItems: "flex-start"
      }}>
        {BOARD_COLUMNS.map(column => {
          const colCandidates = candidates?.filter(c => c.status === column.id) || [];
          
          return (
            <div 
              key={column.id}
              onDrop={(e) => handleDrop(e, column.id)}
              onDragOver={handleDragOver}
              style={{
                minWidth: "280px",
                width: "280px",
                backgroundColor: "#f8fafc",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--border)",
                maxHeight: "100%"
              }}
            >
              <div style={{ 
                padding: "1rem", 
                borderBottom: "1px solid var(--border)", 
                borderTop: `4px solid ${column.color}`,
                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{column.title}</div>
                <div style={{ 
                  backgroundColor: "#e2e8f0", 
                  color: "#475569", 
                  padding: "2px 8px", 
                  borderRadius: "12px", 
                  fontSize: "0.8rem", 
                  fontWeight: 700 
                }}>
                  {colCandidates.length}
                </div>
              </div>

              <div style={{ 
                padding: "1rem", 
                display: "flex", 
                flexDirection: "column", 
                gap: "0.75rem",
                overflowY: "auto",
                flex: 1
              }}>
                {colCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={(e: React.DragEvent) => handleDragStart(e, candidate.id!)}
                    onDoubleClick={() => updateStatus({ id: candidate.id!, status: "hired" })}
                    style={{ 
                      padding: "1rem", 
                      cursor: "grab",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      border: "1px solid var(--border)",
                      backgroundColor: "#fff",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text-main)", marginBottom: "0.25rem" }}>
                      {candidate.fullName}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 500, marginBottom: "0.5rem" }}>
                      {candidate.appliedPosition}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} /> Cập nhật: {candidate.appliedAt?.split("T")[0] || "N/A"}
                    </div>
                    {candidate.status === "hired" && (
                      <div style={{ marginTop: "0.5rem", padding: "4px 8px", backgroundColor: "#dcfce7", color: "#16a34a", borderRadius: "4px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                        <CheckCircle size={12} /> Đã sinh mã NV mới
                      </div>
                    )}
                  </div>
                ))}
                
                {colCandidates.length === 0 && (
                  <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-tertiary)", fontSize: "0.85rem", border: "2px dashed var(--border)", borderRadius: "var(--radius-md)" }}>
                    Kéo thả ứng viên vào đây
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecruitmentPage;
