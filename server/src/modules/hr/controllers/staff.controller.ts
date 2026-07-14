import { Request, Response } from "express";
import { StaffModel } from "../models/staff.model";
import { StaffSchema } from "../../../../../src/modules/hr/schemas/staff.schema";
import { z } from "zod";

export const staffController = {
  // GET /api/hr/staff
  async getAll(req: Request, res: Response) {
    try {
      const staffList = await StaffModel.findAll();
      res.json({ success: true, data: staffList });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/hr/staff/:id
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const staff = await StaffModel.findById(id);
      if (!staff) {
        return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" });
      }
      res.json({ success: true, data: staff });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/hr/staff
  async create(req: Request, res: Response) {
    try {
      // Validate with Zod
      const validatedData = StaffSchema.parse(req.body);
      const newStaff = await StaffModel.create(validatedData);
      res.status(201).json({ success: true, data: newStaff, message: "Tạo nhân sự thành công" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // PUT /api/hr/staff/:id
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Partial validation for updates (allowing missing fields)
      // Since it's a deep object, we should ideally use DeepPartial or just require full object in PUT
      // Here we assume PUT requires full valid object
      const validatedData = StaffSchema.parse(req.body);
      
      const updatedStaff = await StaffModel.update(id, validatedData);
      if (!updatedStaff) {
        return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" });
      }
      res.json({ success: true, data: updatedStaff, message: "Cập nhật thành công" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors: error.issues });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/hr/staff/:id
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await StaffModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" });
      }
      res.json({ success: true, message: "Xóa nhân viên thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
