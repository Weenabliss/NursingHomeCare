import { Request, Response } from "express";
import { TrainingModel } from "../models/training.model";
import { TrainingCourseSchema, TrainingParticipantSchema } from "../../../../../src/modules/hr/schemas/training.schema";
import { z } from "zod";

export const trainingController = {
  async getAllCourses(req: Request, res: Response) {
    try {
      const records = await TrainingModel.findAllCourses();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createCourse(req: Request, res: Response) {
    try {
      const validatedData = TrainingCourseSchema.parse(req.body);
      const newCourse = await TrainingModel.createCourse(validatedData);
      res.status(201).json({ success: true, data: newCourse, message: "Tạo khóa học thành công" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getWarnings(req: Request, res: Response) {
    try {
      const warnings = await TrainingModel.getCertificateWarnings();
      res.json({ success: true, data: warnings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getStaffHistory(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const records = await TrainingModel.getStaffTrainingHistory(staffId);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async enroll(req: Request, res: Response) {
    try {
      const validatedData = TrainingParticipantSchema.parse(req.body);
      const result = await TrainingModel.enrollParticipant(validatedData);
      res.json({ success: true, data: result, message: "Đăng ký thành công" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
