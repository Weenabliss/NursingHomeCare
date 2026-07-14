import React from "react";
import { CheckCircle2 } from "lucide-react";
import { BaseBadge } from "../../../../shared/components/BaseBadge";

interface PayrollTableProps {
  data: any[];
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ data }) => {
  return (
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
          {data.map((row) => (
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
  );
};
