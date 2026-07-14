import { Request, Response } from "express";
import { PerformanceModel } from "../models/performance.model";
import { PerformanceReviewSchema, MedicalIncidentSchema } from "../../../../../src/modules/hr/schemas/performance.schema";
import { z } from "zod";

export const performanceController = {
  async getReviews(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const records = await PerformanceModel.getReviewsByStaff(staffId);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createReview(req: Request, res: Response) {
    try {
      const validatedData = PerformanceReviewSchema.parse(req.body);
      const newReview = await PerformanceModel.createReview(validatedData);
      res.status(201).json({ success: true, data: newReview, message: "Đã lưu đánh giá hiệu suất" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getIncidents(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const records = await PerformanceModel.getIncidentsByStaff(staffId);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createIncident(req: Request, res: Response) {
    try {
      const validatedData = MedicalIncidentSchema.parse(req.body);
      const newIncident = await PerformanceModel.createIncident(validatedData);
      res.status(201).json({ success: true, data: newIncident, message: "Đã ghi nhận sự cố y khoa" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
