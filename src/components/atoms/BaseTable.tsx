import React, { type ReactNode } from "react";

export interface ColumnDef<T> {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (record: T, index: number) => ReactNode;
}

export interface BaseTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (record: T, index: number) => void;
  emptyText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function BaseTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  emptyText = "Không có dữ liệu",
  className = "",
  style,
}: BaseTableProps<T>) {
  return (
    <div
      className={`base-table-container ${className}`}
      style={{
        width: "100%",
        overflowX: "auto",
        backgroundColor: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        ...style,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "var(--background-alt)", borderBottom: "1px solid var(--border)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "1rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  width: col.width,
                  textAlign: col.align || "left",
                  whiteSpace: "nowrap",
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, rowIndex) => (
              <tr
                key={record.id || rowIndex}
                onClick={() => onRowClick && onRowClick(record, rowIndex)}
                style={{
                  borderBottom: "1px solid var(--border)",
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (onRowClick) e.currentTarget.style.backgroundColor = "var(--background)";
                }}
                onMouseLeave={(e) => {
                  if (onRowClick) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "1rem",
                      textAlign: col.align || "left",
                      color: "var(--text-main)",
                    }}
                  >
                    {col.render ? col.render(record, rowIndex) : String((record as any)[col.key] || "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
