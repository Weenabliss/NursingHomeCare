import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Plus, Wallet, Banknote, BadgeDollarSign, Settings } from "lucide-react";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BankSelect } from "../../../components/atoms/BankSelect";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { AllowanceSelect } from "../../../components/molecules/AllowanceSelect";
import type { Staff, StaffAllowance } from "../../../mock/staff";
import { positionsMockData } from "../../../mock/departments";
import { BASE_WAGE, BANKS } from "../../../constants/payroll";
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

  const [allowances, setAllowances] = useState<StaffAllowance[]>(staff.allowances || []);
  const [bankCode, setBankCode] = useState<string>(staff.bankAccount?.bankCode || "");
  const [accountNo, setAccountNo] = useState<string>(staff.bankAccount?.accountNo || "");
  const [isManageAllowancesOpen, setIsManageAllowancesOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAllowances(staff.allowances || []);
      setBankCode(staff.bankAccount?.bankCode || "");
      setAccountNo(staff.bankAccount?.accountNo || "");
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
      { id: `NEW-${Date.now()}`, name: "", amount: 0 },
    ]);
    markDirty();
  };

  const handleRemoveAllowance = (idx: number) => {
    setAllowances(allowances.filter((_, i) => i !== idx));
    markDirty();
  };

  const handleAllowanceChange = (idx: number, updates: Partial<StaffAllowance>) => {
    const next = [...allowances];
    next[idx] = { ...next[idx], ...updates };
    setAllowances(next);
    markDirty();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thu nhập & Thanh toán"
      confirmText={t("common.save")}
      onConfirm={onClose}
      isDirty={isDirty}
      maxWidth="850px"
    >
      <div className={styles.layout}>

        {/* ── LEFT COLUMN ── */}
        <div 
          className={styles.leftColumn}
          style={{ 
            opacity: isManageAllowancesOpen ? 0.4 : 1, 
            pointerEvents: isManageAllowancesOpen ? "none" : "auto", 
            transition: "all 0.2s" 
          }}
        >

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
            {/* Header: tiêu đề + Thêm trợ cấp */}
            <div className={styles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className={styles.sectionTitle}>Các khoản trợ cấp</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <BaseButton variant={isManageAllowancesOpen ? "primary" : "outline"} size="sm" onClick={() => setIsManageAllowancesOpen(!isManageAllowancesOpen)}>
                  <Settings size={14} /> Quản lý
                </BaseButton>
                {!isManageAllowancesOpen && (
                  <BaseButton variant="outline" size="sm" onClick={handleAddAllowance}>
                    <Plus size={14} /> Thêm
                  </BaseButton>
                )}
              </div>
            </div>

            {isManageAllowancesOpen && (
              <div style={{ marginBottom: "1rem" }}>
                <AllowanceSelect
                  value=""
                  onChange={() => {}}
                  isSettingsExpanded={true}
                  onToggleSettings={() => setIsManageAllowancesOpen(false)}
                  hideSettingsIcon={true}
                  hideSelectBox={true}
                />
              </div>
            )}

            <div className={styles.allowanceBody}>
              {!isManageAllowancesOpen && (
                <div className={styles.allowanceList}>
                  {allowances.length === 0 ? (
                    <div className={styles.emptyState}>Chưa có khoản trợ cấp nào</div>
                  ) : (
                  allowances.map((allowance, idx) => {
                    return (
                      <div key={idx} className={styles.allowanceItem}>
                        <div className={styles.allowanceRow1}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <AllowanceSelect
                              value={allowance.id}
                              onChange={(id, name, amount) => {
                                handleAllowanceChange(idx, { id, name, amount });
                              }}
                              hideSettingsIcon={true}
                            />
                          </div>
                          <button className={styles.deleteBtn} onClick={() => handleRemoveAllowance(idx)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              )}
            </div>{/* end allowanceBody */}
          </div>
        </div>

      </div>
    </BaseModal>
  );
};
