import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserPlus, AlertCircle, Clock, Stethoscope, UserCircle } from "lucide-react";
import { BaseButton } from "../components/atoms/BaseButton";
import { BaseInput } from "../components/atoms/BaseInput";
import { BaseSelect } from "../components/atoms/BaseSelect";
import { BaseModal } from "../components/atoms/BaseModal";
import { PageHeader } from "../components/molecules/PageHeader";
import { Toolbar } from "../components/molecules/Toolbar";
import { BasePagination } from "../components/atoms/BasePagination";
import { useLayout } from "../contexts/LayoutContext";
import { BaseCard } from "../components/atoms/BaseCard";
import { staffListMock, departmentsMock, positionsMock } from "../mock/staff";
import styles from "./Staff.module.scss";

const Staff: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsDirty(false); // Reset on close
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(staffListMock.length / itemsPerPage);
  const currentStaff = staffListMock.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const { setFooterContent } = useLayout();

  useEffect(() => {
    setFooterContent(
      <BasePagination
        currentPage={currentPage}
        totalItems={staffListMock.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        style={{ padding: "0 2rem" }}
      />
    );
    return () => setFooterContent(null);
  }, [currentPage, totalPages, itemsPerPage, setFooterContent]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PageHeader
          title="Hồ Sơ Nhân Sự (HR)"
          subtitle="Quản lý vòng đời nhân viên và Tự động cấp quyền (Auto-RBAC)"
          actions={
            <>
              <BaseButton variant="outline">
                <Clock size={18} />
                Chốt Bảng Lương
              </BaseButton>
              <BaseButton onClick={() => setIsAddModalOpen(true)}>
                <UserPlus size={18} />
                {t("common.add")}
              </BaseButton>
            </>
          }
        />

        <Toolbar
          searchPlaceholder={t("hr.searchEmp")}
          onSearch={() => {}}
          filters={
            <div className={styles.filters}>
              <div className={styles.filterItem}>
                <BaseSelect options={departmentsMock} fullWidth={true} />
              </div>
              <div className={styles.filterItem}>
                <BaseSelect options={positionsMock} fullWidth={true} />
              </div>
            </div>
          }
        />

        {/* Notice Banner */}
        <div className={styles.noticeBanner}>
          <AlertCircle size={20} />
          <span className={styles.noticeText}>
            Hệ thống phát hiện có <strong>1</strong> Điều Dưỡng Viên sắp hết hạn Chứng chỉ hành nghề trong 30 ngày tới.
            Yêu cầu nộp bổ sung!
          </span>
        </div>
      </div>

      {/* Card List */}
      <div className={styles.grid}>
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
                </div>{" "}
              </>
            )}
          </BaseCard>
        ))}
      </div>

      {/* Add Employee Modal */}
      <BaseModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title="Tiếp nhận nhân sự mới"
        confirmText={t("common.save")}
        onConfirm={handleCloseModal}
        isDirty={isDirty}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-md)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            Hệ thống sẽ tự động tạo Tài khoản App và Phân quyền dựa trên Chức vụ bạn chọn bên dưới.
          </div>
          <BaseInput label="Họ và tên" placeholder="Nhập họ và tên..." onChange={() => setIsDirty(true)} />
          <BaseInput label="Số điện thoại / Email" placeholder="Dùng làm tài khoản đăng nhập..." onChange={() => setIsDirty(true)} />
          <BaseInput label="Số CCCD" placeholder="..." onChange={() => setIsDirty(true)} />
          <BaseSelect label="Thuộc Khoa/Phòng" options={departmentsMock.filter((d) => d.value !== "all")} onChange={() => setIsDirty(true)} />
          <BaseSelect label="Chức danh bổ nhiệm" options={positionsMock} onChange={() => setIsDirty(true)} />
        </div>
      </BaseModal>
    </div>
  );
};

export default Staff;
