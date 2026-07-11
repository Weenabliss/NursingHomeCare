import React from "react";
import { useTranslation } from "react-i18next";
import { Toolbar } from "../../../../components/molecules/Toolbar";
import { BaseSelect } from "../../../../components/atoms/BaseSelect";

/**
 * Toolbar for the Payroll page.
 * Refactored to use the shared Toolbar molecule instead of a raw inline search input.
 */
export const PayrollToolbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Toolbar
      searchPlaceholder={t("hr.searchStaff")}
      onSearch={() => {}}
      style={{ marginBottom: "var(--spacing-lg)" }}
      filters={
        <div style={{ width: "200px" }}>
          <BaseSelect
            options={[
              { label: "Tháng 07/2026", value: "07-2026" },
              { label: "Tháng 06/2026", value: "06-2026" },
            ]}
          />
        </div>
      }
    />
  );
};
