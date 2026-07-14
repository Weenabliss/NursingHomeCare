import { LeaveRequest, LeaveBalance } from "../../../../../src/modules/hr/types";
import { v4 as uuidv4 } from "uuid";

let leaveDB: LeaveRequest[] = [];
let leaveBalanceDB: LeaveBalance[] = [];

// Seed data
const seedData = () => {
  if (leaveDB.length === 0) {
    leaveDB.push({
      id: uuidv4(),
      staffId: "NV001",
      type: "annual_leave",
      startDate: "2026-07-15",
      endDate: "2026-07-16",
      totalDays: 2,
      reason: "Nghỉ mát gia đình",
      status: "pending"
    });
  }
  if (leaveBalanceDB.length === 0) {
    leaveBalanceDB.push({
      staffId: "NV001",
      year: 2026,
      annualTotal: 12,
      annualUsed: 0,
      sickUsed: 0,
      compensatoryTotal: 0,
      compensatoryUsed: 0
    });
  }
};
seedData();

export class LeaveModel {
  static async findAllRequests(): Promise<LeaveRequest[]> {
    return [...leaveDB];
  }

  static async findRequestsByStaffId(staffId: string): Promise<LeaveRequest[]> {
    return leaveDB.filter(l => l.staffId === staffId);
  }

  static async createRequest(data: Omit<LeaveRequest, "id">): Promise<LeaveRequest> {
    const newRequest = { ...data, id: uuidv4() } as LeaveRequest;
    leaveDB.push(newRequest);
    return newRequest;
  }

  static async updateRequestStatus(id: string, status: LeaveRequest["status"], approverId?: string, rejectReason?: string): Promise<LeaveRequest | null> {
    const index = leaveDB.findIndex(l => l.id === id);
    if (index === -1) return null;
    leaveDB[index] = {
      ...leaveDB[index],
      status,
      approverId,
      rejectReason,
      approvedAt: status === "approved" ? new Date().toISOString() : undefined
    };
    return leaveDB[index];
  }

  static async getBalance(staffId: string, year: number): Promise<LeaveBalance | null> {
    return leaveBalanceDB.find(b => b.staffId === staffId && b.year === year) || null;
  }
}
