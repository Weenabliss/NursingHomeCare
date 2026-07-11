import React from "react";
import { AlertCircle, Stethoscope, UserCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { useConfirm } from "../../../contexts/ConfirmContext";
import type { Staff } from "../../../mock/staff";

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
      staff.status === "active"
        ? `⚠️ "${staff.name}" đang là nhân viên ĐANG LÀM VIỆC.\nBạn có chắc chắn muốn xóa hồ sơ này không? Hành động này không thể hoàn tác!`
        : `Bạn có chắc chắn muốn xóa hồ sơ của "${staff.name}"?`;

    const isConfirmed = await confirm({
      title: "Xác nhận xóa nhân sự",
      message: confirmMsg,
      confirmText: "Xóa hồ sơ",
      isDanger: true,
    });

    if (isConfirmed) {
      onDeleteStaff(staff.id);
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
                    {staff.name}
                    {staff.certWarning && (
                      <AlertCircle size={16} color="#dc2626" style={{ marginLeft: "4px", verticalAlign: "text-bottom" }} />
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
                      {staff.id}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: staff.gender === "male" ? "#1e40af" : "#9d174d",
                        fontWeight: 700,
                        backgroundColor: staff.gender === "male" ? "#dbeafe" : "#fce7f3",
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {staff.gender === "male" ? "♂ Nam" : "♀ Nữ"}
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
                  {staff.department}
                </span>

                <span style={{ color: "var(--text-muted)" }}>Chức vụ:</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {staff.position}
                </span>

                <div style={{ gridColumn: "1 / -1", height: "1px", backgroundColor: "var(--border)", margin: "0.25rem 0" }} />

                <span style={{ color: "var(--text-muted)" }}>Điện thoại:</span>
                <span style={{ fontWeight: 500 }}>{staff.phone || "—"}</span>

                <span style={{ color: "var(--text-muted)" }}>Năm sinh:</span>
                <span style={{ fontWeight: 500 }}>{staff.dob.split("-")[0]}</span>

                <span style={{ color: "var(--text-muted)" }}>Email:</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {staff.email}
                </span>

                <div style={{ gridColumn: "1 / -1", height: "1px", backgroundColor: "var(--border)", margin: "0.25rem 0" }} />

                <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <UserCircle size={14} /> Tài khoản:
                </span>
                <span style={{ fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {staff.id.toLowerCase()}
                  {staff.status === "resigned" ? (
                    <span style={{ color: "#dc2626", fontSize: "0.75rem" }}>(Khóa)</span>
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
