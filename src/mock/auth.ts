import type { AllowanceOption } from "../constants/payroll";

// Mock current user – trong thực tế sẽ lấy từ API/session
export interface MockUser {
  id: string;
  name: string;
  roles: string[];
}

export const MOCK_CURRENT_USER: MockUser = {
  id: "USR-001",
  name: "Admin Hệ thống",
  roles: ["SUPER_ADMIN", "FINANCE_APPROVER"],
};

export const hasRole = (role: string): boolean =>
  MOCK_CURRENT_USER.roles.includes(role);
