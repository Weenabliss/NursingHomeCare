import React from "react";
import { Banknote, FileText } from "lucide-react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { InfoField } from "../../../shared/components/InfoField";
import { BaseButton } from "../../../shared/components/BaseButton";
import { useFormModal } from "../../../shared/hooks/useFormModal";
import type { Staff, Payslip } from "../../../modules/hr/types";
import { usePayrollByStaff, useGeneratePayroll } from "../../../modules/hr/hooks/usePayrollQuery";
import styles from "../StaffDetail.module.scss";
import { IncomeModal } from "../modals/IncomeModal";
import { TaxModal } from "../modals/TaxModal";

interface PayrollTabProps {
  staff: Staff;
}

export const PayrollTab: React.FC<PayrollTabProps> = ({ staff }) => {
  const incomeModal = useFormModal(staff);
  const taxModal = useFormModal(staff);

  const { data: payslips, isLoading } = usePayrollByStaff(staff.personal.id || "");
  const { mutate: generatePayroll, isPending: isGenerating } = useGeneratePayroll();

  const handleGenerate = () => {
    const today = new Date();
    generatePayroll({ month: today.getMonth() + 1, year: today.getFullYear() });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status: Payslip["status"]) => {
    switch (status) {
      case "paid":
        return <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, backgroundColor: "#dcfce7", color: "#15803d" }}>Đã thanh toán</span>;
      case "approved":
        return <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, backgroundColor: "#e0f2fe", color: "#0369a1" }}>Đã duyệt</span>;
      case "reviewing":
        return <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, backgroundColor: "#fef08a", color: "#a16207" }}>Chờ duyệt</span>;
      case "draft":
        return <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, backgroundColor: "#f1f5f9", color: "#475569" }}>Bản nháp</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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

      {/* Lịch sử trả lương */}
      <BaseCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 className={styles.infoSectionTitle} style={{ margin: 0 }}>Lịch sử trả lương (Payslips)</h3>
          <BaseButton variant="primary" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Đang tạo..." : "Tính lương tháng này"}
          </BaseButton>
        </div>

        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải dữ liệu...</div>
        ) : payslips && payslips.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th style={{ padding: "0.75rem" }}>Kỳ lương</th>
                <th style={{ padding: "0.75rem" }}>Lương cơ bản</th>
                <th style={{ padding: "0.75rem" }}>Tổng thu nhập</th>
                <th style={{ padding: "0.75rem" }}>Khấu trừ</th>
                <th style={{ padding: "0.75rem" }}>Thực nhận</th>
                <th style={{ padding: "0.75rem" }}>Trạng thái</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 600 }}>Tháng {p.month}/{p.year}</td>
                  <td style={{ padding: "0.75rem" }}>{formatCurrency(p.baseSalary)}</td>
                  <td style={{ padding: "0.75rem", color: "#16a34a", fontWeight: 500 }}>{formatCurrency(p.grossSalary)}</td>
                  <td style={{ padding: "0.75rem", color: "#dc2626" }}>{formatCurrency(p.taxDeduction + p.insuranceDeduction)}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>{formatCurrency(p.netSalary)}</td>
                  <td style={{ padding: "0.75rem" }}>{getStatusBadge(p.status)}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>
                    <BaseButton variant="outline" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
                      <FileText size={14} style={{ marginRight: "4px" }} /> Chi tiết
                    </BaseButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <Banknote size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <p>Chưa có dữ liệu phiếu lương.</p>
          </div>
        )}
      </BaseCard>

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
    </div>
  );
};
