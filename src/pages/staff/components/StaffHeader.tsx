import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Briefcase, Contact, UserCircle, UserPlus, Save } from "lucide-react";
import { BaseButton } from "../../../shared/components/BaseButton";
import { BaseModal } from "../../../shared/components/BaseModal";
import { BaseInput } from "../../../shared/components/BaseInput";
import { BaseSelect } from "../../../shared/components/BaseSelect";
import { getStaffStatusBadge } from "../../../shared/components/BaseBadge";
import { MediaViewerModal } from "../../../shared/components/MediaViewerModal";
import { useConfirm } from "../../../contexts/ConfirmContext";

import type { Staff } from "../../../modules/hr/types";
import styles from "../StaffDetail.module.scss";

interface StaffHeaderProps {
  staff: Staff;
  onUpdateStaff: (updatedStaff: Staff) => void;
  /** Create mode: modal mở ngay, nút "Tạo nhân viên" thay "Quay lại" */
  isCreateMode?: boolean;
  onCreateStaff?: (newStaff: Staff) => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({
  staff,
  onUpdateStaff,
  isCreateMode = false,
  onCreateStaff,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isHeaderDirty, setIsHeaderDirty] = useState(false);
  const [headerFormData, setHeaderFormData] = useState<Partial<Staff>>({});
  const [isPreviewAvatarOpen, setIsPreviewAvatarOpen] = useState(false);

  // Khi create mode: mở modal ngay lập tức
  useEffect(() => {
    if (isCreateMode) {
      setHeaderFormData(staff);
      setIsHeaderModalOpen(true);
    }
  }, [isCreateMode]);

  const closeHeaderModal = () => {
    // Trong create mode, nếu người dùng đóng modal mà chưa lưu → quay lại list
    if (isCreateMode && !isHeaderDirty) {
      navigate("/hr/staff");
      return;
    }
    setIsHeaderModalOpen(false);
    setIsHeaderDirty(false);
  };

  const handleConfirm = () => {
    const merged = { ...staff, ...headerFormData } as Staff;
    if (isCreateMode && onCreateStaff) {
      onCreateStaff(merged);
    } else {
      onUpdateStaff(merged);
    }
    setIsHeaderModalOpen(false);
    setIsHeaderDirty(false);
  };

  return (
    <>
      <div
        className={styles.topHeader}
        onClick={() => {
          if (!isCreateMode) {
            setHeaderFormData(staff);
            setIsHeaderModalOpen(true);
          }
        }}
        title={isCreateMode ? undefined : "Nhấn để chỉnh sửa thông tin"}
        style={{ cursor: isCreateMode ? "default" : undefined }}
      >
        <div className={styles.headerLeft}>
          <div className={styles.avatarWrapper}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!isCreateMode) setIsPreviewAvatarOpen(true);
              }}
              style={{ display: "inline-block" }}
            >
              {isCreateMode ? (
                /* Placeholder avatar khi tạo mới */
                <div
                  className={styles.avatar}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
                    border: "3px solid #ffffff",
                  }}
                >
                  <UserPlus size={36} color="#6366f1" />
                </div>
              ) : (
                <img
                  src={staff.personal.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.personal.fullName)}`}
                  alt={staff.personal.fullName}
                  className={styles.avatar}
                  style={{
                    borderColor: staff.personal.gender === "female" ? "#ec4899" : "#3b82f6",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              )}
            </div>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerTitleRow}>
              <h1 className={styles.staffName}>
                {isCreateMode
                  ? (headerFormData.personal?.fullName || "Nhân viên mới")
                  : staff.personal.fullName}
              </h1>
              {isCreateMode ? (
                <span style={{
                  fontSize: "0.8rem",
                  background: "#e0f2fe",
                  color: "#0369a1",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontWeight: 600,
                }}>
                  Đang tạo mới
                </span>
              ) : (
                getStaffStatusBadge(staff.employment.status)
              )}
            </div>
            <div className={styles.basicInfoRow}>
              <div className={styles.basicInfoItem}>
                <Contact size={16} />
                <span>{isCreateMode ? "Mã sẽ được cấp tự động" : staff.personal.code}</span>
              </div>
              <div className={styles.basicInfoItem}>
                <Briefcase size={16} />{" "}
                <span>
                  {isCreateMode
                    ? (headerFormData.employment?.jobTitle || "Chưa chọn chức vụ")
                    : `${staff.employment.jobTitle} - ${staff.employment.departmentId}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          {isCreateMode ? (
            <>
              <BaseButton
                variant="outline"
                onClick={async (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const isConfirmed = await confirm({
                    title: "Hủy tạo nhân viên",
                    message: "Bạn có chắc chắn muốn hủy bỏ? Các thông tin đã điền sẽ không được lưu.",
                    confirmText: "Đồng ý",
                  });
                  if (isConfirmed) navigate("/hr/staff");
                }}
              >
                <ArrowLeft size={16} /> Hủy
              </BaseButton>
              <BaseButton
                variant="primary"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setHeaderFormData(staff);
                  setIsHeaderModalOpen(true);
                }}
              >
                <Save size={16} /> Chỉnh sửa thông tin
              </BaseButton>
            </>
          ) : (
            <BaseButton variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate("/hr/staff"); }}>
              <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Quay lại
            </BaseButton>
          )}
        </div>
      </div>

      {/* Avatar Preview */}
      {!isCreateMode && (
        <MediaViewerModal
          isOpen={isPreviewAvatarOpen}
          onClose={() => setIsPreviewAvatarOpen(false)}
          url={staff.personal.avatar || ""}
          type="image"
        />
      )}

      {/* Header Edit / Create Modal */}
      <BaseModal
        isOpen={isHeaderModalOpen}
        onClose={closeHeaderModal}
        title={isCreateMode ? "Thông tin nhân viên mới" : "Chỉnh sửa thông tin cơ bản"}
        confirmText={isCreateMode ? "Tạo nhân viên" : t("common.save")}
        onConfirm={handleConfirm}
        isDirty={isHeaderDirty}
      >
        {/* Avatar picker */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
          <label style={{ position: "relative", cursor: "pointer", display: "inline-block" }} title="Nhấn để đổi ảnh đại diện">
            <img
              src={headerFormData.personal?.avatar || staff.personal.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.personal.fullName)}`}
              alt="Avatar preview"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onError={(e) => { e.currentTarget.src = `https://i.pravatar.cc/150?u=new`; }}
            />
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              background: "var(--primary)", color: "white",
              borderRadius: "50%", padding: "8px", display: "flex",
              alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)", border: "3px solid #ffffff",
            }}>
              <UserCircle size={18} />
            </div>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const fileUrl = URL.createObjectURL(e.target.files[0]);
                  setHeaderFormData({
                    ...headerFormData,
                    personal: { ...headerFormData.personal!, avatar: fileUrl }
                  });
                  setIsHeaderDirty(true);
                }
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput
            label="Họ và tên *"
            defaultValue={headerFormData.personal?.fullName || ""}
            onChange={(e: any) => {
              setHeaderFormData({
                ...headerFormData,
                personal: { ...headerFormData.personal!, fullName: e.target.value }
              });
              setIsHeaderDirty(true);
            }}
          />
          {isCreateMode && (
            <>
              <BaseInput
                label="Email *"
                type="email"
                defaultValue={headerFormData.personal?.email || ""}
                onChange={(e: any) => {
                  setHeaderFormData({
                    ...headerFormData,
                    personal: { ...headerFormData.personal!, email: e.target.value }
                  });
                  setIsHeaderDirty(true);
                }}
              />
              <BaseInput
                label="Số điện thoại *"
                type="tel"
                defaultValue={headerFormData.personal?.phone || ""}
                onChange={(e: any) => {
                  setHeaderFormData({
                    ...headerFormData,
                    personal: { ...headerFormData.personal!, phone: e.target.value }
                  });
                  setIsHeaderDirty(true);
                }}
              />
              <BaseInput
                label="Ngày vào làm *"
                type="date"
                defaultValue={headerFormData.employment?.joinDate || new Date().toISOString().split("T")[0]}
                onChange={(e: any) => {
                  setHeaderFormData({
                    ...headerFormData,
                    employment: { ...headerFormData.employment!, joinDate: e.target.value as any }
                  });
                  setIsHeaderDirty(true);
                }}
              />
            </>
          )}

          {!isCreateMode && (
            <BaseSelect
              label="Trạng thái công việc"
              defaultValue={headerFormData.employment?.status || "active"}
              options={[
                { label: "Đang làm việc", value: "active" },
                { label: "Thử việc", value: "probation" },
                { label: "Nghỉ thai sản", value: "maternity_leave" },
                { label: "Đình chỉ", value: "suspended" },
                { label: "Đã nghỉ việc", value: "resigned" },
              ]}
              onChange={(e) => {
                setHeaderFormData({
                  ...headerFormData,
                  employment: { ...headerFormData.employment!, status: e.target.value as any }
                });
                setIsHeaderDirty(true);
              }}
            />
          )}
          {isCreateMode && (
            <BaseSelect
              label="Giới tính *"
              defaultValue={headerFormData.personal?.gender || ""}
              options={[
                { label: "Chọn giới tính...", value: "" },
                { label: "Nam", value: "male" },
                { label: "Nữ", value: "female" },
                { label: "Khác", value: "other" },
              ]}
              onChange={(e) => {
                setHeaderFormData({
                  ...headerFormData,
                  personal: { ...headerFormData.personal!, gender: e.target.value as any }
                });
                setIsHeaderDirty(true);
              }}
            />
          )}
        </div>
      </BaseModal>
    </>
  );
};
