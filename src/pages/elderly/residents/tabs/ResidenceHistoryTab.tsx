import React from "react";
import type { Resident } from "../../../../mock/residents";

interface ResidenceHistoryTabProps {
  resident: Resident;
}

export const ResidenceHistoryTab: React.FC<ResidenceHistoryTabProps> = ({ resident }) => {
  return (
    <div style={{ padding: "1.5rem" }}>
      <div className="card-25d" style={{ background: "#ffffff", padding: "1.5rem" }}>
        <h3>Lịch sử cư trú</h3>
        <p>Đang xây dựng: {resident.fullName}</p>
      </div>
    </div>
  );
};
