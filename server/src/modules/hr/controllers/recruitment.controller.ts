import { Request, Response } from "express";
import { RecruitmentModel } from "../models/recruitment.model";
import { CandidateSchema } from "../../../../../src/modules/hr/schemas/recruitment.schema";
import { z } from "zod";

export const recruitmentController = {
  async getAll(req: Request, res: Response) {
    try {
      const records = await RecruitmentModel.getAllCandidates();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const validatedData = CandidateSchema.parse(req.body);
      const newRecord = await RecruitmentModel.createCandidate(validatedData);
      res.status(201).json({ success: true, data: newRecord, message: "Tạo ứng viên thành công" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await RecruitmentModel.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy ứng viên" });
      }
      res.json({ success: true, data: updated, message: "Đã cập nhật trạng thái ứng viên" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
