export interface DashboardStats {
  totalElderly: number;
  availableRooms: {
    available: number;
    total: number;
  };
  recentAlerts: number;
  activeStaff: number;
}

export interface DashboardNotification {
  id: string;
  time: string;
  dateKey: "dashboard.today" | "dashboard.tomorrow";
  messageKey: string;
}

export const dashboardStatsMockData: DashboardStats = {
  totalElderly: 124,
  availableRooms: {
    available: 12,
    total: 60,
  },
  recentAlerts: 5,
  activeStaff: 32,
};

export const dashboardNotificationsMockData: DashboardNotification[] = [
  {
    id: "notif-1",
    time: "09:00",
    dateKey: "dashboard.today",
    messageKey: "dashboard.meeting",
  },
  {
    id: "notif-2",
    time: "14:30",
    dateKey: "dashboard.tomorrow",
    messageKey: "dashboard.checkup",
  },
];
