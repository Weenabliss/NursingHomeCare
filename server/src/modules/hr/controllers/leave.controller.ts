import { Request, Response } from "express";
import { LeaveModel } from "../models/leave.model";
import { LeaveRequestSchema } from "../../../../../src/modules/hr/schemas/leave.schema";
import { z } from "zod";

export const leaveController = {
  async getAll(req: Request, res: Response) {
    try {
      const records = await LeaveModel.findAllRequests();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getByStaff(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const records = await LeaveModel.findRequestsByStaffId(staffId);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const validatedData = LeaveRequestSchema.parse(req.body);
      const newRecord = await LeaveModel.createRequest(validatedData);
      res.status(201).json({ success: true, data: newRecord, message: "Tạo đơn xin nghỉ thành công" });
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
      const { status, approverId, rejectReason } = req.body;
      const updated = await LeaveModel.updateRequestStatus(id, status, approverId, rejectReason);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đơn xin nghỉ" });
      }
      res.json({ success: true, data: updated, message: "Cập nhật trạng thái thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getBalance(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
      const balance = await LeaveModel.getBalance(staffId, year);
      if (!balance) {
        return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu phép năm" });
      }
      res.json({ success: true, data: balance });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
