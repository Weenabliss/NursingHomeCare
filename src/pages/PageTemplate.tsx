import React from "react";
import { useTranslation } from "react-i18next";

interface PageTemplateProps {
  title: string;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="mb-4" style={{ fontSize: "1.5rem", color: "var(--primary-dark)" }}>
        {title}
      </h1>
      <div
        className="card-25d"
        style={{
          padding: "var(--spacing-2xl)",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        {t("common.developing", { title })}
      </div>
    </div>
  );
};

export default PageTemplate;
