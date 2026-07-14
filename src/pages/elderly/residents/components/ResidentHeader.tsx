import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Contact, BedDouble, UserSquare2, Calendar, Activity } from "lucide-react";
import type { Resident } from "../../../../mock/residents";
import { BaseButton } from "../../../../shared/components/BaseButton";
import { BaseModal } from "../../../../shared/components/BaseModal";
import { BaseInput } from "../../../../shared/components/BaseInput";
import { BaseSelect } from "../../../../shared/components/BaseSelect";

import { HealthSelect, type HealthOption } from "../../../../pages/elderly/residents/components/HealthSelect";

interface ResidentHeaderProps {
  resident: Resident | undefined;
}

export const ResidentHeader: React.FC<ResidentHeaderProps> = ({ resident }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [displayResident, setDisplayResident] = useState<Resident | undefined>(resident);
  const [formData, setFormData] = useState<Partial<Resident>>({});
  const [healthOptions, setHealthOptions] = useState<HealthOption[]>([
    { text: "Bình thường", id: "normal", color: "#10b981" },
    { text: "Cần chú ý", id: "attention", color: "#f59e0b" },
    { text: "Nguy kịch", id: "critical", color: "#ef4444" },
  ]);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  // Sync displayResident if resident prop changes (e.g. navigation)
  useEffect(() => {
    setDisplayResident(resident);
    if (resident?.healthStatus && !["normal", "attention", "critical"].includes(resident.healthStatus)) {
      setHealthOptions(prev => {
        if (!prev.find(o => o.id === resident.healthStatus)) {
          return [...prev, { text: resident.healthStatus, id: resident.healthStatus, color: resident.healthColor || "#8b5cf6" }];
        }
        return prev;
      });
    }
  }, [resident]);

  const handleOpenModal = () => {
    if (displayResident) {
      setFormData(displayResident);
      setIsSettingsExpanded(false);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDirty(false);
  };

  const handleConfirm = () => {
    if (displayResident) {
      setDisplayResident({ ...displayResident, ...formData });
      if (resident) {
        // Also mutate the original mock object so it persists across local tab switching
        Object.assign(resident, formData);
      }
    }
    setIsModalOpen(false);
    setIsDirty(false);
  };

  // Helper to get age
  const getAge = (dob: string) => {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  return (
    <>
      <div 
        style={{ 
          flexShrink: 0, 
          position: "relative",
          margin: "1rem 1.5rem 0.5rem 1.5rem",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          cursor: displayResident ? "pointer" : "default",
          transition: "transform 0.2s, box-shadow 0.2s",
          background: "#ffffff"
        }}
        onClick={handleOpenModal}
        onMouseOver={(e) => {
          if (displayResident) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.1)";
          }
        }}
        onMouseOut={(e) => {
          if (displayResident) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
          }
        }}
        title="Nhấn để chỉnh sửa thông tin hồ sơ"
      >
        
        {/* Abstract Cover Banner */}
        <div style={{ 
          height: "140px", 
          width: "100%", 
          background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)", // Premium Deep Indigo/Royal Blue
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Subtle Premium Overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.05) 0%, transparent 40%)",
          }} />
          
          {/* Top Actions */}
          <div style={{ 
            position: "absolute", top: "1.25rem", left: "1.5rem", right: "1.5rem", 
            display: "flex", justifyContent: "space-between", zIndex: 10 
          }}>
            <BaseButton variant="outline" size="sm" 
              onClick={(e) => { e.stopPropagation(); navigate("/elderly/list"); }} 
              style={{ background: "rgba(255,255,255,0.9)", border: "none", color: "#1e293b", fontWeight: 600, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
            >
              <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Quay lại
            </BaseButton>
            {/* Nút lưu đã bị loại bỏ theo yêu cầu */}
          </div>
        </div>

        {/* Content Container (Overlapping the banner slightly) */}
        <div style={{ 
          display: "flex", 
          padding: "0 2rem 1.5rem 2rem", 
          marginTop: "-60px", // Pull up over the banner
          position: "relative",
          zIndex: 5
        }}>
          
          {/* Avatar Area */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "2rem" }}>
            <div style={{ position: "relative" }}>
              {displayResident ? (
                <img 
                  src={displayResident.avatar} 
                  alt="Avatar" 
                  style={{ 
                    width: "140px", height: "140px", borderRadius: "20px", objectFit: "cover", 
                    border: "6px solid #ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    background: "#ffffff"
                  }} 
                />
              ) : (
                <div style={{ 
                  width: "140px", height: "140px", borderRadius: "20px", background: "#f8fafc", 
                  border: "6px solid #ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", 
                  display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                  <UserSquare2 size={48} color="#cbd5e1" />
                </div>
              )}
            </div>
            {/* Status Badge */}
            {displayResident && (
              <div style={{ 
                marginTop: "-15px",
                zIndex: 10,
                background: (displayResident as any).healthColor ? `${(displayResident as any).healthColor}20` : (displayResident.healthStatus === "critical" ? "#fee2e2" : displayResident.healthStatus === "attention" ? "#fef3c7" : "#d1fae5"),
                color: (displayResident as any).healthColor || (displayResident.healthStatus === "critical" ? "#b91c1c" : displayResident.healthStatus === "attention" ? "#b45309" : "#047857"),
                padding: "4px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>
                <Activity size={14} /> 
                {displayResident.healthStatus === "critical" ? "Nguy kịch" : displayResident.healthStatus === "attention" ? "Cần chú ý" : displayResident.healthStatus === "normal" ? "Ổn định" : displayResident.healthStatus}
              </div>
            )}
          </div>

          {/* Info Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: "60px" }}>
            
            {/* Title Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                  {displayResident ? displayResident.fullName : "Tiếp nhận Cư dân mới"}
                </h1>
                {displayResident && (
                  <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 500 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Contact size={16} /> Mã: <strong style={{ color: "var(--text-main)" }}>{displayResident.code}</strong>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <BedDouble size={16} /> Giường: <strong style={{ color: "var(--text-main)" }}>{(displayResident as any).room || "A-101"}</strong>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Calendar size={16} /> Tuổi: <strong style={{ color: "var(--text-main)" }}>{getAge(displayResident.dateOfBirth)}</strong>
                    </span>
                  </div>
                )}
              </div>
              
              {displayResident && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <div style={{ 
                    background: displayResident.status === "active" ? "#dcfce7" : "#f1f5f9", 
                    color: displayResident.status === "active" ? "#166534" : "#475569", 
                    padding: "6px 16px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: 700 
                  }}>
                    {displayResident.status === "active" ? "Đang lưu trú" : displayResident.status === "hospitalized" ? "Nhập viện" : "Khác"}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--primary-dark)", fontWeight: 600, background: "#e0e7ff", padding: "4px 12px", borderRadius: "12px" }}>
                    {displayResident.servicePackage || "Gói Chăm sóc Cơ bản"}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Edit Modal (Premium Style) */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Chỉnh sửa Hồ sơ Cư dân"
        confirmText="Lưu thay đổi"
        onConfirm={handleConfirm}
        isDirty={isDirty}
        hideFooter={isSettingsExpanded}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Avatar Banner Header (Inside Modal - Full Bleed) */}
          <div style={{ 
            position: "relative", 
            margin: "-1.5rem -1.5rem 2rem -1.5rem", // Negative margin to bleed to the edges of modalBody
            background: "#f8fafc",
            overflow: "hidden",
            borderBottom: "1px solid #e2e8f0",
            display: isSettingsExpanded ? "none" : "block",
          }}>
            {/* Modal Banner Background */}
            <div style={{ 
              height: "120px", 
              background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)",
              width: "100%",
              position: "relative"
            }}>
              {/* Subtle pattern for infinity feel */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 60%)",
              }} />
            </div>
            
            {/* Center Avatar Editor */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "-50px", paddingBottom: "1rem" }}>
              <label 
                style={{ position: "relative", cursor: "pointer", display: "inline-block" }} 
                title="Nhấn để đổi ảnh đại diện"
              >
                <img 
                  src={formData.avatar || "https://loremflickr.com/150/150/elderly,portrait,person/all?lock=999"} 
                  alt="Avatar Preview" 
                  style={{ 
                    width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", 
                    border: "5px solid #ffffff", boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    background: "#ffffff"
                  }} 
                />
                <div style={{
                  position: "absolute", bottom: "5px", right: "5px",
                  background: "var(--primary)", color: "white",
                  borderRadius: "50%", padding: "8px", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)", border: "3px solid #ffffff",
                }}>
                  <UserSquare2 size={16} />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const fileUrl = URL.createObjectURL(e.target.files[0]);
                      setFormData({ ...formData, avatar: fileUrl });
                      setIsDirty(true);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: isSettingsExpanded ? "none" : "flex", flexDirection: "column", gap: "1.25rem" }}>
            <BaseInput
              label="Họ và tên *"
              defaultValue={formData.fullName || ""}
              onChange={(e: any) => {
                setFormData({ ...formData, fullName: e.target.value });
                setIsDirty(true);
              }}
            />

            <BaseSelect
              label="Giới tính *"
              defaultValue={formData.gender || ""}
              options={[
                { label: "Nam", value: "male" },
                { label: "Nữ", value: "female" },
              ]}
              onChange={(e) => {
                setFormData({ ...formData, gender: e.target.value as any });
                setIsDirty(true);
              }}
            />

            <BaseSelect
              label="Trạng thái lưu trú"
              defaultValue={formData.status || ""}
              options={[
                { label: "Đang lưu trú", value: "active" },
                { label: "Nhập viện", value: "hospitalized" },
                { label: "Về nhà phép", value: "leave" },
                { label: "Đã xuất viện", value: "discharged" },
              ]}
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value as any });
                setIsDirty(true);
              }}
            />
          </div>

          {/* Health Status Picker */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <HealthSelect
              value={formData.healthStatus || "normal"}
              onChange={(val, color) => {
                setFormData({ ...formData, healthStatus: val, healthColor: color });
                setIsDirty(true);
              }}
              options={healthOptions}
              onOptionsChange={setHealthOptions}
              isSettingsExpanded={isSettingsExpanded}
              onToggleSettings={() => setIsSettingsExpanded(!isSettingsExpanded)}
            />
          </div>

        </div>
      </BaseModal>
    </>
  );
};
