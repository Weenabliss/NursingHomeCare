import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Plus, Wallet, Banknote, BadgeDollarSign, ShieldCheck, Check, X, Pencil } from "lucide-react";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { BankSelect } from "../../../components/atoms/BankSelect";
import { BaseButton } from "../../../components/atoms/BaseButton";
import type { Staff, StaffAllowance } from "../../../mock/staff";
import { positionsMockData } from "../../../mock/departments";
import { BASE_WAGE, BANKS } from "../../../constants/payroll";
import { usePayroll } from "../../../contexts/PayrollContext";
import { hasRole } from "../../../mock/auth";
import styles from "./IncomeModal.module.scss";

interface IncomeModalProps {
  staff: Staff;
  isOpen: boolean;
  onClose: () => void;
  isDirty: boolean;
  markDirty: () => void;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({ staff, isOpen, onClose, isDirty, markDirty }) => {
  const { t } = useTranslation();
  const { allowanceTypes, addAllowanceType, updateAllowanceType } = usePayroll();
  const isSuperAdmin = hasRole("SUPER_ADMIN");

  const [allowances, setAllowances] = useState<StaffAllowance[]>(staff.allowances || []);
  const [bankCode, setBankCode] = useState<string>(staff.bankAccount?.bankCode || "");
  const [accountNo, setAccountNo] = useState<string>(staff.bankAccount?.accountNo || "");

  // State cho inline form thêm/sửa loại trợ cấp
  const [showNewTypeForm, setShowNewTypeForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeAmount, setNewTypeAmount] = useState<number>(0);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAllowances(staff.allowances || []);
      setBankCode(staff.bankAccount?.bankCode || "");
      setAccountNo(staff.bankAccount?.accountNo || "");
      setShowNewTypeForm(false);
      setEditingTypeId(null);
      setNewTypeName("");
      setNewTypeAmount(0);
    }
  }, [isOpen, staff]);

  const { multiplier, baseSalary } = useMemo(() => {
    const pos = positionsMockData.find((p) => p.title === staff.position || p.id === staff.position);
    const m = pos?.baseSalaryMultiplier || 1.0;
    return { multiplier: m, baseSalary: m * BASE_WAGE };
  }, [staff.position]);

  const totalAllowance = useMemo(
    () => allowances.reduce((sum, a) => sum + (a.amount || 0), 0),
    [allowances]
  );

  const handleAddAllowance = () => {
    setAllowances([
      ...allowances,
      { id: `NEW-${Date.now()}`, name: "", amount: 0, isCustom: true },
    ]);
    markDirty();
  };

  const handleRemoveAllowance = (idx: number) => {
    setAllowances(allowances.filter((_, i) => i !== idx));
    markDirty();
  };

  const handleAllowanceChange = (idx: number, field: keyof StaffAllowance, val: any) => {
    const next = [...allowances];
    next[idx] = { ...next[idx], [field]: val };

    if (field === "id") {
      const preset = allowanceTypes.find((opt) => opt.id === val);
      if (preset) {
        next[idx].name = preset.name;
        next[idx].amount = preset.amount;
        next[idx].isCustom = false;
      } else if (val === "CUSTOM") {
        next[idx].name = "";
        next[idx].amount = 0;
        next[idx].isCustom = true;
      }
    }

    setAllowances(next);
    markDirty();
  };

  // Thêm loại trợ cấp mới vào danh sách toàn cục (chỉ SUPER_ADMIN)
  const handleSaveNewType = () => {
    if (!newTypeName.trim() || newTypeAmount <= 0) return;
    if (editingTypeId) {
      // Sửa loại đã có
      updateAllowanceType(editingTypeId, { name: newTypeName.trim(), amount: newTypeAmount });
      setEditingTypeId(null);
    } else {
      // Thêm mới
      addAllowanceType({ name: newTypeName.trim(), amount: newTypeAmount });
    }
    setShowNewTypeForm(false);
    setNewTypeName("");
    setNewTypeAmount(0);
  };

  const handleStartEdit = (type: { id: string; name: string; amount: number }) => {
    setEditingTypeId(type.id);
    setNewTypeName(type.name);
    setNewTypeAmount(type.amount);
    setShowNewTypeForm(true);
  };

  const handleCancelForm = () => {
    setShowNewTypeForm(false);
    setEditingTypeId(null);
    setNewTypeName("");
    setNewTypeAmount(0);
  };

  const allowanceOptions = [
    { label: "--- Chọn loại trợ cấp ---", value: "" },
    ...allowanceTypes.map((opt) => ({ label: opt.name, value: opt.id })),
    { label: "✏️ Khác (Tùy chỉnh)", value: "CUSTOM" },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thu nhập & Thanh toán"
      confirmText={t("common.save")}
      onConfirm={onClose}
      isDirty={isDirty}
      maxWidth="800px"
    >
      <div className={styles.layout}>

        {/* ── LEFT COLUMN ── */}
        <div className={styles.leftColumn}>

          {/* Lương cơ bản */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Banknote size={15} className={styles.sectionIcon} />
              <span className={styles.sectionTitle}>Lương cơ bản</span>
            </div>
            <div className={styles.salaryCard}>
              <div className={styles.salaryAmount}>
                {new Intl.NumberFormat("vi-VN").format(baseSalary)}
                <span className={styles.salaryUnit}> đ</span>
              </div>
              <div className={styles.salaryMeta}>
                Hệ số <strong>{multiplier.toFixed(2)}</strong> × Lương cơ sở{" "}
                <strong>{new Intl.NumberFormat("vi-VN").format(BASE_WAGE)}</strong> đ
              </div>
              <div className={styles.salaryPosition}>
                Chức vụ: <em>{staff.position}</em>
              </div>
            </div>
          </div>

          {/* Tài khoản nhận lương */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Wallet size={15} className={styles.sectionIcon} />
              <span className={styles.sectionTitle}>Tài khoản nhận lương</span>
            </div>
            <BankSelect
              label="Ngân hàng"
              options={BANKS}
              value={bankCode}
              onChange={(val) => { setBankCode(val); markDirty(); }}
            />
            <div className={styles.bankAccountNo}>
              <BaseInput
                label="Số tài khoản"
                type="text"
                value={accountNo}
                onChange={(e) => { setAccountNo(e.target.value); markDirty(); }}
              />
            </div>
          </div>

          {/* Tổng thu nhập */}
          <div className={styles.totalCard}>
            <div className={styles.sectionHeader} style={{ marginBottom: "0.25rem" }}>
              <BadgeDollarSign size={15} className={styles.sectionIcon} />
              <span className={styles.sectionTitle}>Tổng thu nhập</span>
            </div>
            <div className={styles.totalRow}>
              <span>Lương cơ bản</span>
              <span className={styles.amount}>{new Intl.NumberFormat("vi-VN").format(baseSalary)} đ</span>
            </div>
            <div className={styles.totalRow}>
              <span>Trợ cấp</span>
              <span className={styles.amount}>{new Intl.NumberFormat("vi-VN").format(totalAllowance)} đ</span>
            </div>
            <div className={styles.totalDivider} />
            <div className={`${styles.totalRow} ${styles.totalFinal}`}>
              <span>Tổng cộng</span>
              <span className={styles.amountFinal}>{new Intl.NumberFormat("vi-VN").format(baseSalary + totalAllowance)} đ</span>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className={styles.rightColumn}>
          <div className={styles.allowanceSection}>

            {/* Header: tiêu đề + 2 nút (Quản lý danh mục [SUPER_ADMIN] + Thêm trợ cấp) */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Các khoản trợ cấp</span>
              {isSuperAdmin && (
                <BaseButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (showNewTypeForm) {
                      handleCancelForm();
                    } else {
                      setShowNewTypeForm(true);
                      setEditingTypeId(null);
                      setNewTypeName("");
                      setNewTypeAmount(0);
                    }
                  }}
                  title="Quản trị: Thêm/sửa loại trợ cấp trong danh sách"
                >
                  <ShieldCheck size={14} />
                  {showNewTypeForm ? " Huỷ" : " Quản lý"}
                </BaseButton>
              )}
              <BaseButton variant="outline" size="sm" onClick={handleAddAllowance}>
                <Plus size={14} /> Thêm
              </BaseButton>
            </div>

            {/* allowanceBody: form (shrink=0) + list (flex:1 scroll) */}
            <div className={styles.allowanceBody}>

              {/* Inline form tạo/sửa loại trợ cấp – chỉ SUPER_ADMIN */}
              {isSuperAdmin && showNewTypeForm && (
                <div className={styles.newTypeForm}>
                  <div className={styles.newTypeFormBadge}>
                    <ShieldCheck size={13} />
                    {editingTypeId
                      ? `Sửa loại trợ cấp (toàn hệ thống)`
                      : `Tạo loại trợ cấp mới (áp dụng cho toàn hệ thống)`}
                  </div>
                  <div className={styles.newTypeFields}>
                    {/* Dùng native input để tránh bug random ID re-mount của BaseInput */}
                    <input
                      className={styles.nativeInput}
                      type="text"
                      placeholder="Tên loại trợ cấp..."
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                    />
                    <input
                      className={styles.nativeInput}
                      type="number"
                      placeholder="Số tiền (VNĐ)"
                      value={newTypeAmount || ""}
                      onChange={(e) => setNewTypeAmount(Number(e.target.value))}
                    />
                    <div className={styles.newTypeActions}>
                      <button
                        className={styles.confirmBtn}
                        onClick={handleSaveNewType}
                        disabled={!newTypeName.trim() || newTypeAmount <= 0}
                        title="Lưu loại trợ cấp"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={handleCancelForm}
                        title="Huỷ"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Danh m\u1ee5c lo\u1ea1i tr\u1ee3 c\u1ea5p hi\u1ec7n c\u00f3 \u2013 ch\u1ec9 hi\u1ec7n khi m\u1edf qu\u1ea3n l\u00fd */}
              {isSuperAdmin && showNewTypeForm && !editingTypeId && (
                <div style={{ marginBottom: "0.5rem" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", padding: "0 4px" }}>
                    Danh m\u1ee5c hi\u1ec7n c\u00f3:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "150px", overflowY: "auto" }}>
                    {allowanceTypes.map((type) => (
                      <div key={type.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                        <div>
                          <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{type.name}</span>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "8px" }}>
                            {new Intl.NumberFormat("vi-VN").format(type.amount)} đ
                          </span>
                        </div>
                        <button
                          onClick={() => handleStartEdit(type)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", padding: "2px 6px", borderRadius: "4px" }}
                          title="S\u1eeda lo\u1ea1i tr\u1ee3 c\u1ea5p"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scrollable allowance list */}
              <div className={styles.allowanceList}>
                {allowances.length === 0 ? (
                  <div className={styles.emptyState}>Chưa có khoản trợ cấp nào</div>
                ) : (
                  allowances.map((allowance, idx) => {
                    const presetId = allowance.isCustom
                      ? "CUSTOM"
                      : allowanceTypes.find((a) => a.id === allowance.id)?.id || "CUSTOM";

                    return (
                      <div key={idx} className={styles.allowanceItem}>
                        <div className={styles.allowanceRow1}>
                          <BaseSelect
                            options={allowanceOptions}
                            value={presetId}
                            onChange={(e) => handleAllowanceChange(idx, "id", e.target.value)}
                          />
                          <BaseInput
                            type="number"
                            placeholder="Số tiền"
                            value={allowance.amount}
                            readOnly={!allowance.isCustom}
                            onChange={(e) => handleAllowanceChange(idx, "amount", Number(e.target.value))}
                            style={{ backgroundColor: !allowance.isCustom ? "#f1f5f9" : "#fff" }}
                          />
                          <button className={styles.deleteBtn} onClick={() => handleRemoveAllowance(idx)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                        {allowance.isCustom && (
                          <div className={styles.allowanceNameRow}>
                            <BaseInput
                              placeholder="Nhập tên trợ cấp..."
                              value={allowance.name}
                              onChange={(e) => handleAllowanceChange(idx, "name", e.target.value)}
                            />
                            <div /> {/* Thêm div trống để chiếm cột 32px của grid, giúp căn phải hoàn hảo với ô Số tiền */}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>{/* end allowanceBody */}
          </div>
        </div>

      </div>
    </BaseModal>
  );
};
