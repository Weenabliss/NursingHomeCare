import { TrainingCourse, TrainingParticipant, CertificateWarning } from "../../../../../src/modules/hr/types";
import { v4 as uuidv4 } from "uuid";
import { StaffModel } from "./staff.model";

let coursesDB: TrainingCourse[] = [];
let participantsDB: TrainingParticipant[] = [];

// Seed
const seedData = () => {
  if (coursesDB.length === 0) {
    const courseId = uuidv4();
    coursesDB.push({
      id: courseId,
      name: "Tập huấn PCCC định kỳ 2026",
      type: "mandatory",
      description: "Tập huấn PCCC toàn bộ nhân viên y tế",
      startDate: "2026-08-01",
      endDate: "2026-08-02",
      status: "upcoming",
      maxParticipants: 50
    });
    participantsDB.push({
      courseId,
      staffId: "NV001",
      status: "enrolled"
    });
  }
};
seedData();

export class TrainingModel {
  static async findAllCourses(): Promise<TrainingCourse[]> {
    return [...coursesDB];
  }

  static async findCourseById(id: string): Promise<TrainingCourse | null> {
    return coursesDB.find(c => c.id === id) || null;
  }

  static async createCourse(data: Omit<TrainingCourse, "id">): Promise<TrainingCourse> {
    const newCourse = { ...data, id: uuidv4() } as TrainingCourse;
    coursesDB.push(newCourse);
    return newCourse;
  }

  static async enrollParticipant(data: TrainingParticipant): Promise<TrainingParticipant> {
    const existing = participantsDB.find(p => p.courseId === data.courseId && p.staffId === data.staffId);
    if (existing) {
      existing.status = data.status;
      existing.score = data.score;
      existing.certificateUrl = data.certificateUrl;
      return existing;
    }
    participantsDB.push(data);
    return data;
  }

  static async getParticipantsByCourse(courseId: string): Promise<TrainingParticipant[]> {
    return participantsDB.filter(p => p.courseId === courseId);
  }

  static async getStaffTrainingHistory(staffId: string): Promise<TrainingParticipant[]> {
    return participantsDB.filter(p => p.staffId === staffId);
  }

  static async getCertificateWarnings(): Promise<CertificateWarning[]> {
    const staffs = await StaffModel.findAll();
    const warnings: CertificateWarning[] = [];
    const today = new Date();
    
    // Giả lập logic: Bác sĩ điều dưỡng phải gia hạn chứng chỉ hành nghề (nếu có) sau mỗi 5 năm
    // Hiện tại Schema Staff có medicalCredentials.practicingCert
    for (const staff of staffs) {
      if (staff.medicalCredentials?.practicingCert) {
        const cert = staff.medicalCredentials.practicingCert;
        const issueDate = new Date(cert.issueDate);
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 5); // 5 năm

        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 90 && diffDays >= 0) {
          warnings.push({
            staffId: staff.personal.id!,
            staffName: staff.personal.fullName,
            certName: cert.scope || "Chứng chỉ hành nghề Y",
            expiryDate: expiryDate.toISOString().split("T")[0],
            daysRemaining: diffDays
          });
        }
      }
    }

    return warnings;
  }
}
