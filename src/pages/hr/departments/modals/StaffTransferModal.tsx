import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "../../../../shared/components/BaseModal";
import { BaseButton } from "../../../../shared/components/BaseButton";
import { Search, ChevronRight, ChevronLeft, Users } from "lucide-react";
import { staffListMock } from "../../../../mock/staff";
import styles from "./StaffTransferModal.module.scss";

interface StaffTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  departmentName: string;
}

export const StaffTransferModal: React.FC<StaffTransferModalProps> = ({
  isOpen,
  onClose,
  departmentId,
  departmentName,
}) => {
  const { t } = useTranslation();

  // State: the set of IDs currently assigned to THIS department.
  const initialAssignedIds = useMemo(() => {
    return staffListMock
      .filter((s: any) => s.department === departmentName || s.departmentId === departmentId)
      .map((s) => s.id);
  }, [departmentId, departmentName, isOpen]);

  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set(initialAssignedIds));
  const [isDirty, setIsDirty] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setAssignedIds(new Set(initialAssignedIds));
      setIsDirty(false);
      setLeftSearch("");
      setRightSearch("");
      setLeftSelected(new Set());
      setRightSelected(new Set());
    }
  }, [isOpen, initialAssignedIds]);

  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");

  const [leftSelected, setLeftSelected] = useState<Set<string>>(new Set());
  const [rightSelected, setRightSelected] = useState<Set<string>>(new Set());

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    console.log("Bulk update staff for department", departmentId, Array.from(assignedIds));
    setIsDirty(false);
    onClose();
  };

  const allStaff = useMemo(() => staffListMock, []);

  const leftList = useMemo(() => {
    return allStaff.filter(
      (s) =>
        !assignedIds.has(s.id) &&
        (s.name.toLowerCase().includes(leftSearch.toLowerCase()) ||
          s.id.toLowerCase().includes(leftSearch.toLowerCase()))
    );
  }, [allStaff, assignedIds, leftSearch]);

  const rightList = useMemo(() => {
    return allStaff.filter(
      (s) =>
        assignedIds.has(s.id) &&
        (s.name.toLowerCase().includes(rightSearch.toLowerCase()) ||
          s.id.toLowerCase().includes(rightSearch.toLowerCase()))
    );
  }, [allStaff, assignedIds, rightSearch]);

  const toggleLeftSelect = (id: string) => {
    const next = new Set(leftSelected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setLeftSelected(next);
  };

  const toggleRightSelect = (id: string) => {
    const next = new Set(rightSelected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRightSelected(next);
  };

  const moveRight = () => {
    if (leftSelected.size === 0) return;
    const nextAssigned = new Set(assignedIds);
    leftSelected.forEach((id) => nextAssigned.add(id));
    setAssignedIds(nextAssigned);
    setLeftSelected(new Set());
    setIsDirty(true);
  };

  const moveLeft = () => {
    if (rightSelected.size === 0) return;
    const nextAssigned = new Set(assignedIds);
    rightSelected.forEach((id) => nextAssigned.delete(id));
    setAssignedIds(nextAssigned);
    setRightSelected(new Set());
    setIsDirty(true);
  };

  const selectAllLeft = () => {
    if (leftSelected.size === leftList.length) {
      setLeftSelected(new Set());
    } else {
      setLeftSelected(new Set(leftList.map((s) => s.id)));
    }
  };

  const selectAllRight = () => {
    if (rightSelected.size === rightList.length) {
      setRightSelected(new Set());
    } else {
      setRightSelected(new Set(rightList.map((s) => s.id)));
    }
  };

  const renderStaffItem = (staff: any, isSelected: boolean, onToggle: () => void) => (
    <div
      key={staff.id}
      onClick={onToggle}
      className={`${styles.staffItem} ${isSelected ? styles.selected : ""}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        readOnly
        style={{ cursor: "pointer", accentColor: "var(--primary)" }}
      />
      <img
        src={staff.avatar}
        alt={staff.name}
        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {staff.name}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: "6px" }}>
          <span>{staff.id}</span>
          <span>&bull;</span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{staff.department || "Chưa phân bổ"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Quản lý Nhân sự: ${departmentName || "Phòng ban mới"}`}
      confirmText={t("common.save")}
      onConfirm={handleSave}
      isDirty={isDirty}
      maxWidth="1000px"
    >
      <div style={{ display: "flex", gap: "1rem", height: "65vh", minHeight: "450px" }}>
        {/* Left Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "#fff" }}>
          <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--background-alt)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)", display: "flex", justifyContent: "space-between" }}>
              <span>Danh sách luân chuyển</span>
              <span style={{ color: "var(--primary)", backgroundColor: "#eef2ff", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem" }}>
                {leftList.length}
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Tìm tên, mã NV..."
                value={leftSearch}
                onChange={(e) => setLeftSearch(e.target.value)}
                style={{ width: "100%", padding: "6px 10px 6px 32px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <input type="checkbox" checked={leftList.length > 0 && leftSelected.size === leftList.length} onChange={selectAllLeft} style={{ accentColor: "var(--primary)" }} />
                Chọn tất cả
              </label>
              <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 500 }}>
                {leftSelected.size > 0 ? `Đã chọn ${leftSelected.size}` : ""}
              </span>
            </div>
          </div>
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", scrollbarGutter: "stable" }}>
            {leftList.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>Không tìm thấy nhân sự</div>
            ) : (
              leftList.map((s) => renderStaffItem(s, leftSelected.has(s.id), () => toggleLeftSelect(s.id)))
            )}
          </div>
        </div>

        {/* Center Controls */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem" }}>
          <BaseButton
            variant="primary"
            onClick={moveRight}
            disabled={leftSelected.size === 0}
            style={{ width: "44px", height: "44px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", opacity: leftSelected.size === 0 ? 0.5 : 1 }}
            title="Thêm vào phòng ban"
          >
            <ChevronRight size={24} />
          </BaseButton>
          <BaseButton
            variant="outline"
            onClick={moveLeft}
            disabled={rightSelected.size === 0}
            style={{ width: "44px", height: "44px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", opacity: rightSelected.size === 0 ? 0.5 : 1 }}
            title="Gỡ khỏi phòng ban"
          >
            <ChevronLeft size={24} />
          </BaseButton>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", border: "1px solid var(--primary)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", backgroundColor: "#eef2ff", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--primary-dark)", display: "flex", justifyContent: "space-between" }}>
              <span>Nhân sự thuộc phòng</span>
              <span style={{ color: "#fff", backgroundColor: "var(--primary)", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem" }}>
                {rightList.length}
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Tìm tên, mã NV..."
                value={rightSearch}
                onChange={(e) => setRightSearch(e.target.value)}
                style={{ width: "100%", padding: "6px 10px 6px 32px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", outline: "none", backgroundColor: "#fff" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <input type="checkbox" checked={rightList.length > 0 && rightSelected.size === rightList.length} onChange={selectAllRight} style={{ accentColor: "var(--primary)" }} />
                Chọn tất cả
              </label>
              <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 500 }}>
                {rightSelected.size > 0 ? `Đã chọn ${rightSelected.size}` : ""}
              </span>
            </div>
          </div>
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", scrollbarGutter: "stable" }}>
            {rightList.length === 0 ? (
              <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <Users size={32} opacity={0.5} />
                <span>Chưa có nhân sự nào được gán</span>
              </div>
            ) : (
              rightList.map((s) => renderStaffItem(s, rightSelected.has(s.id), () => toggleRightSelect(s.id)))
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
