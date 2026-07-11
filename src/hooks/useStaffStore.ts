import { useState, useCallback } from "react";
import { staffListMock } from "../mock/staff";
import type { Staff } from "../mock/staff";

/**
 * Hook quản lý danh sách nhân viên (thêm, xóa, cập nhật).
 * Giả lập store dùng useState — sẵn sàng thay bằng API call thực.
 */
export const useStaffStore = () => {
  const [staffList, setStaffList] = useState<Staff[]>(() =>
    [...staffListMock]
  );

  const addStaff = useCallback((newStaff: Staff) => {
    setStaffList((prev) => [newStaff, ...prev]);
  }, []);

  const updateStaff = useCallback((updated: Staff) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }, []);

  const deleteStaff = useCallback((id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { staffList, addStaff, updateStaff, deleteStaff };
};
