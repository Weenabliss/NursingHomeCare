import { Candidate, Staff } from "../../../../../src/modules/hr/types";
import { v4 as uuidv4 } from "uuid";
import { StaffModel } from "./staff.model";

let candidatesDB: Candidate[] = [];

// Seed
const seedData = () => {
  if (candidatesDB.length === 0) {
    candidatesDB.push({
      id: uuidv4(),
      fullName: "Trần Thị C",
      email: "tranthic@email.com",
      phone: "0988111222",
      appliedPosition: "Điều dưỡng viên",
      departmentId: "DEPT_NURSING",
      status: "new",
      appliedAt: "2026-07-10T10:00:00Z"
    });
    
    candidatesDB.push({
      id: uuidv4(),
      fullName: "Lê Văn D",
      email: "levand@email.com",
      phone: "0900111333",
      appliedPosition: "Bác sĩ đa khoa",
      departmentId: "DEPT_MEDICAL",
      status: "interviewing",
      appliedAt: "2026-07-01T10:00:00Z",
      interviewDate: "2026-07-15",
      interviewerId: "NV001"
    });
  }
};
seedData();

export class RecruitmentModel {
  static async getAllCandidates(): Promise<Candidate[]> {
    return [...candidatesDB];
  }

  static async getCandidateById(id: string): Promise<Candidate | null> {
    return candidatesDB.find(c => c.id === id) || null;
  }

  static async createCandidate(data: Omit<Candidate, "id">): Promise<Candidate> {
    const newCandidate = { ...data, id: uuidv4(), appliedAt: new Date().toISOString() } as Candidate;
    candidatesDB.push(newCandidate);
    return newCandidate;
  }

  static async updateStatus(id: string, status: Candidate["status"]): Promise<Candidate | null> {
    const candidate = candidatesDB.find(c => c.id === id);
    if (!candidate) return null;
    
    candidate.status = status;

    // Logic: Nếu hired -> Tự động sinh mã NV và tạo Staff record
    if (status === "hired") {
      const newStaffCode = `NV${Date.now().toString().slice(-6)}`;
      const newStaff: Staff = {
        personal: {
          code: newStaffCode,
          fullName: candidate.fullName,
          dob: "2000-01-01",
          gender: "other",
          nationalId: "",
          hometown: "",
          currentAddress: "",
          religion: "Không",
          maritalStatus: "single",
          hasSmallChildren: false,
          phone: candidate.phone,
        },
        emergencyContacts: [],
        employment: {
          status: "active",
          joinDate: new Date().toISOString().split("T")[0],
          departmentId: candidate.departmentId || "DEPT_HR",
          jobTitle: candidate.appliedPosition,
          zoneAccess: [],
          canDoNightShift: true,
          maxNightShiftsPerWeek: 3,
        },
        contracts: [],
        medicalCredentials: {
          practicingCert: null,
          internalTrainings: [],
        },
        allowances: [],
        assets: [],
      };
      
      await StaffModel.create(newStaff);
    }

    return candidate;
  }
}
