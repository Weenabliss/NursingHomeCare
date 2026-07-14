import { useCallback } from "react";
import {
  logActivity,
  type ActivityAction,
  type ActivityModule,
} from "../utils/activityLogger";

interface UseActivityLogOptions {
  /** Module cố định cho tất cả log trong component này */
  module: ActivityModule;
  /** userId mặc định (có thể lấy từ AuthContext sau này) */
  userId?: string;
}

/**
 * Custom hook để ghi log hành vi người dùng ngay trong React component.
 *
 * @example
 * const { log } = useActivityLog({ module: "scheduling" });
 * log("open_modal", "Mở modal phân ca thủ công", { staffId: "NV001" });
 */
export const useActivityLog = ({ module, userId = "system" }: UseActivityLogOptions) => {
  const log = useCallback(
    (action: ActivityAction, label: string, details?: Record<string, unknown>) => {
      logActivity({ userId, module, action, label, details });
    },
    [module, userId]
  );

  return { log };
};
