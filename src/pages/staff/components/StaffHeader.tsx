import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Briefcase, Contact, UserCircle, X } from "lucide-react";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { departmentsMock, positionsMock } from "../../../mock/staff";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

interface StaffHeaderProps {
  staff: Staff;
  onUpdateStaff: (updatedStaff: Staff) => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ staff, onUpdateStaff }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isHeaderDirty, setIsHeaderDirty] = useState(false);
  const [headerFormData, setHeaderFormData] = useState<Partial<Staff>>({});
  const [isPreviewAvatarOpen, setIsPreviewAvatarOpen] = useState(false);

  const closeHeaderModal = () => {
    setIsHeaderModalOpen(false);
    setIsHeaderDirty(false);
  };

  return (
    <>
      <div 
        className={styles.topHeader} 
        onClick={() => {
          setHeaderFormData(staff);
          setIsHeaderModalOpen(true);
        }}
        title="Nhấn để chỉnh sửa thông tin"
      >
        <div className={styles.headerLeft}>
          <div className={styles.avatarWrapper}>
            <div onClick={(e) => { e.stopPropagation(); setIsPreviewAvatarOpen(true); }} title="Xem ảnh lớn" style={{ display: "inline-block" }}>
              <img
                src={staff.avatar}
                alt={staff.name}
                className={styles.avatar}
                style={{
                  borderColor: staff.gender === "female" ? "#ec4899" : "#3b82f6",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerTitleRow}>
              <h1 className={styles.staffName}>{staff.name}</h1>
              {staff.status === "active" && (
                <span
                  style={{
                    backgroundColor: "#dcfce7",
                    color: "#16a34a",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Đang làm việc
                </span>
              )}
              {staff.status === "on_leave" && (
                <span
                  style={{
                    backgroundColor: "#fef08a",
                    color: "#854d0e",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Nghỉ thai sản
                </span>
              )}
              {staff.status === "resigned" && (
                <span
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Đã nghỉ việc
                </span>
              )}
            </div>
            <div className={styles.basicInfoRow}>
              <div className={styles.basicInfoItem}>
                <Contact size={16} /> <span>{staff.id}</span>
              </div>
              <div className={styles.basicInfoItem}>
                <Briefcase size={16} />{" "}
                <span>
                  {staff.position} - {staff.department}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <BaseButton variant="outline" onClick={(e) => { e.stopPropagation(); navigate("/hr/staff"); }}>
            <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Quay lại
          </BaseButton>
        </div>
      </div>

      {/* Avatar Preview Modal */}
      {isPreviewAvatarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            overflow: "auto",
            display: "grid",
            placeItems: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
          onClick={() => setIsPreviewAvatarOpen(false)}
        >
          <img
            src={staff.avatar}
            alt={staff.name}
            style={{
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "4px solid rgba(255,255,255,0.1)",
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
          <button
            onClick={() => setIsPreviewAvatarOpen(false)}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              padding: "0.5rem",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Header Edit Modal */}
      <BaseModal
        isOpen={isHeaderModalOpen}
        onClose={closeHeaderModal}
        title="Chỉnh sửa thông tin cơ bản"
        confirmText={t("common.save")}
        onConfirm={() => {
          onUpdateStaff({ ...staff, ...headerFormData } as Staff);
          closeHeaderModal();
        }}
        isDirty={isHeaderDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
          <label style={{ position: "relative", cursor: "pointer", display: "inline-block" }} title="Nhấn để đổi ảnh đại diện">
            <img 
              src={headerFormData.avatar || staff.avatar} 
              alt="Avatar preview" 
              style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", border: "4px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} 
            />
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              background: "var(--primary)", color: "white",
              borderRadius: "50%", padding: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              border: "3px solid #ffffff"
            }}>
              <UserCircle size={18} />
            </div>
            <input 
              type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const fileUrl = URL.createObjectURL(e.target.files[0]);
                  setHeaderFormData({ ...headerFormData, avatar: fileUrl });
                  setIsHeaderDirty(true);
                }
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput 
            label="Họ và tên"
            defaultValue={headerFormData.name || ""} 
            onChange={(e: any) => { setHeaderFormData({ ...headerFormData, name: e.target.value }); setIsHeaderDirty(true); }}
          />
          <BaseSelect 
            label="Phòng ban"
            defaultValue={headerFormData.department || ""}
            options={departmentsMock.map((d) => ({ label: d.label, value: d.label }))}
            onChange={(e) => { setHeaderFormData({ ...headerFormData, department: e.target.value }); setIsHeaderDirty(true); }}
          />
          <BaseSelect 
            label="Chức vụ"
            defaultValue={headerFormData.position || ""}
            options={positionsMock.map((p) => ({ label: p.label, value: p.label }))}
            onChange={(e) => { setHeaderFormData({ ...headerFormData, position: e.target.value }); setIsHeaderDirty(true); }}
          />
          <BaseSelect 
            label="Trạng thái công việc"
            defaultValue={headerFormData.status || "active"}
            options={[
              { label: "Đang làm việc", value: "active" },
              { label: "Nghỉ thai sản", value: "on_leave" },
              { label: "Đã nghỉ việc", value: "resigned" }
            ]}
            onChange={(e) => { setHeaderFormData({ ...headerFormData, status: e.target.value as any }); setIsHeaderDirty(true); }}
          />
        </div>
      </BaseModal>
    </>
  );
};
