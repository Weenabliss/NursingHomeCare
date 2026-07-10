import React from "react";
import { Calendar, AlertTriangle, Filter } from "lucide-react";
import { BaseButton } from "../../components/atoms/BaseButton";
import { PageHeader } from "../../components/molecules/PageHeader";
import { ScheduleToolbar } from "./components/ScheduleToolbar";
import { WeekView } from "./components/WeekView";
import styles from "./Schedule.module.scss";

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
      <ScheduleToolbar />

      {/* Violation Banner */}
      <div className={styles.violationBanner}>
        <AlertTriangle size={24} className={styles.violationIcon} />
        <div>
          <span className={styles.violationTitle}>Phát hiện lỗi Xếp Ca (Rostering Violation)</span>
          <span className={styles.violationDesc}>
            Nhân sự <strong>Trần Thị Bé</strong> được xếp Ca Đêm vào Thứ 2 (kết thúc lúc 06:00 Thứ 3), nhưng lại bị xếp
            tiếp Ca Sáng vào Thứ 3 (bắt đầu lúc 06:00). Việc xếp ca liên tục không có thời gian nghỉ ngơi bị cấm. Vui
            lòng điều chỉnh lại trước khi Công bố!
          </span>
        </div>
      </div>

      {/* Roster Grid */}
      <WeekView days={days} rosterData={rosterData} getShiftColor={getShiftColor} />
    </div>
  );
};

export default Schedule;
