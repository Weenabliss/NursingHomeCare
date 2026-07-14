import { Request, Response } from "express";
import { AttendanceModel } from "../models/attendance.model";
import { AttendanceRecordSchema } from "../../../../../src/modules/hr/schemas/attendance.schema";
import { z } from "zod";

export const attendanceController = {
  async getByStaff(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const records = await AttendanceModel.findByStaffId(staffId);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getMonthlySummary(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const { month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({ success: false, message: "Thiếu tháng và năm" });
      }
      const summary = await AttendanceModel.getMonthlySummary(staffId, Number(month), Number(year));
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const validatedData = AttendanceRecordSchema.parse(req.body);
      const newRecord = await AttendanceModel.create(validatedData);
      res.status(201).json({ success: true, data: newRecord, message: "Chấm công thành công" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
