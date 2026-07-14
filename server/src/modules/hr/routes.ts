import { Router } from "express";
import { staffController } from "./controllers/staff.controller";
import { attendanceController } from "./controllers/attendance.controller";
import { leaveController } from "./controllers/leave.controller";
import { payrollController } from "./controllers/payroll.controller";
import { trainingController } from "./controllers/training.controller";
import { performanceController } from "./controllers/performance.controller";
import { disciplineController } from "./controllers/discipline.controller";
import { recruitmentController } from "./controllers/recruitment.controller";

const hrRouter = Router();

// Staff API
hrRouter.get("/staff", staffController.getAll);
hrRouter.get("/staff/:id", staffController.getById);
hrRouter.post("/staff", staffController.create);
hrRouter.put("/staff/:id", staffController.update);
hrRouter.delete("/staff/:id", staffController.delete);

// Attendance API
hrRouter.get("/attendance/:staffId", attendanceController.getByStaff);
hrRouter.get("/attendance/:staffId/summary", attendanceController.getMonthlySummary);
hrRouter.post("/attendance", attendanceController.create);

// Leave API
hrRouter.get("/leave", leaveController.getAll);
hrRouter.get("/leave/:staffId", leaveController.getByStaff);
hrRouter.get("/leave/:staffId/balance", leaveController.getBalance);
hrRouter.post("/leave", leaveController.create);
hrRouter.patch("/leave/:id/status", leaveController.updateStatus);

// Payroll API
hrRouter.get("/payroll", payrollController.getAll);
hrRouter.get("/payroll/:staffId", payrollController.getByStaff);
hrRouter.post("/payroll/generate", payrollController.generateMonthly);
hrRouter.patch("/payroll/:id/status", payrollController.updateStatus);

// Training API
hrRouter.get("/training/courses", trainingController.getAllCourses);
hrRouter.post("/training/courses", trainingController.createCourse);
hrRouter.get("/training/warnings", trainingController.getWarnings);
hrRouter.get("/training/staff/:staffId", trainingController.getStaffHistory);
hrRouter.post("/training/enroll", trainingController.enroll);

// Performance API
hrRouter.get("/performance/reviews/:staffId", performanceController.getReviews);
hrRouter.post("/performance/reviews", performanceController.createReview);
hrRouter.get("/performance/incidents/:staffId", performanceController.getIncidents);
hrRouter.post("/performance/incidents", performanceController.createIncident);

// Discipline API
hrRouter.get("/discipline/:staffId", disciplineController.getRecords);
hrRouter.post("/discipline", disciplineController.createRecord);

// Recruitment API
hrRouter.get("/recruitment/candidates", recruitmentController.getAll);
hrRouter.post("/recruitment/candidates", recruitmentController.create);
hrRouter.patch("/recruitment/candidates/:id/status", recruitmentController.updateStatus);

export default hrRouter;
