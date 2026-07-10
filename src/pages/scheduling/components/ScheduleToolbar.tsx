import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { BaseCard } from "../../../components/atoms/BaseCard";
import styles from "../Schedule.module.scss";

export const ScheduleToolbar: React.FC = () => {
  return (
    <BaseCard className={styles.header}>
      <div className={styles.dateNav}>
        <BaseButton variant="outline">
          <ChevronLeft size={18} />
        </BaseButton>
        <span className={styles.dateRange}>Tuần 33 (12/08 - 18/08)</span>
        <BaseButton variant="outline">
          <ChevronRight size={18} />
        </BaseButton>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: "#e0f2fe" }}></div> Ca Sáng (06h-14h)
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: "#fef3c7" }}></div> Ca Chiều (14h-22h)
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: "#ede9fe" }}></div> Ca Đêm (22h-06h)
        </div>
      </div>
    </BaseCard>
  );
};
