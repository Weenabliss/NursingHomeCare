import React from "react";
import { BaseButton } from "./BaseButton";

export interface BasePaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const BasePagination: React.FC<BasePaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  style,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={`base-pagination ${className}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "0.5rem 2rem",
        ...style,
      }}
    >
      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
        Hiển thị {totalItems === 0 ? 0 : startIndex} - {endIndex} trên tổng số {totalItems}
      </span>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <BaseButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Trước
        </BaseButton>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                style={{ padding: "0 0.5rem", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
              >
                ...
              </span>
            ) : (
              <BaseButton
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </BaseButton>
            )
          )}
        </div>
        <BaseButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Sau
        </BaseButton>
      </div>
    </div>
  );
};
