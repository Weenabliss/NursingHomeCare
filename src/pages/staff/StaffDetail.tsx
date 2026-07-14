import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contact, Briefcase, Banknote, LineChart, CalendarDays, Clock } from "lucide-react";
import { BaseTabs } from "../../shared/components/BaseTabs";
import { BaseButton } from "../../shared/components/BaseButton";
import type { Staff } from "../../modules/hr/types";
import { useStaffDetail, useCreateStaff, useUpdateStaff } from "../../modules/hr/hooks/useStaffQuery";
import { useActivityLog } from "../../shared/hooks/useActivityLog";

// Components
import { StaffHeader } from "./components/StaffHeader";
import { PersonalTab } from "./components/PersonalTab";
import { JobTab } from "./components/JobTab";
import { PayrollTab } from "./components/PayrollTab";
import { PerformanceTab } from "./components/PerformanceTab";
import { AttendanceTab } from "./components/AttendanceTab";
import { TimekeepingTab } from "./components/TimekeepingTab";
import { DisciplineTab } from "./components/DisciplineTab";

import styles from "./StaffDetail.module.scss";

// ─── Blank template dùng cho create mode ─────────────────────────────────────
const createBlankStaff = (): Staff => ({
  personal: {
    code: `NV${Date.now().toString().slice(-6)}`,
    fullName: "",
    dob: "2000-01-01",
    gender: "male",
    nationalId: "",
    hometown: "",
    currentAddress: "",
    religion: "Không",
    maritalStatus: "single",
    hasSmallChildren: false,
    phone: "",
  },
  emergencyContacts: [],
  employment: {
    status: "active",
    joinDate: new Date().toISOString().split("T")[0],
    departmentId: "DEPT_NURSING",
    jobTitle: "",
    zoneAccess: [],
    canDoNightShift: true,
    maxNightShiftsPerWeek: 3,
  },
  contracts: [],
  medicalCredentials: {
    practicingCert: null,
    internalTrainings: [],
  },
  allowances: [],
  assets: [],
});

// ─── Component ────────────────────────────────────────────────────────────────
const StaffDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { log } = useActivityLog({ module: "staff" });
  const isCreateMode = !id || id === "new";

  const { data: serverStaff, isLoading } = useStaffDetail(isCreateMode ? undefined : id);
  const { mutate: createStaff } = useCreateStaff();
  const { mutate: updateStaffData } = useUpdateStaff();

  const [staff, setStaff] = useState<Staff | null>(() =>
    isCreateMode ? createBlankStaff() : null
  );
  const [activeTab, setActiveTab] = useState<string>("personal");

  useEffect(() => {
    if (serverStaff && !isCreateMode) {
      setStaff(serverStaff);
    }
  }, [serverStaff, isCreateMode]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleUpdateStaff = (updated: Staff) => {
    setStaff(updated);
    if (!isCreateMode && updated.personal.id) {
      updateStaffData({ id: updated.personal.id, data: updated });
      log("update", `Cập nhật hồ sơ ${updated.personal.id} - ${updated.personal.fullName}`);
    }
  };

  const handleCreateStaff = (newStaff: Staff) => {
    createStaff(newStaff);
    log("create", `Tạo nhân viên mới: ${newStaff.personal.fullName}`);
    navigate("/hr/staff");
  };

  // ── Not found ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải dữ liệu...</div>;
  }

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
                  { value: "discipline", label: "Kỷ luật", icon: Contact }, // TODO: Fix icon
                  { value: "attendance", label: "Nghỉ phép", icon: CalendarDays },
                  { value: "timekeeping", label: "Chấm công", icon: Clock },
                ]
              : []),
          ]}
        />

        <div className={styles.tabContent}>
          {activeTab === "personal" && <PersonalTab staff={staff!} />}
          {activeTab === "job" && <JobTab staff={staff!} />}
          {!isCreateMode && activeTab === "payroll" && <PayrollTab staff={staff!} />}
          {!isCreateMode && activeTab === "performance" && <PerformanceTab staff={staff!} />}
          {!isCreateMode && activeTab === "discipline" && <DisciplineTab staff={staff!} />}
          {!isCreateMode && activeTab === "attendance" && <AttendanceTab staff={staff!} />}
          {!isCreateMode && activeTab === "timekeeping" && <TimekeepingTab staff={staff!} />}
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
