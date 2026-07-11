import React from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import { BaseButton } from "../../../components/atoms/BaseButton";
import styles from "../Schedule.module.scss";

import { BarChart2 } from "lucide-react";

interface ScheduleToolbarProps {
  viewMode: "week" | "month" | "stats";
  onViewModeChange: (mode: "week" | "month" | "stats") => void;
  previewMode?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({ viewMode, onViewModeChange, previewMode, onConfirm, onCancel }) => {
  return (
    <div className={styles.footerToolbarContent}>
      <div className={styles.dateNav}>
        {previewMode ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: "var(--primary-dark)", paddingRight: "16px", borderRight: "1px solid var(--border)" }}>Chế độ Xem trước Lịch Xếp Tự động</span>
          </div>
        ) : (
          <>
            <BaseButton variant="outline">
              <ChevronLeft size={18} />
            </BaseButton>
            <span className={styles.dateRange}>{viewMode === "week" ? "Tuần 33 (12/08 - 18/08)" : "Tháng 8 / 2026"}</span>
            <BaseButton variant="outline">
              <ChevronRight size={18} />
            </BaseButton>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ background: "#e0f2fe" }}></div> Ca Sáng
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ background: "#fef3c7" }}></div> Ca Chiều
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ background: "#ede9fe" }}></div> Ca Đêm
          </div>
        </div>

        {previewMode ? (
          <div style={{ display: 'flex', gap: '12px' }}>
            <BaseButton variant="outline" onClick={onCancel}>
              Hủy phân ca
            </BaseButton>
            <BaseButton variant="primary" onClick={onConfirm}>
              Lưu kết quả phân ca
            </BaseButton>
          </div>
        ) : (
          <div style={{ display: 'flex', background: 'var(--background)', borderRadius: 'var(--radius-md)', padding: '4px', border: '1px solid var(--border)' }}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'week' ? styles.active : ''}`}
              onClick={() => onViewModeChange('week')}
            >
              <CalendarDays size={16} /> Tuần
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'month' ? styles.active : ''}`}
              onClick={() => onViewModeChange('month')}
            >
              <CalendarIcon size={16} /> Tháng
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'stats' ? styles.active : ''}`}
              onClick={() => onViewModeChange('stats')}
            >
              <BarChart2 size={16} /> Thống kê
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
