import React from "react";
import { useTranslation } from "react-i18next";
import { BaseCard } from "../../../shared/components/BaseCard";
import styles from "../../Dashboard.module.scss";

import { dashboardNotificationsMockData } from "../../../mock/dashboard";

export const NotificationPanels: React.FC = () => {
  const { t } = useTranslation();
  const notifications = dashboardNotificationsMockData;

  return (
    <div className={styles.contentGrid}>
      <BaseCard className={styles.panel}>
        <h2 className={styles.panelTitle}>{t("dashboard.upcomingMedication")}</h2>
        <p className={styles.noData}>{t("dashboard.noData")}</p>
      </BaseCard>

      <BaseCard className={styles.panel}>
        <h2 className={styles.panelTitle}>{t("dashboard.notifications")}</h2>
        <ul className={styles.notificationList}>
          {notifications.map((notif) => (
            <li key={notif.id} className={styles.notificationItem}>
              <span className={styles.notificationTime}>
                {notif.time} - {t(notif.dateKey)}
              </span>
              {t(notif.messageKey)}
            </li>
          ))}
        </ul>
      </BaseCard>
    </div>
  );
};
