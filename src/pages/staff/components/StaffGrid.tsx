import React from "react";
import { AlertCircle, Stethoscope, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BaseCard } from "../../../components/atoms/BaseCard";

interface StaffGridProps {
  currentStaff: any[];
}

export const StaffGrid: React.FC<StaffGridProps> = ({ currentStaff }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "var(--spacing-md)",
      }}
    >
      {currentStaff.map((staff) => (
        <BaseCard
          key={staff.id}
          onClick={() => navigate(`/hr/staff/${staff.id}`)}
          style={{
            opacity: staff.status === "resigned" ? 0.6 : 1,
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            padding: "0.75rem 1rem",
            gap: "0.5rem",
            overflow: "hidden",
          }}
        >
          {() => (
            <>
              {/* Top: Avatar, Info, Status */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: staff.gender === "female" ? "#fce7f3" : "#e0f2fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  {staff.avatar ? (
                    <img src={staff.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Stethoscope size={24} color={staff.gender === "female" ? "#be185d" : "#0369a1"} />
                  )}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      margin: "0 0 4px 0",
                      color: "var(--text-main)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {staff.name}
                    {staff.certWarning && (
                      <AlertCircle
                        size={14}
                        color="#dc2626"
                        style={{ marginLeft: "4px", verticalAlign: "text-bottom" }}
                      />
                    )}
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#ffffff",
                        fontWeight: 600,
                        backgroundColor: "var(--primary)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {staff.id}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: staff.gender === "male" ? "#1e40af" : "#9d174d",
                        fontWeight: 700,
                        backgroundColor: staff.gender === "male" ? "#dbeafe" : "#fce7f3",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      {staff.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Combined Details Block */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "max-content 1fr",
                  gap: "0.25rem 0.75rem",
                  fontSize: "0.75rem",
                  color: "var(--text-main)",
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>Phòng ban:</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {staff.department}
                </span>

                <span style={{ color: "var(--text-muted)" }}>Chức vụ:</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {staff.position}
                </span>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    height: "1px",
                    backgroundColor: "var(--border)",
                    margin: "0.25rem 0",
                  }}
                />

                <span style={{ color: "var(--text-muted)" }}>Năm sinh:</span>
                <span style={{ fontWeight: 500 }}>{staff.dob.split("-")[0]}</span>

                <span style={{ color: "var(--text-muted)" }}>CCCD:</span>
                <span style={{ fontWeight: 500 }}>{staff.cccd}</span>

                <span style={{ color: "var(--text-muted)" }}>Email:</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {staff.email}
                </span>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    height: "1px",
                    backgroundColor: "var(--border)",
                    margin: "0.25rem 0",
                  }}
                />

                <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <UserCircle size={12} /> Tài khoản:
                </span>
                <span
                  style={{ fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  {staff.id.toLowerCase()}
                  {staff.status === "resigned" ? (
                    <span style={{ color: "#dc2626" }}>(Khóa)</span>
                  ) : (
                    <span style={{ color: "#16a34a" }}>(HĐ)</span>
                  )}
                </span>
              </div>
            </>
          )}
        </BaseCard>
      ))}
    </div>
  );
};
