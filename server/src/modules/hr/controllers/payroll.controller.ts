import { Request, Response } from "express";
import { PayrollModel } from "../models/payroll.model";

export const payrollController = {
  async getAll(req: Request, res: Response) {
    try {
      const records = await PayrollModel.findAll();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getByStaff(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const records = await PayrollModel.findByStaffId(staffId);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async generateMonthly(req: Request, res: Response) {
    try {
      const { month, year } = req.body;
      if (!month || !year) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin tháng và năm" });
      }
      const newPayslips = await PayrollModel.generateMonthlyPayroll(Number(month), Number(year));
      res.status(201).json({ success: true, data: newPayslips, message: `Đã tạo ${newPayslips.length} phiếu lương` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await PayrollModel.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy phiếu lương" });
      }
      res.json({ success: true, data: updated, message: "Cập nhật trạng thái thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
