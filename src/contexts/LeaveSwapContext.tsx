import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useActivityLog } from "../hooks/useActivityLog";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  reason: string;
  status: RequestStatus;
  rejectReason?: string;
  createdAt: string;
}

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetStaffId: string;
  targetStaffName: string;
  date: string; // YYYY-MM-DD
  requesterShift: string; // Ca của người xin đổi
  targetShift: string;    // Ca của người được xin đổi
  reason: string;
  status: RequestStatus;
  rejectReason?: string;
  createdAt: string;
}

interface LeaveSwapContextType {
  leaveRequests: LeaveRequest[];
  swapRequests: ShiftSwapRequest[];
  approveLeave: (id: string) => void;
  rejectLeave: (id: string, reason?: string) => void;
  approveSwap: (id: string) => void;
  rejectSwap: (id: string, reason?: string) => void;
  createSwapRequest: (req: Omit<ShiftSwapRequest, "id" | "status" | "createdAt">) => void;
  createLeaveRequest: (req: Omit<LeaveRequest, "id" | "status" | "createdAt">) => void;
  getApprovedLeavesForStaff: (staffId: string) => LeaveRequest[];
  getLeavesForStaff: (staffId: string) => LeaveRequest[];
}

const LeaveSwapContext = createContext<LeaveSwapContextType | undefined>(undefined);

// Mock data ban đầu
const initialLeaveRequests: LeaveRequest[] = [
  { id: "LR001", staffId: "NV24005", staffName: "ĐD. Phạm Thị Em", startDate: "2026-08-12", endDate: "2026-08-13", reason: "Nghỉ ốm (Có giấy BS)", status: "pending", createdAt: new Date().toISOString() },
  { id: "LR002", staffId: "NV24001", staffName: "BS. Nguyễn Văn A", startDate: "2026-08-05", endDate: "2026-08-06", reason: "Nghỉ phép năm", status: "approved", createdAt: new Date().toISOString() },
  { id: "LR003", staffId: "NV24002", staffName: "ĐD. Trần Thị B", startDate: "2026-08-20", endDate: "2026-08-21", reason: "Có việc gia đình đột xuất", status: "rejected", rejectReason: "Khoa đang thiếu nhân sự trầm trọng", createdAt: new Date().toISOString() },
  { id: "LR004", staffId: "NV24003", staffName: "ĐD. Lê Văn C", startDate: "2026-08-25", endDate: "2026-08-27", reason: "Đám cưới em gái ở quê", status: "pending", createdAt: new Date().toISOString() },
  { id: "LR005", staffId: "NV24004", staffName: "ĐD. Hoàng Văn D", startDate: "2026-08-02", endDate: "2026-08-02", reason: "Khám sức khỏe định kỳ", status: "approved", createdAt: new Date().toISOString() },
  { id: "LR006", staffId: "NV24005", staffName: "ĐD. Phạm Thị Em", startDate: "2026-08-28", endDate: "2026-08-29", reason: "Giải quyết giấy tờ nhà đất", status: "pending", createdAt: new Date().toISOString() },
  { id: "LR007", staffId: "NV24006", staffName: "CS. Vũ Thị F", startDate: "2026-08-15", endDate: "2026-08-16", reason: "Con ốm phải nhập viện", status: "pending", createdAt: new Date().toISOString() },
  { id: "LR008", staffId: "NV24007", staffName: "CS. Đặng Văn G", startDate: "2026-08-10", endDate: "2026-08-11", reason: "Nghỉ thai sản", status: "approved", createdAt: new Date().toISOString() },
  { id: "LR009", staffId: "NV24008", staffName: "BS. Bùi Thị H", startDate: "2026-08-18", endDate: "2026-08-19", reason: "Đi hội thảo y khoa", status: "pending", createdAt: new Date().toISOString() },
  { id: "LR010", staffId: "NV24009", staffName: "ĐD. Ngô Văn I", startDate: "2026-08-22", endDate: "2026-08-23", reason: "Nhà có tang", status: "pending", createdAt: new Date().toISOString() },
  { id: "LR011", staffId: "NV24010", staffName: "CS. Đỗ Thị K", startDate: "2026-08-30", endDate: "2026-08-31", reason: "Xin nghỉ phép hè", status: "rejected", rejectReason: "Đã hết ngày phép năm", createdAt: new Date().toISOString() },
  { id: "LR012", staffId: "NV24001", staffName: "BS. Nguyễn Văn A", startDate: "2026-08-14", endDate: "2026-08-14", reason: "Nghỉ bù trực đêm", status: "pending", createdAt: new Date().toISOString() },
];

