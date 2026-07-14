import { Staff } from "../../../../../src/modules/hr/types";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

// A mock in-memory database
let staffDB: Staff[] = [];

// Seed data
const seedData = () => {
  if (staffDB.length === 0) {
    staffDB.push({
      personal: {
        id: uuidv4(),
        code: "NV001",
        fullName: "Nguyễn Thị Hoa",
        dob: "1990-05-15",
        gender: "female",
        nationalId: "001190123456",
        idIssueDate: "2021-06-10",
        idIssuePlace: "Cục CSQLHC về TTXH",
        phone: "0901234567",
        hometown: "Hà Nam",
        currentAddress: "Ký túc xá Viện dưỡng lão, Hà Nội",
        religion: "Không",
        maritalStatus: "single",
        hasSmallChildren: false
      },
      emergencyContacts: [{
        name: "Nguyễn Văn Hùng",
        relation: "Bố",
        phone: "0987654321"
      }],
      employment: {
        status: "active",
        joinDate: "2022-01-01",
        departmentId: "DEPT_NURSING",
        jobTitle: "Điều dưỡng trưởng",
        zoneAccess: ["general_ward", "dementia_ward"],
        canDoNightShift: true,
        maxNightShiftsPerWeek: 2
      },
      contracts: [{
        id: uuidv4(),
        contractType: "permanent",
        startDate: "2023-01-01",
        baseSalary: 12000000
      }],
      medicalCredentials: {
        practicingCert: {
          id: uuidv4(),
          certNumber: "CCHN-123456",
          scopeOfPractice: "Điều dưỡng đa khoa",
          issuedBy: "Sở Y tế Hà Nội",
          issueDate: "2020-05-10"
        },
        internalTrainings: [{
          courseId: "dementia",
          completionDate: "2023-06-15",
          expiryDate: "2025-06-15"
        }]
      },
      allowances: [
        { id: uuidv4(), name: "Trách nhiệm", amount: 2000000 },
        { id: uuidv4(), name: "Độc hại", amount: 500000 }
      ],
      assets: []
    });
  }
};

seedData();

export class StaffModel {
  static async findAll(): Promise<Staff[]> {
    return [...staffDB];
  }

  static async findById(id: string): Promise<Staff | null> {
    return staffDB.find(s => s.personal.id === id) || null;
  }

  static async create(data: Omit<Staff, "personal.id">): Promise<Staff> {
    const newStaff = { ...data } as Staff;
    newStaff.personal.id = uuidv4();
    staffDB.push(newStaff);
    return newStaff;
  }

  static async update(id: string, updates: Partial<Staff>): Promise<Staff | null> {
    const index = staffDB.findIndex(s => s.personal.id === id);
    if (index === -1) return null;
    
    // Deep merge would be better, but for mock purposes we re-assign sections
    staffDB[index] = { ...staffDB[index], ...updates };
    return staffDB[index];
  }

  static async delete(id: string): Promise<boolean> {
    const initialLength = staffDB.length;
    staffDB = staffDB.filter(s => s.personal.id !== id);
    return staffDB.length < initialLength;
  }
}
