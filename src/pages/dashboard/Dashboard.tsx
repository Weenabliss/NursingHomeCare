import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../Dashboard.module.scss";

// Components
import { StatCards } from "./components/StatCards";
import { NotificationPanels } from "./components/NotificationPanels";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className={styles.title}>{t("dashboard.title")}</h1>
      <StatCards />
      <NotificationPanels />
    </div>
  );
};

export default Dashboard;
