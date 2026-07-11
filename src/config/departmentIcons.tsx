import React from "react";
import {
  LayoutGrid,
  HeartPulse,
  Briefcase,
  Coffee,
  Building,
  Users,
  Stethoscope,
  Activity,
  Pill,
  FileText,
  Phone,
  ShieldPlus,
  Bed,
} from "lucide-react";

/**
 * Shared icon map for department-related components.
 * Used by DepartmentTreeTab and DepartmentModal.
 */
export const departmentIconMap: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid size={24} />,
  HeartPulse: <HeartPulse size={24} />,
  Briefcase: <Briefcase size={24} />,
  Coffee: <Coffee size={24} />,
  Building: <Building size={24} />,
  Users: <Users size={24} />,
  Stethoscope: <Stethoscope size={24} />,
  Activity: <Activity size={24} />,
  Pill: <Pill size={24} />,
  FileText: <FileText size={24} />,
  Phone: <Phone size={24} />,
  ShieldPlus: <ShieldPlus size={24} />,
  Bed: <Bed size={24} />,
};

export type DepartmentIconKey = keyof typeof departmentIconMap;
