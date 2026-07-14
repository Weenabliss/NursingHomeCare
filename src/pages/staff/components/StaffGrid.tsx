import React from "react";
import { AlertCircle, Stethoscope, UserCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BaseCard } from "../../../shared/components/BaseCard";
import { useConfirm } from "../../../contexts/ConfirmContext";
import type { Staff } from "../../../modules/hr/types";

interface StaffGridProps {
  currentStaff: Staff[];
  onDeleteStaff: (id: string) => void;
}

export const StaffGrid: React.FC<StaffGridProps> = ({ currentStaff, onDeleteStaff }) => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const handleDelete = async (e: React.MouseEvent, staff: Staff) => {
    e.stopPropagation(); // Không trigger điều hướng vào detail
    const confirmMsg =
      staff.employment.status === "active"
        ? `⚠️ "${staff.personal.fullName}" đang là nhân viên ĐANG LÀM VIỆC.\nBạn có chắc chắn muốn xóa hồ sơ này không? Hành động này không thể hoàn tác!`
        : `Bạn có chắc chắn muốn xóa hồ sơ của "${staff.personal.fullName}"?`;

    const isConfirmed = await confirm({
      title: "Xác nhận xóa nhân sự",
      message: confirmMsg,
      confirmText: "Xóa hồ sơ",
      isDanger: true,
    });

    if (isConfirmed) {
      onDeleteStaff(staff.personal.id!);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "var(--spacing-md)",
      }}
    >
      {currentStaff.map((staff) => (
        <BaseCard
          key={staff.personal.id}
          onClick={() => navigate(`/hr/staff/${staff.personal.id}`)}
          style={{
            opacity: staff.employment.status === "resigned" ? 0.6 : 1,
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            padding: "0.75rem 1rem",
            gap: "0.5rem",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {({ isHovered }) => (
            <>
              {/* Delete Button – hiện khi hover */}
              <button
                onClick={(e) => handleDelete(e, staff)}
                title="Xóa hồ sơ nhân viên"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: isHovered ? "#fef2f2" : "transparent",
                  border: `1px solid ${isHovered ? "#fca5a5" : "transparent"}`,
                  borderRadius: "6px",
                  padding: "4px 6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.15s ease, background 0.15s ease",
                  zIndex: 2,
                }}
              >
                <Trash2 size={14} color="#dc2626" />
              </button>

              {/* Top: Avatar, Info */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: staff.personal.gender === "female" ? "#fce7f3" : "#e0f2fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <Stethoscope size={24} color={staff.personal.gender === "female" ? "#be185d" : "#0369a1"} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, paddingRight: "28px" }}>
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      margin: "0 0 6px 0",
                      color: "var(--text-main)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {staff.personal.fullName}
                    {staff.medicalCredentials?.practicingCert && new Date(staff.medicalCredentials.practicingCert.expiryDate || '2100-01-01') < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                      <span title="Chứng chỉ sắp hết hạn">
                        <AlertCircle size={16} color="#dc2626" style={{ marginLeft: "4px", verticalAlign: "text-bottom" }} />
                      </span>
                    )}
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#ffffff",
                        fontWeight: 600,
                        backgroundColor: "var(--primary)",
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {staff.personal.code}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: staff.personal.gender === "male" ? "#1e40af" : "#9d174d",
                        fontWeight: 700,
                        backgroundColor: staff.personal.gender === "male" ? "#dbeafe" : "#fce7f3",
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {staff.personal.gender === "male" ? "♂ Nam" : (staff.personal.gender === "female" ? "♀ Nữ" : "Khác")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Block */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "max-content 1fr",
                  gap: "0.4rem 0.75rem",
                  fontSize: "0.82rem",
                  color: "var(--text-main)",
                  marginTop: "auto", // Đẩy cụm detail xuống dưới, tận dụng không gian trống
                  paddingTop: "0.5rem",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>Phòng ban:</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {staff.employment.departmentId}
                </span>

                <span style={{ color: "var(--text-muted)" }}>Chức vụ:</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {staff.employment.jobTitle}
                </span>

                <div style={{ gridColumn: "1 / -1", height: "1px", backgroundColor: "var(--border)", margin: "0.25rem 0" }} />

                <span style={{ color: "var(--text-muted)" }}>Điện thoại:</span>
                <span style={{ fontWeight: 500 }}>{staff.personal.phone || "—"}</span>

                <span style={{ color: "var(--text-muted)" }}>Năm sinh:</span>
                <span style={{ fontWeight: 500 }}>{staff.personal.dob.split("-")[0]}</span>

                <span style={{ color: "var(--text-muted)" }}>Email:</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {staff.personal.email || "—"}
                </span>

                <div style={{ gridColumn: "1 / -1", height: "1px", backgroundColor: "var(--border)", margin: "0.25rem 0" }} />

                <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <UserCircle size={14} /> Tài khoản:
                </span>
                <span style={{ fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {staff.personal.code.toLowerCase()}
                  {staff.employment.status === "resigned" ? (
                    <span style={{ color: "#dc2626", fontSize: "0.75rem" }}>(Nghỉ)</span>
                  ) : (
                    <span style={{ color: "#16a34a", fontSize: "0.75rem" }}>(HĐ)</span>
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
