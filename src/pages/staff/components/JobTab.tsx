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
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)", alignItems: "stretch", height: "100%", padding: "4px", margin: "-4px" }}>
      {/* LEFT HALF — full height */}
      <WorkHistorySection staff={staff} />

      {/* RIGHT HALF — two cards stacked */}
      <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "var(--spacing-md)", minHeight: 0 }}>
        <ContractsSection staff={staff} />
        <CertificatesSection staff={staff} />
      </div>
    </div>
  );
};
