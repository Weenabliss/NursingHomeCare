import React from "react";
import { useTranslation } from "react-i18next";
import { Calculator, Download, CheckCircle2, Search, Lock } from "lucide-react";
import { BaseButton } from "../../components/atoms/BaseButton";
import { BaseSelect } from "../../components/atoms/BaseSelect";
import { BaseBadge } from "../../components/atoms/BaseBadge";

const Payroll: React.FC = () => {
  const { t } = useTranslation();

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "var(--spacing-xl)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.5rem",
                color: "var(--primary-dark)",
                margin: 0,
                fontWeight: 700,
              }}
            >
              Chốt Bảng Lương (Payroll Snapshot)
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                margin: "0.25rem 0 0 0",
                fontSize: "var(--text-sm)",
              }}
            >
              Dữ liệu được khóa cứng (Snapshot) để đối soát kế toán. Tự động tính phụ cấp từ Bảng Xếp Ca.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <BaseButton variant="outline">
              <Download size={18} /> Xuất Excel
            </BaseButton>
            <BaseButton>
              <Calculator size={18} /> Chạy Bảng Lương Tháng
            </BaseButton>
          </div>
        </div>

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
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 600,
                display: "block",
                marginBottom: "0.25rem",
              }}
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
        <div
          className="card-25d"
          style={{
            padding: "var(--spacing-md)",
            marginBottom: "var(--spacing-lg)",
            display: "flex",
            gap: "var(--spacing-md)",
            alignItems: "center",
          }}
        >
          <div style={{ width: "200px" }}>
            <BaseSelect
              options={[
                { label: "Tháng 07/2026", value: "07-2026" },
                { label: "Tháng 06/2026", value: "06-2026" },
              ]}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--background)",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <Search size={18} color="var(--text-muted)" style={{ marginRight: "var(--spacing-sm)" }} />
            <input
              type="text"
              placeholder={t("hr.searchStaff")}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                boxShadow: "none",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Payroll Table */}
        <div className="card-25d" style={{ overflow: "auto", padding: 0, flex: 1, marginBottom: "1rem" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--background-alt)",
                  borderBottom: "2px solid var(--border)",
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  Mã NV
                </th>
                <th
                  style={{
                    padding: "1rem",
                    color: "var(--text-main)",
                    fontWeight: 600,
                  }}
                >
                  Họ và Tên
                </th>
                <th
                  style={{
                    padding: "1rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  Lương cơ bản (Lưu cứng)
                </th>
                <th
                  style={{
                    padding: "1rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Công chuẩn/Thực tế
                </th>
                <th
                  style={{
                    padding: "1rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Phụ cấp Ca đêm
                </th>
                <th
                  style={{
                    padding: "1rem",
                    color: "var(--primary-dark)",
                    fontWeight: 700,
                    textAlign: "right",
                  }}
                >
                  Tổng thực nhận
                </th>
                <th
                  style={{
                    padding: "1rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody>
              {payrollData.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td
                    style={{
                      padding: "1rem",
                      color: "var(--primary-main)",
                      fontWeight: 500,
                    }}
                  >
                    {row.id}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{row.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{row.position}</div>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-main)" }}>{row.baseSalary} ₫</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <span
                      style={{
                        fontWeight: 600,
                        color: row.workingDays < row.standardDays ? "#b91c1c" : "var(--text-main)",
                      }}
                    >
                      {row.workingDays}
                    </span>{" "}
                    / {row.standardDays}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <div style={{ color: "#4338ca", fontWeight: 600 }}>{row.nightAllowance} ₫</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>({row.nightShifts} ca)</div>
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "var(--primary-dark)",
                      fontSize: "1.05rem",
                    }}
                  >
                    {row.totalSalary} ₫
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    {row.status === "paid" && (
                      <BaseBadge variant="success">
                        <CheckCircle2 size={12} style={{ marginRight: 4 }} /> Đã thanh toán
                      </BaseBadge>
                    )}
                    {row.status === "pending" && <BaseBadge variant="warning">Chưa thanh toán</BaseBadge>}
                    {row.status === "resigned_snapshot" && <BaseBadge variant="default">Đã chốt (Nghỉ việc)</BaseBadge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
