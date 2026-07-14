import { Payslip } from "../../../../../src/modules/hr/types";
import { v4 as uuidv4 } from "uuid";
import { StaffModel } from "./staff.model";
import { AttendanceModel } from "./attendance.model";

let payrollDB: Payslip[] = [];

export class PayrollModel {
  static async findAll(): Promise<Payslip[]> {
    return [...payrollDB];
  }

  static async findByStaffId(staffId: string): Promise<Payslip[]> {
    return payrollDB.filter(p => p.staffId === staffId);
  }

  static async generateMonthlyPayroll(month: number, year: number): Promise<Payslip[]> {
    const staffs = await StaffModel.findAll();
    const newPayslips: Payslip[] = [];

    for (const staff of staffs) {
      // Bỏ qua nếu đã có phiếu lương tháng này
      if (payrollDB.some(p => p.staffId === staff.personal.id && p.month === month && p.year === year)) {
        continue;
      }

      const summary = await AttendanceModel.getMonthlySummary(staff.personal.id!, month, year);
      
      const currentContract = staff.contracts.find(c => c.status === "active");
      const baseSalary = currentContract ? currentContract.baseSalary : 5000000;
      
      const standardWorkDays = 22; // Cố định 22 ngày công chuẩn
      const actualWorkDays = summary.totalPresentDays;

      const dailyRate = baseSalary / standardWorkDays;
      const calculatedSalary = dailyRate * actualWorkDays;

      // Phụ cấp (từ staff.allowances)
      const allowanceItems = staff.allowances.map(a => ({
        id: uuidv4(),
        name: a.name,
        amount: a.amount,
        type: "allowance" as const
      }));

      const totalAllowances = allowanceItems.reduce((sum, item) => sum + item.amount, 0);

      // Tăng ca & Trực đêm
      const overtimePay = (summary.totalOvertimeHours * (dailyRate / 8) * 1.5) + (summary.totalNightShifts * 200000);

      // Thuế & BHXH (giả lập 10.5% BHXH trên lương cơ bản)
      const insuranceDeduction = baseSalary * 0.105;
      
      const grossSalary = calculatedSalary + totalAllowances + overtimePay;
      const taxDeduction = grossSalary > 11000000 ? (grossSalary - 11000000) * 0.1 : 0; // Đơn giản hóa thuế TNCN
      
      const netSalary = grossSalary - insuranceDeduction - taxDeduction;

      const payslip: Payslip = {
        id: uuidv4(),
        staffId: staff.personal.id!,
        month,
        year,
        baseSalary,
        standardWorkDays,
        actualWorkDays,
        overtimePay,
        items: allowanceItems,
        taxDeduction,
        insuranceDeduction,
        grossSalary,
        netSalary,
        status: "draft",
        createdAt: new Date().toISOString()
      };

      payrollDB.push(payslip);
      newPayslips.push(payslip);
    }

    return newPayslips;
  }

  static async updateStatus(id: string, status: Payslip["status"]): Promise<Payslip | null> {
    const index = payrollDB.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    payrollDB[index] = {
      ...payrollDB[index],
      status,
      paymentDate: status === "paid" ? new Date().toISOString() : payrollDB[index].paymentDate,
      updatedAt: new Date().toISOString()
    };
    return payrollDB[index];
  }
}
