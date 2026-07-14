import { DisciplineRecord } from "../../../../../src/modules/hr/types";
import { v4 as uuidv4 } from "uuid";

let recordsDB: DisciplineRecord[] = [];

// Seed
const seedData = () => {
  if (recordsDB.length === 0) {
    recordsDB.push({
      id: uuidv4(),
      staffId: "NV001",
      type: "reward",
      rewardType: "bonus",
      date: "2026-05-15",
      reason: "Hoàn thành xuất sắc nhiệm vụ chăm sóc bệnh nhân nặng",
      amount: 2000000,
      decidedBy: "GĐ Bệnh viện",
      createdAt: "2026-05-15T10:00:00Z"
    });
    
    recordsDB.push({
      id: uuidv4(),
      staffId: "NV001",
      type: "violation",
      severity: "high",
      date: "2026-01-20",
      reason: "Nhận phong bì của người nhà bệnh nhân sai quy định",
      actionTaken: "Cảnh cáo toàn viện, trừ thưởng Tết",
      decidedBy: "Hội đồng kỷ luật",
      createdAt: "2026-01-20T10:00:00Z"
    });
  }
};
seedData();

export class DisciplineModel {
  static async getRecordsByStaff(staffId: string): Promise<DisciplineRecord[]> {
    return recordsDB.filter(r => r.staffId === staffId);
  }

  static async createRecord(data: Omit<DisciplineRecord, "id">): Promise<DisciplineRecord> {
    const newRecord = { ...data, id: uuidv4(), createdAt: new Date().toISOString() } as DisciplineRecord;
    recordsDB.push(newRecord);
    return newRecord;
  }
}
