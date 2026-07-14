import React from "react";
import { Calculator, Download, Lock } from "lucide-react";
import { BaseButton } from "../../../shared/components/BaseButton";
import { PageHeader } from "../../../shared/components/PageHeader";

// Components
import { PayrollTable } from "./components/PayrollTable";
import { PayrollToolbar } from "./components/PayrollToolbar";

const Payroll: React.FC = () => {
  // Bảng lương Snapshot theo yêu cầu Business Logic
  const payrollData = [
    {
      id: "NV24001",
      name: "ThS. BS. Nguyễn Văn A",
      position: "Bác Sĩ Trưởng Khoa",
      baseSalary: "25,000,000",
      workingDays: 24,
      standardDays: 26,
      nightShifts: 0,
      nightAllowance: "0",
      totalSalary: "23,076,923",
      status: "paid",
    },
    {
      id: "NV24002",
      name: "Trần Thị Bé",
      position: "Điều Dưỡng Viên",
      baseSalary: "9,500,000",
      workingDays: 26,
      standardDays: 26,
      nightShifts: 12,
      nightAllowance: "3,600,000",
      totalSalary: "13,100,000",
      status: "pending",
    },
    {
      id: "NV24003",
      name: "Lê Hoàng C",
      position: "Lễ Tân",
      baseSalary: "7,000,000",
      workingDays: 14,
      standardDays: 26,
      nightShifts: 0,
      nightAllowance: "0",
      totalSalary: "3,769,230",
      status: "resigned_snapshot",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flexShrink: 0 }}>
        {/* Uses PageHeader molecule instead of inline h1/p — consistent with every other page */}
        <PageHeader
          title="Chốt Bảng Lương (Payroll Snapshot)"
          subtitle="Dữ liệu được khóa cứng (Snapshot) để đối soát kế toán. Tự động tính phụ cấp từ Bảng Xếp Ca."
          style={{ marginBottom: "var(--spacing-xl)" }}
          actions={
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <BaseButton variant="outline">
                <Download size={18} /> Xuất Excel
              </BaseButton>
              <BaseButton>
                <Calculator size={18} /> Chạy Bảng Lương Tháng
              </BaseButton>
            </div>
          }
        />

        {/* Snapshot Banner */}
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            padding: "1rem",
            borderRadius: "var(--radius-lg)",
            marginBottom: "var(--spacing-lg)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "#166534",
          }}
        >
          <Lock size={20} />
          <div>
            <span
              style={{ fontSize: "var(--text-md)", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}
            >
              Bảng lương Tháng 07/2026 đã được Khóa (Snapshot)
            </span>
            <span style={{ fontSize: "var(--text-sm)" }}>
              Toàn bộ dữ liệu Lương cơ bản, Số ngày công, Phụ cấp của tháng này đã được lưu cứng. Việc thay đổi lương cơ
              bản của nhân viên hiện tại sẽ KHÔNG làm thay đổi kết quả của bảng lương này.
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <PayrollToolbar />

        {/* Payroll Table */}
        <PayrollTable data={payrollData} />
      </div>
    </div>
  );
};

export default Payroll;
