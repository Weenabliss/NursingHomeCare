import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BaseTabs } from "../../../components/atoms/BaseTabs";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { residentsMockData } from "../../../mock/residents";
import type { Resident } from "../../../mock/residents";
import { UserSquare2, ArrowLeft, Save } from "lucide-react";

// Placeholder tabs
const BasicInfoTab = ({ resident: _resident }: { resident: Resident }) => <div style={{ padding: "1rem" }}>Tab 1: Thông tin cơ bản (Đang xây dựng)</div>;
const MedicalHistoryTab = ({ resident: _resident }: { resident: Resident }) => <div style={{ padding: "1rem" }}>Tab 2: Lịch sử bệnh lý (Đang xây dựng)</div>;
const ActivitiesTab = ({ resident: _resident }: { resident: Resident }) => <div style={{ padding: "1rem" }}>Tab 3: Hoạt động ghi nhận (Đang xây dựng)</div>;
const RelativesTab = ({ resident: _resident }: { resident: Resident }) => <div style={{ padding: "1rem" }}>Tab 4: Người thân (Đang xây dựng)</div>;
const ServicesTab = ({ resident: _resident }: { resident: Resident }) => <div style={{ padding: "1rem" }}>Tab 5: Dịch vụ đã dùng (Đang xây dựng)</div>;
const ResidenceHistoryTab = ({ resident: _resident }: { resident: Resident }) => <div style={{ padding: "1rem" }}>Tab 6: Lịch sử cư trú (Đang xây dựng)</div>;

export const ResidentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = id === "new";

  const [resident, setResident] = useState<Resident | null>(null);
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
      {/* HEADER */}
      <div style={{ flexShrink: 0, padding: "1.25rem", borderBottom: "1px solid var(--border)", background: "#fff", display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
        <BaseButton variant="outline" size="sm" onClick={() => navigate("/elderly/list")}>
          <ArrowLeft size={20} />
        </BaseButton>

        {resident && (
          <img 
            src={resident.avatar} 
            alt="Avatar" 
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #e2e8f0" }} 
          />
        )}
        
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)" }}>
            {resident ? resident.fullName : "Tiếp nhận Cư dân mới"}
          </h1>
          <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {resident && (
              <>
                <span>Mã: <strong>{resident.code}</strong></span>
                <span>Giới tính: <strong>{resident.gender === "male" ? "Nam" : "Nữ"}</strong></span>
                <span>Trạng thái: <strong>{resident.status}</strong></span>
              </>
            )}
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <BaseButton variant="primary">
            <Save size={16} /> Lưu thay đổi
          </BaseButton>
        </div>
      </div>

      {/* TABS */}
      <div style={{ padding: "0 1.25rem", borderBottom: "1px solid var(--border)", background: "#fff", flexShrink: 0 }}>
        <BaseTabs
          options={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--background-alt)", padding: "1.5rem" }}>
        {resident && (
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", minHeight: "100%" }}>
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
