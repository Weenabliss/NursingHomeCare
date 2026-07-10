import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { departmentsMock, positionsMock } from "../../../mock/staff";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isDirty, setIsDirty] = useState(false);

  const handleClose = () => {
    setIsDirty(false);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tiếp nhận nhân sự mới"
      confirmText={t("common.save")}
      onConfirm={handleClose}
      isDirty={isDirty}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-md)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          Hệ thống sẽ tự động tạo Tài khoản App và Phân quyền dựa trên Chức vụ bạn chọn bên dưới.
        </div>
        <BaseInput label="Họ và tên" placeholder="Nhập họ và tên..." onChange={() => setIsDirty(true)} />
        <BaseInput label="Số điện thoại / Email" placeholder="Dùng làm tài khoản đăng nhập..." onChange={() => setIsDirty(true)} />
        <BaseInput label="Số CCCD" placeholder="..." onChange={() => setIsDirty(true)} />
        <BaseSelect label="Thuộc Khoa/Phòng" options={departmentsMock.filter((d) => d.value !== "all")} onChange={() => setIsDirty(true)} />
        <BaseSelect label="Chức danh bổ nhiệm" options={positionsMock} onChange={() => setIsDirty(true)} />
      </div>
    </BaseModal>
  );
};