const initialSwapRequests: ShiftSwapRequest[] = [
  { id: "SW001", requesterId: "NV24002", requesterName: "ĐD. Trần Thị B", targetStaffId: "NV24003", targetStaffName: "ĐD. Lê Văn C", date: "2026-08-15", requesterShift: "SÁNG", targetShift: "CHIỀU", reason: "Trùng lịch họp phụ huynh", status: "pending", createdAt: new Date().toISOString() },
  { id: "SW002", requesterId: "NV24004", requesterName: "ĐD. Hoàng Văn D", targetStaffId: "NV24005", targetStaffName: "ĐD. Phạm Thị Em", date: "2026-08-18", requesterShift: "ĐÊM", targetShift: "SÁNG", reason: "Bận việc gia đình buổi tối", status: "approved", createdAt: new Date().toISOString() },
  { id: "SW003", requesterId: "NV24006", requesterName: "CS. Vũ Thị F", targetStaffId: "NV24007", targetStaffName: "CS. Đặng Văn G", date: "2026-08-20", requesterShift: "CHIỀU", targetShift: "ĐÊM", reason: "Cần đi khám bệnh buổi chiều", status: "rejected", rejectReason: "Người nhận ca đã đủ số giờ làm", createdAt: new Date().toISOString() },
  { id: "SW004", requesterId: "NV24008", requesterName: "BS. Bùi Thị H", targetStaffId: "NV24001", targetStaffName: "BS. Nguyễn Văn A", date: "2026-08-22", requesterShift: "SÁNG", targetShift: "CHIỀU", reason: "Thay đổi lịch hẹn bệnh nhân", status: "pending", createdAt: new Date().toISOString() },
  { id: "SW005", requesterId: "NV24009", requesterName: "ĐD. Ngô Văn I", targetStaffId: "NV24010", targetStaffName: "CS. Đỗ Thị K", date: "2026-08-25", requesterShift: "ĐÊM", targetShift: "SÁNG", reason: "Chưa hồi phục sức khỏe", status: "pending", createdAt: new Date().toISOString() },
  { id: "SW006", requesterId: "NV24003", requesterName: "ĐD. Lê Văn C", targetStaffId: "NV24002", targetStaffName: "ĐD. Trần Thị B", date: "2026-08-10", requesterShift: "CHIỀU", targetShift: "SÁNG", reason: "Đi đón con đi học", status: "pending", createdAt: new Date().toISOString() },
  { id: "SW007", requesterId: "NV24005", requesterName: "ĐD. Phạm Thị Em", targetStaffId: "NV24004", targetStaffName: "ĐD. Hoàng Văn D", date: "2026-08-12", requesterShift: "SÁNG", targetShift: "ĐÊM", reason: "Đổi ca để ngủ bù", status: "pending", createdAt: new Date().toISOString() },
  { id: "SW008", requesterId: "NV24007", requesterName: "CS. Đặng Văn G", targetStaffId: "NV24006", targetStaffName: "CS. Vũ Thị F", date: "2026-08-05", requesterShift: "ĐÊM", targetShift: "CHIỀU", reason: "Nhà có tiệc tối", status: "approved", createdAt: new Date().toISOString() },
];

export const LeaveSwapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>(initialSwapRequests);
  const { log } = useActivityLog({ module: "scheduling" });

  const approveLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    const req = leaveRequests.find((r) => r.id === id);
    if (req) {
      log("approve_leave", `Duyệt nghỉ phép cho ${req.staffName} (${req.startDate})`, { requestId: id });
    }
  };

  const rejectLeave = (id: string, reason?: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected", rejectReason: reason } : r))
    );
    const req = leaveRequests.find((r) => r.id === id);
    if (req) {
      log("reject_leave", `Từ chối nghỉ phép của ${req.staffName}`, { requestId: id });
    }
  };

  const approveSwap = (id: string) => {
    setSwapRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    const req = swapRequests.find((r) => r.id === id);
    if (req) {
      log("approve_swap", `Duyệt đổi ca: ${req.requesterName} & ${req.targetStaffName} ngày ${req.date}`, { requestId: id });
    }
  };

  const rejectSwap = (id: string, reason?: string) => {
    setSwapRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected", rejectReason: reason } : r))
    );
  };

  const createSwapRequest = (req: Omit<ShiftSwapRequest, "id" | "status" | "createdAt">) => {
    const newReq: ShiftSwapRequest = {
      ...req,
      id: `SW${Math.floor(Math.random() * 10000)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setSwapRequests((prev) => [newReq, ...prev]);
    log("create_swap", `Tạo yêu cầu đổi ca cho ${req.requesterName} với ${req.targetStaffName} ngày ${req.date}`);
  };

  const createLeaveRequest = (req: Omit<LeaveRequest, "id" | "status" | "createdAt">) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `LR${Math.floor(Math.random() * 10000)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
    log("create_leave", `Tạo yêu cầu xin nghỉ cho ${req.staffName} ngày ${req.startDate}`, { reason: req.reason });
  };

  const getApprovedLeavesForStaff = (staffId: string) => {
    return leaveRequests.filter((r) => r.staffId === staffId && r.status === "approved");
  };

  const getLeavesForStaff = (staffId: string) => {
    return leaveRequests.filter((r) => r.staffId === staffId);
  };

  return (
    <LeaveSwapContext.Provider
      value={{
        leaveRequests,
        swapRequests,
        approveLeave,
        rejectLeave,
        approveSwap,
        rejectSwap,
        createSwapRequest,
        createLeaveRequest,
        getApprovedLeavesForStaff,
        getLeavesForStaff,
      }}
    >
      {children}
    </LeaveSwapContext.Provider>
  );
};

export const useLeaveSwap = () => {
  const context = useContext(LeaveSwapContext);
  if (!context) throw new Error("useLeaveSwap must be used within LeaveSwapProvider");
  return context;
};
