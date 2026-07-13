import React from "react";
import type { Resident } from "../../../../mock/residents";

interface ServicesTabProps {
  resident: Resident;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ resident }) => {
  return (
    <div style={{ padding: "1.5rem" }}>
      <div className="card-25d" style={{ background: "#ffffff", padding: "1.5rem" }}>
        <h3>Dịch vụ đã dùng</h3>
        <p>Đang xây dựng: {resident.fullName}</p>
      </div>
    </div>
  );
};
