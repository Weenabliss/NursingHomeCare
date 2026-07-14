import { z } from "zod";

export const CourseStatusSchema = z.enum(["upcoming", "in_progress", "completed", "cancelled"]);
export const ParticipantStatusSchema = z.enum(["enrolled", "passed", "failed", "absent"]);

export const TrainingCourseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  type: z.enum(["mandatory", "optional", "certification"]),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  status: CourseStatusSchema.default("upcoming"),
  instructor: z.string().optional(),
  maxParticipants: z.number().optional()
});

export const TrainingParticipantSchema = z.object({
  courseId: z.string(),
  staffId: z.string(),
  status: ParticipantStatusSchema.default("enrolled"),
  score: z.number().optional(),
  certificateUrl: z.string().optional()
});

export const CertificateWarningSchema = z.object({
  staffId: z.string(),
  staffName: z.string(),
  certName: z.string(),
  expiryDate: z.string(),
  daysRemaining: z.number()
});

export type CourseStatus = z.infer<typeof CourseStatusSchema>;
export type ParticipantStatus = z.infer<typeof ParticipantStatusSchema>;
export type TrainingCourse = z.infer<typeof TrainingCourseSchema>;
export type TrainingParticipant = z.infer<typeof TrainingParticipantSchema>;
export type CertificateWarning = z.infer<typeof CertificateWarningSchema>;
