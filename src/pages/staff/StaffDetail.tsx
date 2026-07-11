import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contact, Briefcase, Banknote, LineChart, CalendarDays, Clock } from "lucide-react";
import { BaseTabs } from "../../components/atoms/BaseTabs";
import { BaseButton } from "../../components/atoms/BaseButton";
import { staffListMock } from "../../mock/staff";
import type { Staff } from "../../mock/staff";
import { useStaffContext } from "../../contexts/StaffContext";
import { useActivityLog } from "../../hooks/useActivityLog";

// Components
import { StaffHeader } from "./components/StaffHeader";
import { PersonalTab } from "./components/PersonalTab";
import { JobTab } from "./components/JobTab";
import { PayrollTab } from "./components/PayrollTab";
import { PerformanceTab } from "./components/PerformanceTab";
import { AttendanceTab } from "./components/AttendanceTab";
import { TimekeepingTab } from "./components/TimekeepingTab";

import styles from "./StaffDetail.module.scss";

// ─── Blank template dùng cho create mode ─────────────────────────────────────
const createBlankStaff = (): Staff => ({
  id: `NV${Date.now().toString().slice(-6)}`,
  name: "",
  email: "",
  phone: "",
  cccd: "",
  dob: "",
  gender: "male",
  department: "",
  position: "",
  joinDate: new Date().toISOString().split("T")[0],
  address: "",
  status: "active",
  age: 0,
  autoRoles: [],
  certWarning: false,
  avatar: `https://i.pravatar.cc/150?u=new_${Date.now()}`,
  emergencyContact: { name: "", relationship: "", phone: "" },
  contracts: [],
  certificates: [],
  workHistory: [],
  schedule: { month: new Date().getMonth() + 1, year: new Date().getFullYear(), days: [] },
  activities: [],
  timeLogs: [],
  allowances: [],
  bankAccount: { bankCode: "", accountNo: "" },
  historicalMainShifts: 0,
});

// ─── Component ────────────────────────────────────────────────────────────────
const StaffDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addStaff, updateStaff } = useStaffContext();
  const { log } = useActivityLog({ module: "staff" });

  const isCreateMode = id === "new";

  const [staff, setStaff] = useState<Staff | null>(() =>
    isCreateMode ? createBlankStaff() : null
  );
  const [activeTab, setActiveTab] = useState<string>("personal");

  useEffect(() => {
    if (isCreateMode) return;
    const found = staffListMock.find((s) => s.id === id);
    if (found) setStaff(found);
  }, [id, isCreateMode]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleUpdateStaff = (updated: Staff) => {
    setStaff(updated);
    if (!isCreateMode) {
      updateStaff(updated);
      log("update", `Cập nhật hồ sơ ${updated.id} - ${updated.name}`, { staffId: updated.id });
    }
  };

  const handleCreateStaff = (newStaff: Staff) => {
    addStaff(newStaff);
    log("create", `Tạo nhân viên mới: ${newStaff.name}`, { staffId: newStaff.id });
    navigate("/hr/staff");
  };

  // ── Not found ────────────────────────────────────────────────────────────────
  if (!isCreateMode && !staff) {
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
      <StaffHeader
        staff={staff!}
        onUpdateStaff={handleUpdateStaff}
        isCreateMode={isCreateMode}
        onCreateStaff={handleCreateStaff}
      />

      {/* Main Content – tabs vẫn hiển thị để có thể điền PersonalTab (SĐT, địa chỉ...) */}
      <div className={styles.mainContent}>
        <BaseTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "personal", label: "Cá nhân", icon: Contact },
            { value: "job", label: "Công việc", icon: Briefcase },
            ...(!isCreateMode
              ? [
                  { value: "payroll", label: "Lương thưởng", icon: Banknote },
                  { value: "performance", label: "Hiệu suất", icon: LineChart },
                  { value: "attendance", label: "Lịch làm việc", icon: CalendarDays },
                  { value: "timekeeping", label: "Check-in/out", icon: Clock },
                ]
              : []),
          ]}
        />

        <div className={styles.tabContent}>
          {activeTab === "personal" && <PersonalTab staff={staff!} />}
          {activeTab === "job" && <JobTab staff={staff!} />}
          {!isCreateMode && activeTab === "payroll" && <PayrollTab staff={staff!} />}
          {!isCreateMode && activeTab === "performance" && <PerformanceTab staff={staff!} />}
          {!isCreateMode && activeTab === "attendance" && <AttendanceTab staff={staff!} />}
          {!isCreateMode && activeTab === "timekeeping" && <TimekeepingTab staff={staff!} />}
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
