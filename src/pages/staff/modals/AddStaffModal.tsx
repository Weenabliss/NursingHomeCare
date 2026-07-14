import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "../../../shared/components/BaseModal";
import { BaseInput } from "../../../shared/components/BaseInput";


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
          Hệ thống sẽ tự động tạo Tài khoản App. Bạn có thể phân bổ nhân sự vào các phòng ban cụ thể tại trang Cơ cấu tổ chức sau khi thêm mới.
        </div>
        <BaseInput label="Họ và tên" placeholder="Nhập họ và tên..." onChange={() => setIsDirty(true)} />
        <BaseInput label="Số điện thoại / Email" placeholder="Dùng làm tài khoản đăng nhập..." onChange={() => setIsDirty(true)} />
        <BaseInput label="Số CCCD" placeholder="..." onChange={() => setIsDirty(true)} />
      </div>
    </BaseModal>
  );
};
