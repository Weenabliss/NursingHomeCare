import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./PageTemplate.module.scss";

interface PageTemplateProps {
  title: string;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={`card-25d ${styles.content}`}>{t("common.developing", { title })}</div>
    </div>
  );
};

export default PageTemplate;
