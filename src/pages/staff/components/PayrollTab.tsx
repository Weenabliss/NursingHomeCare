import React from "react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

interface PayrollTabProps {
  staff: Staff;
}

export const PayrollTab: React.FC<PayrollTabProps> = ({ staff: _staff }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <BaseCard>
        <h3 className={styles.infoSectionTitle}>Thu nhập & Thanh toán</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
              Mức lương cơ bản
            </span>
            <span style={{ fontWeight: 600, color: "#16a34a" }}>Đã ẩn (Bảo mật)</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
              Phụ cấp
            </span>
            <span style={{ fontWeight: 500 }}>Ăn trưa, Điện thoại</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
              Số tài khoản
            </span>
            <span style={{ fontWeight: 500 }}>1903xxxxxx (Techcombank)</span>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <h3 className={styles.infoSectionTitle}>Thuế & Bảo hiểm</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
              Mã số thuế (TNCN)
            </span>
            <span style={{ fontWeight: 600 }}>830xxxxxxx</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
              Mã số sổ BHXH
            </span>
            <span style={{ fontWeight: 600 }}>011xxxxxxx</span>
          </div>
        </div>
      </BaseCard>
    </div>
  );
};
