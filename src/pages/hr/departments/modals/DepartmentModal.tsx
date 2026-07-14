import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Plus } from "lucide-react";
import { BaseModal } from "../../../../components/atoms/BaseModal";
import { BaseInput } from "../../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../../components/atoms/BaseSelect";
import { BaseButton } from "../../../../components/atoms/BaseButton";
import { StaffComboBox } from "../components/StaffComboBox";
import { departmentIconMap } from "../../../../config/departmentIcons";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  editingDept: any;
  setEditingDept: (dept: any) => void;
  departmentsList: any[];
  positionsList: any[];
  onOpenTransfer?: () => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingDept,
  setEditingDept,
  departmentsList,
  positionsList,
  onOpenTransfer,
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
      title={editingDept?.id ? t("hr.editDept") : t("hr.newDept")}
      confirmText={t("common.save")}
      onConfirm={handleSave}
      isDirty={isDirty}
      footerLeftContent={
        editingDept?.id && onDelete ? (
          <BaseButton variant="danger" onClick={onDelete}>
            {t("common.delete")}
          </BaseButton>
        ) : null
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 120px" }}>
            <BaseInput
              label={t("hr.deptCode")}
              placeholder="VD: HCTH"
              defaultValue={editingDept?.id}
              onChange={() => setIsDirty(true)}
            />
          </div>
          <div style={{ flex: "2 1 200px" }}>
            <BaseInput
              label={t("hr.deptName")}
              placeholder="VD: Hành chính tổng hợp"
              defaultValue={editingDept?.name}
              onChange={() => setIsDirty(true)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {/* Icon Picker — uses shared departmentIconMap */}
          <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--text-main)",
                marginBottom: "0.5rem",
              }}
            >
              {t("hr.selectIcon")}
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {Object.keys(departmentIconMap).map((iconKey) => {
                const isSelected = (editingDept?.icon || "LayoutGrid") === iconKey;
                return (
                  <button
                    key={iconKey}
                    onClick={() => {
                      setEditingDept({ ...editingDept, icon: iconKey });
                      setIsDirty(true);
                    }}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected ? "var(--primary)" : "var(--background-alt)",
                      color: isSelected ? "#ffffff" : "var(--text-muted)",
                      transition: "all 0.2s ease",
                    }}
                    title={iconKey}
                  >
                    {departmentIconMap[iconKey]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--text-main)",
                marginBottom: "0.5rem",
              }}
            >
              {t("hr.uploadImage")}
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.5rem",
                border: "1px dashed var(--border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                backgroundColor: "var(--background-alt)",
                color: "var(--text-muted)",
                height: "44px",
              }}
            >
              <Upload size={16} /> Tải ảnh icon từ máy tính
              <input type="file" style={{ display: "none" }} accept="image/*" onChange={() => setIsDirty(true)} />
            </label>
          </div>
        </div>

        <BaseSelect
          label="Trực thuộc (Phòng ban cha)"
          options={[
            { label: "-- Đơn vị cao nhất (Root) --", value: "none" },
            ...departmentsList
              .filter((d) => d.id !== editingDept?.id)
              .map((d) => ({ label: d.name, value: d.id })),
          ]}
          defaultValue={editingDept?.parent || "none"}
          onChange={() => setIsDirty(true)}
        />

        <BaseSelect
          label="Chức vụ mặc định (khi thêm NV mới)"
          options={[
            { label: "-- Không gán tự động --", value: "none" },
            ...positionsList.map((p) => ({ label: p.title, value: p.id })),
          ]}
          defaultValue={editingDept?.defaultRole || "none"}
          onChange={(e) => {
            setEditingDept({ ...editingDept, defaultRole: e.target.value });
            setIsDirty(true);
          }}
        />

        <StaffComboBox
          value={editingDept?.manager || ""}
          onChange={(val) => {
            setEditingDept({ ...editingDept, manager: val });
            setIsDirty(true);
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-main)", marginBottom: "0.5rem" }}
          >
            Mô tả chức năng
          </label>
          <textarea
            rows={3}
            defaultValue={editingDept?.description}
            onChange={() => setIsDirty(true)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontFamily: "inherit",
              resize: "none",
            }}
            placeholder="Mô tả tóm tắt vai trò của phòng ban..."
          />
        </div>

        {/* Staff Transfer Trigger */}
        {editingDept?.id && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              backgroundColor: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Quản lý nhân sự</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Thêm, gỡ hoặc luân chuyển nhân sự cho phòng ban này
              </div>
            </div>
            <BaseButton
              variant="outline"
              onClick={() => {
                if (onOpenTransfer) {
                  onOpenTransfer();
                  // Optionally close this modal, but keeping it open underneath is okay since it's controlled by Departments.tsx
                  // Actually, it's better if we close this modal to prevent stacked modals.
                  handleClose();
                }
              }}
            >
              Phân bổ nhân sự
            </BaseButton>
          </div>
        )}

        {/* RBAC Mapping */}
        <div
          style={{
            backgroundColor: "var(--background-alt)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--border)",
          }}
        >
          <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>
            {t("hr.rbacMapping")} cấp Phòng ban (Tự động gán quyền)
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1rem 0" }}>
            Bất kỳ nhân sự nào thuộc phòng ban này sẽ tự động nhận được các Role bên dưới (kết hợp với các Role từ chức
            vụ của họ).
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
            {(editingDept?.autoRoles || []).map((role: string) => (
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
                <span style={{ cursor: "pointer", opacity: 0.7, paddingLeft: "4px" }} onClick={() => setIsDirty(true)}>
                  &times;
                </span>
              </span>
            ))}
            {(!editingDept?.autoRoles || editingDept.autoRoles.length === 0) && (
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Chưa có Role nào được gán cho toàn bộ phòng ban
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ flex: 1 }}>
              <BaseSelect
                options={[
                  { label: "XEM BỆNH ÁN KHOA", value: "r1" },
                  { label: "QUẢN LÝ TÀI SẢN PHÒNG", value: "r2" },
                  { label: "XEM LỊCH TRỰC", value: "r3" },
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
