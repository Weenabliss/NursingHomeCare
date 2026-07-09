import React, { type ReactNode } from "react";
import { BaseTable, type ColumnDef } from "../atoms/BaseTable";
import { BasePagination } from "../atoms/BasePagination";
import { Toolbar } from "../molecules/Toolbar";
import styles from "./DataGrid.module.scss";

interface DataGridProps<T> {
  // Toolbar props
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  toolbarActions?: ReactNode;
  hideToolbar?: boolean;

  // Table props
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (record: T, index: number) => void;
  emptyText?: string;

  // Pagination props
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  hidePagination?: boolean;

  className?: string;
  style?: React.CSSProperties;
}

export function DataGrid<T extends { id?: string | number }>({
  onSearch,
  searchPlaceholder,
  filters,
  toolbarActions,
  hideToolbar = false,

  columns,
  data,
  onRowClick,
  emptyText,

  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  hidePagination = false,

  className = "",
  style,
}: DataGridProps<T>) {
  return (
    <div className={`${styles.grid} ${className}`} style={style}>
      {!hideToolbar && (
        <Toolbar
          onSearch={onSearch}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          actions={toolbarActions}
          className={styles.toolbar}
        />
      )}

      <BaseTable columns={columns} data={data} onRowClick={onRowClick} emptyText={emptyText} />

      {!hidePagination && totalItems > 0 && (
        <BasePagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
