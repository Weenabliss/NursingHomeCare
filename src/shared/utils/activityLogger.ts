// ============================================================
// Activity Logger - Hệ thống ghi lại hành vi người dùng
// Lưu log vào localStorage và có thể mở rộng để gửi lên server.
// ============================================================

export type ActivityModule =
  | "scheduling"
  | "staff"
  | "hr"
  | "dashboard"
  | "residents"
  | "auth"
  | "settings"
  | string;

export type ActivityAction =
  // Xem / Điều hướng
  | "view_page"
  | "switch_view_mode"
  | "search"
  | "filter"
  | "paginate"
  // Tạo / Sửa / Xóa
  | "create"
  | "update"
  | "delete"
  | "save"
  | "cancel"
  // Modal
  | "open_modal"
  | "close_modal"
  // Schedule-specific
  | "auto_schedule_run"
  | "auto_schedule_confirm"
  | "auto_schedule_cancel"
  | "manual_shift_save"
  | "preview_roster"
  // Auth
  | "login"
  | "logout"
  // Generic
  | string;

export interface ActivityLog {
  id: string;
  timestamp: string;      // ISO 8601
  userId: string;
  module: ActivityModule;
  action: ActivityAction;
  label: string;          // Mô tả ngắn gọn hành động
  details?: Record<string, unknown>; // Dữ liệu bổ sung tuỳ context
}

const STORAGE_KEY = "nhc_activity_logs";
const MAX_LOGS = 500; // Giới hạn để tránh localStorage đầy

// ─── Core Functions ───────────────────────────────────────────────────────────

/** Đọc toàn bộ logs từ localStorage */
export const readLogs = (): ActivityLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ActivityLog[]) : [];
  } catch {
    return [];
  }
};

/** Ghi 1 log entry mới */
export const logActivity = (
  entry: Omit<ActivityLog, "id" | "timestamp">
): void => {
  try {
    const logs = readLogs();
    const newLog: ActivityLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    // Giữ tối đa MAX_LOGS bản ghi (FIFO: xóa log cũ nhất)
    const updated = [newLog, ...logs].slice(0, MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Gửi lên server nếu endpoint có sẵn (non-blocking)
    sendToServer(newLog).catch(() => { /* Silently ignore – không block UI */ });

    if (import.meta.env.DEV) {
      console.log(
        `%c[ActivityLog] ${entry.module} › ${entry.action}`,
        "color: #6366f1; font-weight: bold;",
        entry.details ?? ""
      );
    }
  } catch {
    // Không để lỗi logging phá vỡ UI
  }
};

/** Xóa toàn bộ logs */
export const clearLogs = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/** Gửi log lên server (fire-and-forget) */
const sendToServer = async (_log: ActivityLog): Promise<void> => {
  // Chỉ gửi khi đã có endpoint thực. Hiện tại là mock, không throw.
  // await fetch("/api/activity-logs", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(log),
  // });
};
