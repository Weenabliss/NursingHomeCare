import React from "react";
import { useTranslation } from "react-i18next";
import { BaseCard } from "../../../components/atoms/BaseCard";
import styles from "../../Dashboard.module.scss";

export const NotificationPanels: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.contentGrid}>
      <BaseCard className={styles.panel}>
        <h2 className={styles.panelTitle}>{t("dashboard.upcomingMedication")}</h2>
        <p className={styles.noData}>{t("dashboard.noData")}</p>
      </BaseCard>

      <BaseCard className={styles.panel}>
        <h2 className={styles.panelTitle}>{t("dashboard.notifications")}</h2>
        <ul className={styles.notificationList}>
          <li className={styles.notificationItem}>
            <span className={styles.notificationTime}>09:00 - {t("dashboard.today")}</span>
            {t("dashboard.meeting")}
          </li>
          <li className={styles.notificationItem}>
            <span className={styles.notificationTime}>14:30 - {t("dashboard.tomorrow")}</span>
            {t("dashboard.checkup")}
          </li>
        </ul>
      </BaseCard>
    </div>
  );
};
