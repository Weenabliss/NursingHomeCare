import React from "react";
import type { Staff } from "../../../mock/staff";
import { WorkHistorySection } from "./WorkHistorySection";
import { ContractsSection } from "./ContractsSection";
import { CertificatesSection } from "./CertificatesSection";

interface JobTabProps {
  staff: Staff;
}

export const JobTab: React.FC<JobTabProps> = ({ staff }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
      {/* ROW 1: Quá trình công tác & Hợp đồng lao động */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "var(--spacing-md)", alignItems: "stretch" }}>
        <WorkHistorySection staff={staff} />
        <ContractsSection staff={staff} />
      </div>

      {/* ROW 2: Certificates (Full Width) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--spacing-md)", alignItems: "stretch" }}>
        <CertificatesSection staff={staff} />
      </div>
    </div>
  );
};
