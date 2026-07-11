import React, { useState, useEffect, useMemo } from "react";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseCheckbox } from "../../../components/atoms/BaseCheckbox";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { StaffSearchSelect } from "../../../components/atoms/StaffSearchSelect";
import { useLeaveSwap } from "../../../contexts/LeaveSwapContext";

interface ManualShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newShifts: { shift: string; type: string }[]) => void;
  staff: any;
  dateLabel: string;
  currentShifts: { shift: string; type: string }[];
  rosterData: any[];
  dayIndex: number;
}

const SHIFT_OPTIONS = [
  { label: "Ca Sáng (06:00 - 14:00)", value: "SÁNG", type: "morning" },
  { label: "Ca Chiều (14:00 - 22:00)", value: "CHIỀU", type: "afternoon" },
  { label: "Ca Đêm (22:00 - 06:00)", value: "ĐÊM", type: "night" },
  { label: "Hành Chính (08:00 - 17:00)", value: "HC", type: "morning" },
];

type ActiveTab = "edit" | "swap" | "leave";

const TAB_BTN_STYLE = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: "10px",
  background: "none",
  border: "none",
  borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
  color: active ? "var(--primary)" : "var(--text-muted)",
  fontWeight: active ? 600 : 500,
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.15s",
});

export const ManualShiftModal: React.FC<ManualShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  staff,
  dateLabel,
  currentShifts,
  rosterData,
  dayIndex,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("edit");
  const { createSwapRequest, createLeaveRequest } = useLeaveSwap();

  // Swap form state
  const [targetStaffId, setTargetStaffId] = useState("");
  const [targetShift, setTargetShift] = useState("");
  const [swapReason, setSwapReason] = useState("");

  // Leave form state
  const [leaveReason, setLeaveReason] = useState("");

  const otherStaffWorking = useMemo(() => {
    if (!isOpen) return [];
    return rosterData.filter((row: any) => {
      if (row.staff.id === staff?.id) return false;
      const shifts = row.schedule[dayIndex];
      return (
        shifts &&
        shifts.length > 0 &&
        !shifts.some(
          (s: any) =>
            s.type === "leave" ||
            s.type === "leave-pending" ||
            s.type === "leave-rejected"
        )
      );
    });
  }, [rosterData, staff, dayIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedValues(currentShifts.map((s) => s.shift));
      setActiveTab("edit");
      setTargetStaffId("");
      setTargetShift("");
      setSwapReason("");
      setLeaveReason("");
    }
  }, [currentShifts, isOpen]);

  const handleToggle = (val: string, checked: boolean) => {
    if (checked) {
      setSelectedValues((prev) => [...prev, val]);
    } else {
      setSelectedValues((prev) => prev.filter((v) => v !== val));
    }
  };

  // Parse date from label e.g. "Thứ 3 (12/08)" → "2026-08-12"
  const parsedDate = (() => {
    const match = dateLabel.match(/\((\d{2})\/(\d{2})\)/);
    if (match) return `2026-${match[2]}-${match[1]}`;
    return "2026-08-15";
  })();

  const handleSave = () => {
    if (activeTab === "leave") {
      if (!leaveReason.trim()) {
        alert("Vui lòng nhập lý do xin nghỉ.");
        return;
      }
      const hasExistingShifts = currentShifts.some(
        (s) => !s.type.startsWith("leave")
      );
      if (hasExistingShifts) {
        const confirmed = window.confirm(
          "Nhân viên đang có ca trực trong ngày này. Bạn có chắc chắn muốn tạo đơn xin nghỉ không?"
        );
        if (!confirmed) return;
      }
      createLeaveRequest({
        staffId: staff.id,
        staffName: staff.name,
        startDate: parsedDate,
        endDate: parsedDate,
        reason: leaveReason,
      });
      alert("Đã tạo yêu cầu xin nghỉ phép! Yêu cầu đang chờ duyệt.");
      onClose();
      return;
    }

    if (activeTab === "swap") {
      if (!targetStaffId || !targetShift || !swapReason) {
        alert("Vui lòng chọn đủ thông tin nhân sự đổi, ca đổi và lý do.");
        return;
      }
      const targetStaff = otherStaffWorking.find(
        (r: any) => r.staff.id === targetStaffId
      )?.staff;
      const requesterShift = currentShifts[0]?.shift || "Nghỉ";
      createSwapRequest({
        requesterId: staff.id,
        requesterName: staff.name,
        targetStaffId,
        targetStaffName: targetStaff?.name || "",
        date: parsedDate,
        requesterShift,
        targetShift,
        reason: swapReason,
      });
      alert("Đã tạo yêu cầu đổi ca thành công! Yêu cầu đang chờ duyệt.");
      onClose();
      return;
    }

    // edit tab
    const newShifts = selectedValues
      .map((val) => {
        const opt = SHIFT_OPTIONS.find((o) => o.value === val);
        if (opt) return { shift: opt.value, type: opt.type };
        return null;
      })
      .filter(Boolean) as { shift: string; type: string }[];
    onSave(newShifts);
    onClose();
  };

  const isDirty =
    activeTab === "leave"
      ? leaveReason.trim() !== ""
      : activeTab === "swap"
      ? targetStaffId !== "" && targetShift !== "" && swapReason !== ""
      : selectedValues.length !== currentShifts.length ||
        selectedValues.some((v) => !currentShifts.find((s) => s.shift === v));

  const confirmText =
    activeTab === "swap"
      ? "Tạo yêu cầu đổi ca"
      : activeTab === "leave"
      ? "Gửi đơn xin nghỉ"
      : "Lưu thay đổi";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thao tác Phân Ca / Đổi Ca"
      onConfirm={handleSave}
      confirmText={confirmText}
      cancelText="Hủy"
      isDirty={isDirty}
      maxWidth="1000px"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "var(--spacing-lg)",
        }}
      >
        {/* ─── Left Column: Staff Info ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              padding: "var(--spacing-lg)",
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {staff && (
              <>
                <img
                  src={staff.avatar || "https://i.pravatar.cc/150"}
                  alt={staff.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #f1f5f9",
                    marginBottom: "12px",
                  }}
                />
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "1.1rem",
                    color: "var(--text-main)",
                  }}
                >
                  {staff.name}
                </h3>
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "4px 8px",
                    background: "var(--primary)",
                    borderRadius: "6px",
                    color: "#ffffff",
                    fontWeight: 600,
                    marginBottom: "16px",
                    letterSpacing: "0.05em",
                    boxShadow: "0 2px 4px rgba(99,102,241,0.2)",
                  }}
                >
                  {staff.id}
                </span>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ opacity: 0.8 }}>Phòng ban:</span>
                    <strong style={{ color: "var(--text-main)" }}>
                      {staff.department}
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ opacity: 0.8 }}>Chức vụ:</span>
                    <strong style={{ color: "var(--text-main)" }}>
                      {staff.position}
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ opacity: 0.8 }}>Ngày sinh:</span>
                    <strong style={{ color: "var(--text-main)" }}>
                      {staff.dob
                        ? new Date(staff.dob).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Date info */}
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#eef2ff",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--primary)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--primary-dark)" }}>
              Ngày áp dụng:
            </span>
            <strong style={{ color: "var(--primary)", fontSize: "1rem" }}>
              {dateLabel}
            </strong>
          </div>
        </div>

        {/* ─── Right Column: Tabs + Content ─── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            <button onClick={() => setActiveTab("edit")} style={TAB_BTN_STYLE(activeTab === "edit")}>
              Phân ca thủ công
            </button>
            <button onClick={() => setActiveTab("swap")} style={TAB_BTN_STYLE(activeTab === "swap")}>
              Đổi ca chéo
            </button>
            <button onClick={() => setActiveTab("leave")} style={TAB_BTN_STYLE(activeTab === "leave")}>
              Xin nghỉ phép
            </button>
          </div>

          {/* ── Tab: Phân ca ── */}
          {activeTab === "edit" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Chọn các ca làm việc. Không chọn ca nào đồng nghĩa với Nghỉ (OFF).
              </p>
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}
              >
                {SHIFT_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    style={{
                      border: `1px solid ${selectedValues.includes(opt.value) ? "var(--primary)" : "var(--border)"}`,
                      padding: "12px",
                      borderRadius: "8px",
                      background: selectedValues.includes(opt.value)
                        ? "#eef2ff"
                        : "transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    <BaseCheckbox
                      label={opt.label}
                      checked={selectedValues.includes(opt.value)}
                      onChange={(e) => handleToggle(opt.value, (e.target as HTMLInputElement).checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Xin nghỉ phép ── */}
          {activeTab === "leave" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  padding: "12px",
                  background: "#fff7ed",
                  color: "#92400e",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  border: "1px solid #fed7aa",
                  lineHeight: 1.6,
                }}
              >
                <strong>⚠ Lưu ý:</strong> Khi gửi đơn xin nghỉ phép, yêu cầu sẽ
                chuyển sang trạng thái <strong>Chờ duyệt</strong>. Quản lý có thể
                duyệt hoặc từ chối ngay trên lịch làm việc.
                {currentShifts.some((s) => !s.type.startsWith("leave")) && (
                  <span style={{ display: "block", marginTop: "6px", color: "#b45309" }}>
                    Nhân viên hiện đang có ca: <strong>{currentShifts.map((s) => s.shift).join(", ")}</strong>
                  </span>
                )}
              </div>
              <BaseInput
                label="Lý do xin nghỉ (*)"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="VD: Nghỉ ốm (có giấy BS), Việc gia đình đột xuất..."
              />
            </div>
          )}

          {/* ── Tab: Đổi ca chéo ── */}
          {activeTab === "swap" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--primary)",
                }}
              >
                Tạo yêu cầu đổi ca cho {dateLabel}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  Ca hiện tại của {staff?.name}
                </label>
                <div
                  style={{
                    padding: "8px 12px",
                    background: "#f8fafc",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                  }}
                >
                  {currentShifts.map((s) => s.shift).join(", ") || "Nghỉ"}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px", zIndex: 10 }}>
                <StaffSearchSelect
                  label="Đổi với nhân sự (*)"
                  options={otherStaffWorking.map((r: any) => ({
                    id: r.staff.id,
                    name: r.staff.name,
                    position: r.staff.position,
                    avatar: r.staff.avatar,
                  }))}
                  value={targetStaffId}
                  onChange={(val) => {
                    setTargetStaffId(val);
                    setTargetShift("");
                  }}
                />
              </div>

              {targetStaffId && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    Chọn ca của người đó (*)
                  </label>
                  <select
                    value={targetShift}
                    onChange={(e) => setTargetShift(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.9rem",
                      background: "#fff",
                    }}
                  >
                    <option value="">-- Chọn ca cần đổi lấy --</option>
                    {otherStaffWorking
                      .find((r: any) => r.staff.id === targetStaffId)
                      ?.schedule[dayIndex]?.map((s: any) => (
                        <option key={s.shift} value={s.shift}>
                          {s.shift}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <BaseInput
                label="Lý do đổi ca (*)"
                placeholder="VD: Trùng lịch gia đình..."
                value={swapReason}
                onChange={(e) => setSwapReason(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ManualShiftModal;
