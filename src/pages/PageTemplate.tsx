import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./PageTemplate.module.scss";
import { BaseCard } from "../components/atoms/BaseCard";

interface PageTemplateProps {
  title: string;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <BaseCard className={styles.content}>{t("common.developing", { title })}</BaseCard>
    </div>
  );
};

export default PageTemplate;
