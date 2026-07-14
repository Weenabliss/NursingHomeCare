import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { BaseModal } from "../../../../shared/components/BaseModal";
import { BaseInput } from "../../../../shared/components/BaseInput";
import { BaseSelect } from "../../../../shared/components/BaseSelect";
import { BaseButton } from "../../../../shared/components/BaseButton";

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  editingPos: any;
  setEditingPos: (pos: any) => void;
  departmentsList: any[];
}

export const PositionModal: React.FC<PositionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingPos,
  departmentsList,
}) => {
  const { t } = useTranslation();
  const [isDirty, setIsDirty] = useState(false);

  const handleClose = () => {
    setIsDirty(false);
    onClose();
  };

  const handleSave = () => {
    setIsDirty(false);
    onSave();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingPos?.id ? "Sửa Chức vụ & Phân quyền" : "Thêm Chức vụ & Phân quyền"}
      confirmText={t("common.save")}
      onConfirm={handleSave}
      isDirty={isDirty}
      footerLeftContent={
        editingPos?.id && onDelete ? (
          <BaseButton variant="danger" onClick={onDelete}>
            {t("common.delete")}
          </BaseButton>
        ) : null
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 120px" }}>
            <BaseInput label="Mã chức vụ" placeholder="VD: BS" defaultValue={editingPos?.id} onChange={() => setIsDirty(true)} />
          </div>
          <div style={{ flex: "2 1 200px" }}>
            <BaseInput
              label={t("hr.positionTitle")}
              placeholder="VD: Bác sĩ điều trị"
              defaultValue={editingPos?.title}
              onChange={() => setIsDirty(true)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 250px" }}>
            <BaseSelect
              label="Thuộc Khối/Phòng/Khoa"
              options={departmentsList.map((d) => ({
                label: d.name,
                value: d.id,
              }))}
              onChange={() => setIsDirty(true)}
            />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <BaseInput label="Hệ số lương cơ bản" placeholder="VD: 1.5" type="number" onChange={() => setIsDirty(true)} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--background-alt)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--border)",
          }}
        >
          <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>
            {t("hr.rbacMapping")} (Tự động gán quyền)
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1rem 0" }}>
            Khi bổ nhiệm 1 nhân sự vào chức vụ này, hệ thống sẽ tự động bơm các Role (Quyền) bên dưới vào tài khoản
            của nhân sự đó.
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
              minHeight: "32px",
              alignItems: "center",
            }}
          >
            {(editingPos?.autoRoles || []).map((role: string) => (
              <span
                key={role}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  backgroundColor: "#1e293b",
                  color: "#f8fafc",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                {role}
                <span style={{ cursor: "pointer", opacity: 0.7, paddingLeft: "4px" }} onClick={() => setIsDirty(true)}>&times;</span>
              </span>
            ))}
            {(!editingPos?.autoRoles || editingPos.autoRoles.length === 0) && (
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Chưa có Role nào được gán
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ flex: 1 }}>
              <BaseSelect
                options={[
                  { label: "KẾ TOÁN", value: "r1" },
                  { label: "NHÂN SỰ", value: "r2" },
                  { label: "BÁC SĨ TỔNG QUÁT", value: "r3" },
                  { label: "QUẢN LÝ THUỐC", value: "r4" },
                ]}
                onChange={() => setIsDirty(true)}
              />
            </div>
            <BaseButton variant="outline" style={{ flex: "0 0 auto" }} onClick={() => setIsDirty(true)}>
              <Plus size={18} /> {t("common.add")}
            </BaseButton>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
