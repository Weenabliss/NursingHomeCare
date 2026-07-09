import React from "react";
import { Users, AlertCircle, BedDouble, CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./Dashboard.module.scss";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className={styles.title}>{t("dashboard.title")}</h1>

      <div className={styles.grid}>
        <div className={`card-25d ${styles.statCard}`}>
          <div className={`${styles.iconWrapper} ${styles.users}`}>
            <Users size={24} color="var(--primary)" />
          </div>
          <div>
            <p className={styles.statLabel}>{t("dashboard.totalElderly")}</p>
            <h3 className={styles.statValue}>124</h3>
          </div>
        </div>

        <div className={`card-25d ${styles.statCard}`}>
          <div className={`${styles.iconWrapper} ${styles.rooms}`}>
            <BedDouble size={24} color="var(--secondary-dark)" />
          </div>
          <div>
            <p className={styles.statLabel}>{t("dashboard.availableRooms")}</p>
            <h3 className={styles.statValue}>12 / 60</h3>
          </div>
        </div>

        <div className={`card-25d ${styles.statCard}`}>
          <div className={`${styles.iconWrapper} ${styles.alerts}`}>
            <AlertCircle size={24} color="#ef4444" />
          </div>
          <div>
            <p className={styles.statLabel}>{t("dashboard.recentAlerts")}</p>
            <h3 className={styles.statValue}>5</h3>
          </div>
        </div>

        <div className={`card-25d ${styles.statCard}`}>
          <div className={`${styles.iconWrapper} ${styles.staff}`}>
            <CalendarCheck size={24} color="#22c55e" />
          </div>
          <div>
            <p className={styles.statLabel}>{t("dashboard.activeStaff")}</p>
            <h3 className={styles.statValue}>32</h3>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={`card-25d ${styles.panel}`}>
          <h2 className={styles.panelTitle}>{t("dashboard.upcomingMedication")}</h2>
          <p className={styles.noData}>{t("dashboard.noData")}</p>
        </div>

        <div className={`card-25d ${styles.panel}`}>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
