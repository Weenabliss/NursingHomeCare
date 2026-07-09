import React from "react";
import { Calendar, AlertTriangle, Users, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { BaseButton } from "../components/atoms/BaseButton";
import { PageHeader } from "../components/molecules/PageHeader";

const Schedule: React.FC = () => {
  // Mock data representing Rostering business logic
  const days = [
    "Thứ 2 (12/08)",
    "Thứ 3 (13/08)",
    "Thứ 4 (14/08)",
    "Thứ 5 (15/08)",
    "Thứ 6 (16/08)",
    "Thứ 7 (17/08)",
    "CN (18/08)",
  ];

  const rosterData = [
    {
      staff: "Nguyễn Văn A (BS)",
      schedule: [
        { shift: "SÁNG", type: "morning" },
        { shift: "CHIỀU", type: "afternoon" },
        { shift: "OFF", type: "off" },
        { shift: "SÁNG", type: "morning" },
        { shift: "CHIỀU", type: "afternoon" },
        { shift: "SÁNG", type: "morning" },
        { shift: "OFF", type: "off" },
      ],
    },
    {
      staff: "Trần Thị Bé (ĐD)",
      schedule: [
        { shift: "ĐÊM", type: "night" },
        { shift: "SÁNG", type: "warning" }, // Violation: Night shift followed immediately by Morning shift
        { shift: "OFF", type: "off" },
        { shift: "ĐÊM", type: "night" },
        { shift: "OFF", type: "off" },
        { shift: "CHIỀU", type: "afternoon" },
        { shift: "ĐÊM", type: "night" },
      ],
    },
    {
      staff: "Lê Hoàng C (LT)",
      schedule: [
        { shift: "SÁNG", type: "morning" },
        { shift: "SÁNG", type: "morning" },
        { shift: "SÁNG", type: "morning" },
        { shift: "SÁNG", type: "morning" },
        { shift: "SÁNG", type: "morning" },
        { shift: "OFF", type: "off" },
        { shift: "OFF", type: "off" },
      ],
    },
  ];

  const getShiftColor = (type: string) => {
    switch (type) {
      case "morning":
        return { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" }; // Light blue
      case "afternoon":
        return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" }; // Yellow/Amber
      case "night":
        return { bg: "#ede9fe", color: "#5b21b6", border: "#ddd6fe" }; // Purple
      case "warning":
        return { bg: "#fee2e2", color: "#b91c1c", border: "#f87171" }; // Red violation
      default:
        return { bg: "#f1f5f9", color: "#94a3b8", border: "#e2e8f0" }; // Off
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Xếp Ca Trực (Rostering)"
        subtitle="Hệ thống tự động phát hiện vi phạm luật lao động & thời gian nghỉ ngơi."
        actions={
          <>
            <BaseButton variant="outline">
              <Filter size={18} /> Lọc
            </BaseButton>
            <BaseButton variant="primary">
              <Calendar size={18} />
              Tự động xếp ca
            </BaseButton>
          </>
        }
      />

      {/* Date Navigator & Legend */}
      <div
        className="card-25d"
        style={{
          padding: "var(--spacing-md)",
          marginBottom: "var(--spacing-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <BaseButton variant="outline">
            <ChevronLeft size={18} />
          </BaseButton>
          <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>Tuần 33 (12/08 - 18/08)</span>
          <BaseButton variant="outline">
            <ChevronRight size={18} />
          </BaseButton>
        </div>

        <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: "#e0f2fe",
              }}
            ></div>{" "}
            Ca Sáng (06h-14h)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: "#fef3c7",
              }}
            ></div>{" "}
            Ca Chiều (14h-22h)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: "#ede9fe",
              }}
            ></div>{" "}
            Ca Đêm (22h-06h)
          </div>
        </div>
      </div>

      {/* Violation Banner */}
      <div
        style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          padding: "1rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "var(--spacing-lg)",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          color: "#991b1b",
        }}
      >
        <AlertTriangle size={24} style={{ marginTop: "2px" }} />
        <div>
          <span
            style={{
              fontSize: "var(--text-md)",
              fontWeight: 600,
              display: "block",
              marginBottom: "0.25rem",
            }}
          >
            Phát hiện lỗi Xếp Ca (Rostering Violation)
          </span>
          <span style={{ fontSize: "var(--text-sm)" }}>
            Nhân sự <strong>Trần Thị Bé</strong> được xếp Ca Đêm vào Thứ 2 (kết thúc lúc 06:00 Thứ 3), nhưng lại bị xếp
            tiếp Ca Sáng vào Thứ 3 (bắt đầu lúc 06:00). Việc xếp ca liên tục không có thời gian nghỉ ngơi bị cấm. Vui
            lòng điều chỉnh lại trước khi Công bố!
          </span>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="card-25d" style={{ overflowX: "auto", padding: 0 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "900px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "var(--background-alt)",
                borderBottom: "2px solid var(--border)",
              }}
            >
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  width: "200px",
                  fontWeight: 600,
                  color: "var(--text-main)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Users size={18} /> Nhân sự
                </div>
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    borderLeft: "1px solid var(--border)",
                  }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rosterData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                <td
                  style={{
                    padding: "1rem",
                    fontWeight: 500,
                    color: "var(--primary-dark)",
                  }}
                >
                  {row.staff}
                </td>
                {row.schedule.map((dayShift, sIdx) => {
                  const style = getShiftColor(dayShift.type);
                  return (
                    <td
                      key={sIdx}
                      style={{
                        padding: "0.5rem",
                        borderLeft: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: style.bg,
                          color: style.color,
                          border: `1px solid ${style.border}`,
                          padding: "0.5rem",
                          borderRadius: "var(--radius-sm)",
                          textAlign: "center",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          minHeight: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        {dayShift.shift}
                        {dayShift.type === "warning" && (
                          <AlertTriangle size={14} color="#b91c1c" style={{ position: "absolute", top: 4, right: 4 }} />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
