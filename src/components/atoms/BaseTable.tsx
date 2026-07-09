import React, { type ReactNode } from "react";
import styles from "./BaseTable.module.scss";

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
    <div className={`${styles.container} ${className}`} style={style}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.theadTr}>
            {columns.map((col) => (
              <th key={col.key} className={styles.th} style={{ width: col.width, textAlign: col.align || "left" }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyTd}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, rowIndex) => (
              <tr
                key={record.id || rowIndex}
                onClick={() => onRowClick && onRowClick(record, rowIndex)}
                className={`${styles.tbodyTr} ${onRowClick ? styles.clickable : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td} style={{ textAlign: col.align || "left" }}>
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
