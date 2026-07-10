import React from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { BaseSelect } from "../../../../components/atoms/BaseSelect";

export const PayrollToolbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      className="card-25d"
      style={{
        padding: "var(--spacing-md)",
        marginBottom: "var(--spacing-lg)",
        display: "flex",
        gap: "var(--spacing-md)",
        alignItems: "center",
      }}
    >
      <div style={{ width: "200px" }}>
        <BaseSelect
          options={[
            { label: "Tháng 07/2026", value: "07-2026" },
            { label: "Tháng 06/2026", value: "06-2026" },
          ]}
        />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--background)",
          padding: "0.5rem 1rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
        }}
      >
        <Search size={18} color="var(--text-muted)" style={{ marginRight: "var(--spacing-sm)" }} />
        <input
          type="text"
          placeholder={t("hr.searchStaff")}
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            boxShadow: "none",
            width: "100%",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
};
