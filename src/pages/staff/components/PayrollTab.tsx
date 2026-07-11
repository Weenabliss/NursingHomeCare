import React from "react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { InfoField } from "../../../components/atoms/InfoField";
import { useFormModal } from "../../../hooks/useFormModal";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";
import { IncomeModal } from "../modals/IncomeModal";
import { TaxModal } from "../modals/TaxModal";

interface PayrollTabProps {
  staff: Staff;
}

export const PayrollTab: React.FC<PayrollTabProps> = ({ staff }) => {
  const incomeModal = useFormModal(staff);
  const taxModal = useFormModal(staff);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Thu nhập & Thanh toán */}
        <BaseCard
          isSelected={incomeModal.isOpen}
          onClick={incomeModal.openModal}
        >
          <h3 className={styles.infoSectionTitle}>Thu nhập & Thanh toán</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField 
                label="Lương cơ bản (Hệ số x Lương CS)" 
                value={
                  <span style={{ fontWeight: 600, color: "#16a34a" }}>Đã ẩn (Bảo mật)</span>
                } 
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField 
                label="Tổng trợ cấp" 
                value={
                  <span style={{ fontWeight: 600, color: "#16a34a" }}>Đã ẩn (Bảo mật)</span>
                } 
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField 
                label="Tài khoản nhận lương" 
                value={
                  <span style={{ fontWeight: 600, color: "var(--text-tertiary)", fontStyle: "italic" }}>Đã ẩn (Bảo mật)</span>
                } 
              />
            </div>
          </div>
        </BaseCard>

        {/* Thuế & Bảo hiểm */}
        <BaseCard
          isSelected={taxModal.isOpen}
          onClick={taxModal.openModal}
        >
          <h3 className={styles.infoSectionTitle}>Thuế & Bảo hiểm</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Mã số thuế (TNCN)" value={<span style={{ fontWeight: 600 }}>830xxxxxxx</span>} />
            <InfoField label="Mã số sổ BHXH" value={<span style={{ fontWeight: 600 }}>011xxxxxxx</span>} />
            <InfoField label="Mã số BHYT" value="DN4011xxxxxxx" />
          </div>
        </BaseCard>
      </div>

      <IncomeModal
        staff={staff}
        isOpen={incomeModal.isOpen}
        onClose={incomeModal.closeModal}
        isDirty={incomeModal.isDirty}
        markDirty={incomeModal.markDirty}
      />

      <TaxModal
        isOpen={taxModal.isOpen}
        onClose={taxModal.closeModal}
        isDirty={taxModal.isDirty}
        markDirty={taxModal.markDirty}
      />
    </>
  );
};
