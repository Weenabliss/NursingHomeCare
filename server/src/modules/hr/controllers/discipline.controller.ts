import { Request, Response } from "express";
import { DisciplineModel } from "../models/discipline.model";
import { DisciplineRecordSchema } from "../../../../../src/modules/hr/schemas/discipline.schema";
import { z } from "zod";

export const disciplineController = {
  async getRecords(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const records = await DisciplineModel.getRecordsByStaff(staffId);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createRecord(req: Request, res: Response) {
    try {
      const validatedData = DisciplineRecordSchema.parse(req.body);
      const newRecord = await DisciplineModel.createRecord(validatedData);
      res.status(201).json({ success: true, data: newRecord, message: "Đã lưu hồ sơ thành công" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
