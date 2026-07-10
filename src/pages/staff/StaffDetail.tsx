import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contact, Briefcase, Banknote, LineChart, CalendarDays, Clock } from "lucide-react";
import { BaseTabs } from "../../components/atoms/BaseTabs";
import { BaseButton } from "../../components/atoms/BaseButton";
import { staffListMock } from "../../mock/staff";
import type { Staff } from "../../mock/staff";

// Components
import { StaffHeader } from "./components/StaffHeader";
import { PersonalTab } from "./components/PersonalTab";
import { JobTab } from "./components/JobTab";
import { PayrollTab } from "./components/PayrollTab";
import { PerformanceTab } from "./components/PerformanceTab";
import { AttendanceTab } from "./components/AttendanceTab";
import { TimekeepingTab } from "./components/TimekeepingTab";

import styles from "./StaffDetail.module.scss";

const StaffDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [activeTab, setActiveTab] = useState<string>("attendance");

  useEffect(() => {
    // In a real app, fetch data from API
    const foundStaff = staffListMock.find((s) => s.id === id);
    if (foundStaff) {
      setStaff(foundStaff);
    }
  }, [id]);

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff(updatedStaff);
  };

  if (!staff) {
    return (
      <div className={styles.container} style={{ alignItems: "center", justifyContent: "center" }}>
        <h2>Không tìm thấy nhân sự</h2>
        <BaseButton onClick={() => navigate("/hr/staff")}>Quay lại</BaseButton>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <StaffHeader staff={staff} onUpdateStaff={handleUpdateStaff} />

      {/* Main Content Section */}
      <div className={styles.mainContent}>
        <BaseTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "personal", label: "Cá nhân", icon: Contact },
            { value: "job", label: "Công việc", icon: Briefcase },
            { value: "payroll", label: "Lương thưởng", icon: Banknote },
            { value: "performance", label: "Hiệu suất", icon: LineChart },
            { value: "attendance", label: "Lịch làm việc", icon: CalendarDays },
            { value: "timekeeping", label: "Check-in/out", icon: Clock },
          ]}
        />

        <div className={styles.tabContent}>
          {activeTab === "personal" && <PersonalTab staff={staff} />}
          {activeTab === "job" && <JobTab staff={staff} />}
          {activeTab === "payroll" && <PayrollTab staff={staff} />}
          {activeTab === "performance" && <PerformanceTab staff={staff} />}
          {activeTab === "attendance" && <AttendanceTab staff={staff} />}
          {activeTab === "timekeeping" && <TimekeepingTab staff={staff} />}
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
