import React from "react";
import { Users, AlertCircle, BedDouble, CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BaseCard } from "../../../shared/components/BaseCard";
import styles from "../../Dashboard.module.scss";

import { dashboardStatsMockData } from "../../../mock/dashboard";

export const StatCards: React.FC = () => {
  const { t } = useTranslation();
  const stats = dashboardStatsMockData;

  return (
    <div className={styles.grid}>
      <BaseCard className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.users}`}>
          <Users size={24} color="var(--primary)" />
        </div>
        <div>
          <p className={styles.statLabel}>{t("dashboard.totalElderly")}</p>
          <h3 className={styles.statValue}>{stats.totalElderly}</h3>
        </div>
      </BaseCard>

      <BaseCard className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.rooms}`}>
          <BedDouble size={24} color="var(--secondary-dark)" />
        </div>
        <div>
          <p className={styles.statLabel}>{t("dashboard.availableRooms")}</p>
          <h3 className={styles.statValue}>{stats.availableRooms.available} / {stats.availableRooms.total}</h3>
        </div>
      </BaseCard>

      <BaseCard className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.alerts}`}>
          <AlertCircle size={24} color="#ef4444" />
        </div>
        <div>
          <p className={styles.statLabel}>{t("dashboard.recentAlerts")}</p>
          <h3 className={styles.statValue}>{stats.recentAlerts}</h3>
        </div>
      </BaseCard>

      <BaseCard className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.staff}`}>
          <CalendarCheck size={24} color="#22c55e" />
        </div>
        <div>
          <p className={styles.statLabel}>{t("dashboard.activeStaff")}</p>
          <h3 className={styles.statValue}>{stats.activeStaff}</h3>
        </div>
      </BaseCard>
    </div>
  );
};
