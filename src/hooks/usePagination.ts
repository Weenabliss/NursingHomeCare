import { useState, useEffect } from "react";

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  /** Slice the provided full data array to the current page */
  paginate: (data: T[]) => T[];
}

/**
 * Reusable pagination hook.
 * Manages currentPage state and slices data for the current page.
 *
 * @example
 * const { currentPage, totalPages, paginate, setCurrentPage } = usePagination({ totalItems: staffList.length });
 * const currentItems = paginate(staffList);
 */
export function usePagination<T = unknown>({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Clamp currentPage when totalItems changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginate = (data: T[]): T[] => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    paginate,
  };
}
