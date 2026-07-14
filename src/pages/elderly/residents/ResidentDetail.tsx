import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BaseTabs } from "../../../shared/components/BaseTabs";
import { BaseButton } from "../../../shared/components/BaseButton";
import { UserSquare2 } from "lucide-react";
import { residentsMockData } from "../../../mock/residents";
import type { Resident } from "../../../mock/residents";
import { ResidentHeader } from "./components/ResidentHeader";

import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { MedicalHistoryTab } from "./tabs/MedicalHistoryTab";
import { ActivitiesTab } from "./tabs/ActivitiesTab";
import { RelativesTab } from "./tabs/RelativesTab";
import { ServicesTab } from "./tabs/ServicesTab";
import { ResidenceHistoryTab } from "./tabs/ResidenceHistoryTab";

export const ResidentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = id === "new";

  const [resident, setResident] = useState<Resident | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (isCreateMode) {
      // blank resident
    } else {
      const found = residentsMockData.find(r => r.id === id);
      if (found) setResident(found);
    }
  }, [id, isCreateMode]);

  if (!isCreateMode && !resident) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Không tìm thấy Cư dân</h2>
        <BaseButton onClick={() => navigate("/elderly/list")}>Quay lại</BaseButton>
      </div>
    );
  }

  const tabs = [
    { value: "basic", label: "Thông tin cơ bản", icon: UserSquare2 },
    { value: "medical", label: "Lịch sử bệnh lý", icon: UserSquare2 },
    { value: "activities", label: "Hoạt động", icon: UserSquare2 },
    { value: "relatives", label: "Người thân", icon: UserSquare2 },
    { value: "services", label: "Dịch vụ đã dùng", icon: UserSquare2 },
    { value: "residence", label: "Lịch sử cư trú", icon: UserSquare2 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <ResidentHeader resident={resident} />

      {/* TABS */}
      <div style={{ padding: "0 2rem", flexShrink: 0 }}>
        <BaseTabs
          options={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        {resident && (
          <div style={{ minHeight: "100%" }}>
            {activeTab === "basic" && <BasicInfoTab resident={resident} />}
            {activeTab === "medical" && <MedicalHistoryTab resident={resident} />}
            {activeTab === "activities" && <ActivitiesTab resident={resident} />}
            {activeTab === "relatives" && <RelativesTab resident={resident} />}
            {activeTab === "services" && <ServicesTab resident={resident} />}
            {activeTab === "residence" && <ResidenceHistoryTab resident={resident} />}
          </div>
        )}
      </div>
    </div>
  );
};
