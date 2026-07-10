import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Network, BadgeCheck } from "lucide-react";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { PageHeader } from "../../../components/molecules/PageHeader";
import { BaseTabs } from "../../../components/atoms/BaseTabs";

import { DepartmentTreeTab } from "./components/DepartmentTreeTab";
import { PositionListTab } from "./components/PositionListTab";
import { DepartmentModal } from "./modals/DepartmentModal";
import { PositionModal } from "./modals/PositionModal";

const Departments: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("departments");
  
  // Department State
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);

  // Position State
  const [isAddPosModalOpen, setIsAddPosModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<any>(null);

  // Mock data for Org Chart
  const [departmentsList] = useState([
    {
      id: "BGĐ",
      name: "Ban Giám đốc",
      parent: null,
      headCount: 3,
      manager: "Trần Anh Tuấn",
      icon: "Building",
      description: "Điều hành chung toàn bộ trung tâm",
      autoRoles: ["VIEW_ALL_REPORTS"],
    },
    {
      id: "HCTH",
      name: "Hành chính Tổng hợp",
      parent: "BGĐ",
      headCount: 5,
      manager: "Lê Hoàng Yến",
      icon: "Briefcase",
      description: "Nhân sự, kế toán, văn thư lưu trữ",
      autoRoles: ["VIEW_HR_DASHBOARD"],
    },
    {
      id: "YTSC",
      name: "Khoa Y tế & Chăm sóc",
      parent: "BGĐ",
      headCount: 25,
      manager: "BS. Nguyễn Văn A",
      icon: "HeartPulse",
      description: "Khám chữa bệnh và cấp phát thuốc",
      autoRoles: ["VIEW_MEDICAL_RECORDS"],
    },
    {
      id: "ĐDNT",
      name: "Tổ Điều dưỡng Nội trú",
      parent: "YTSC",
      headCount: 15,
      manager: "ĐD. Trần Thị Bé",
      icon: "Coffee",
      description: "Chăm sóc sinh hoạt 24/7 cho người cao tuổi",
      autoRoles: ["VIEW_SHIFT_SCHEDULE"],
    },
  ]);

  // Mock data for Positions
  const [positionsList] = useState([
    {
      id: "DIR_01",
      title: "Giám đốc Điều hành",
      department: "Ban Giám đốc",
      autoRoles: ["SUPER_ADMIN", "FINANCE_APPROVER"],
    },
    {
      id: "HR_01",
      title: "Trưởng phòng Hành chính",
      department: "Hành chính Tổng hợp",
      autoRoles: ["HR_MANAGER", "PAYROLL_VIEWER"],
    },
    {
      id: "MED_01",
      title: "Bác Sĩ Trưởng Khoa",
      department: "Khoa Y tế & Chăm sóc",
      autoRoles: ["MEDICAL_LEAD", "PRESCRIPTION_WRITE", "ROSTER_MANAGER"],
    },
    {
      id: "NUR_01",
      title: "Điều Dưỡng Viên",
      department: "Tổ Điều dưỡng Nội trú",
      autoRoles: ["NURSE_BASIC", "VITAL_SIGNS_INPUT"],
    },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flexShrink: 0 }}>
        <PageHeader
          title={t("hr.orgChartTitle")}
          subtitle={t("hr.orgChartDesc")}
          actions={
            activeTab === "departments" ? (
              <BaseButton onClick={() => { setEditingDept(null); setIsDeptModalOpen(true); }}>
                <Plus size={18} /> {t("common.add")}
              </BaseButton>
            ) : (
              <BaseButton onClick={() => { setEditingPos(null); setIsAddPosModalOpen(true); }}>
                <Plus size={18} /> {t("common.add")}
              </BaseButton>
            )
          }
        />

        {/* Tabs */}
        <BaseTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "departments", label: "Sơ đồ Phòng Ban", icon: Network },
            { value: "positions", label: "Cấu hình Chức Vụ & Quyền", icon: BadgeCheck },
          ]}
        />
      </div>

      {/* Card List Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem 0.5rem 1rem 0.5rem",
        }}
      >
        {activeTab === "departments" && (
          <DepartmentTreeTab
            departmentsList={departmentsList}
            editingDept={editingDept}
            onOpenDeptModal={(dept) => { setEditingDept(dept); setIsDeptModalOpen(true); }}
          />
        )}

        {activeTab === "positions" && (
          <PositionListTab
            positionsList={positionsList}
            editingPos={editingPos}
            onOpenPosModal={(pos) => { setEditingPos(pos); setIsAddPosModalOpen(true); }}
          />
        )}
      </div>

      {/* Modals */}
      <DepartmentModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSave={() => setIsDeptModalOpen(false)}
        onDelete={() => setIsDeptModalOpen(false)}
        editingDept={editingDept}
        setEditingDept={setEditingDept}
        departmentsList={departmentsList}
      />

      <PositionModal
        isOpen={isAddPosModalOpen}
        onClose={() => setIsAddPosModalOpen(false)}
        onSave={() => setIsAddPosModalOpen(false)}
        onDelete={() => setIsAddPosModalOpen(false)}
        editingPos={editingPos}
        setEditingPos={setEditingPos}
        departmentsList={departmentsList}
      />
    </div>
  );
};

export default Departments;
