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
import { StaffTransferModal } from "./modals/StaffTransferModal";
import { departmentsMockData, positionsMockData } from "../../../mock/departments";

const Departments: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("departments");
  
  // Department State
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);

  // Transfer State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferDept, setTransferDept] = useState<any>(null);

  // Position State
  const [isAddPosModalOpen, setIsAddPosModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<any>(null);

  // Mock data for Org Chart
  const [departmentsList] = useState(departmentsMockData);

  // Mock data for Positions
  const [positionsList] = useState(positionsMockData);

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
        positionsList={positionsList}
        onOpenTransfer={() => {
          setTransferDept(editingDept);
          setIsTransferModalOpen(true);
        }}
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

      {transferDept && (
        <StaffTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          departmentId={transferDept.id}
          departmentName={transferDept.name}
        />
      )}
    </div>
  );
};

export default Departments;
