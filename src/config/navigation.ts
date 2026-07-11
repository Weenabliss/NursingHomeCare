import {
  LayoutDashboard,
  Users,
  Contact,
  CalendarDays,
  Settings,
  Clock,
  HeartPulse,
  Building2,
  Package,
  Stethoscope,
  Activity,
  BookOpen,
} from "lucide-react";
import React from "react";

export interface SubMenuItem {
  path: string;
  label: string;
  icon?: React.ElementType;
}

export interface SchemaItem {
  id: string;
  path: string;
  label: string;
  icon: React.ElementType;
  subMenus: SubMenuItem[];
}

export const SCHEMAS: SchemaItem[] = [
  {
    id: "common",
    path: "/common",
    label: "schemas.common",
    icon: LayoutDashboard,
    subMenus: [
      {
        path: "/common/dashboard",
        label: "common.dashboard",
        icon: LayoutDashboard,
      },
      { path: "/common/reports", label: "common.reports", icon: Activity },
    ],
  },
  {
    id: "elderly",
    path: "/elderly",
    label: "schemas.elderly",
    icon: Users,
    subMenus: [
      { path: "/elderly/list", label: "elderly.list", icon: Users },
      { path: "/elderly/relatives", label: "elderly.relatives", icon: Contact },
    ],
  },
  {
    id: "medical",
    path: "/medical",
    label: "schemas.medical",
    icon: Stethoscope,
    subMenus: [
      { path: "/medical/records", label: "medical.records", icon: Stethoscope },
      {
        path: "/medical/prescriptions",
        label: "medical.prescriptions",
        icon: HeartPulse,
      },
    ],
  },
  {
    id: "hr",
    path: "/hr",
    label: "schemas.hr",
    icon: Contact,
    subMenus: [
      { path: "/hr/staff", label: "hr.staff", icon: Contact },
      { path: "/hr/departments", label: "hr.departments", icon: Building2 },
      { path: "/hr/payroll", label: "hr.payroll", icon: Activity },
    ],
  },
  {
    id: "scheduling",
    path: "/scheduling",
    label: "schemas.scheduling",
    icon: CalendarDays,
    subMenus: [
      {
        path: "/scheduling/shifts",
        label: "scheduling.shifts",
        icon: CalendarDays,
      },
      {
        path: "/scheduling/shift-definitions",
        label: "scheduling.shiftDefinitions",
        icon: Clock,
      },
      { path: "/scheduling/events", label: "scheduling.events", icon: Users },
    ],
  },
  {
    id: "facility",
    path: "/facility",
    label: "schemas.facility",
    icon: Building2,
    subMenus: [
      { path: "/facility/rooms", label: "facility.rooms", icon: Building2 },
      { path: "/facility/beds", label: "facility.beds", icon: Building2 },
    ],
  },
  {
    id: "inventory",
    path: "/inventory",
    label: "schemas.inventory",
    icon: Package,
    subMenus: [
      {
        path: "/inventory/medicines",
        label: "inventory.medicines",
        icon: Package,
      },
      {
        path: "/inventory/equipment",
        label: "inventory.equipment",
        icon: Package,
      },
    ],
  },
  {
    id: "settings",
    path: "/settings",
    label: "schemas.settings",
    icon: Settings,
    subMenus: [
      { path: "/settings/general", label: "settings.general", icon: Settings },
      { path: "/settings/roles", label: "settings.roles", icon: Users },
    ],
  },
  {
    id: "docs",
    path: "/docs",
    label: "schemas.docs",
    icon: BookOpen,
    subMenus: [{ path: "/docs", label: "schemas.docs", icon: BookOpen }],
  },
];

export const getSubMenusByPrefix = (pathname: string): SubMenuItem[] => {
  const schema = SCHEMAS.find((s) => pathname.startsWith(s.path));
  return schema ? schema.subMenus : SCHEMAS[0].subMenus;
};
