import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  UserPlus,
  AlertCircle,
  Clock,
  Stethoscope,
  UserCircle,
  Contact,
  Briefcase,
  Banknote,
  LineChart,
  CalendarDays,
} from "lucide-react";
import { BaseButton } from "../components/atoms/BaseButton";
import { BaseInput } from "../components/atoms/BaseInput";
import { BaseSelect } from "../components/atoms/BaseSelect";
import { BaseModal } from "../components/atoms/BaseModal";
import { BaseTabs } from "../components/atoms/BaseTabs";
import { PageHeader } from "../components/molecules/PageHeader";
import { Toolbar } from "../components/molecules/Toolbar";
import { BasePagination } from "../components/atoms/BasePagination";
import { useLayout } from "../contexts/LayoutContext";
import { BaseListCard } from "../components/atoms/BaseListCard";
import styles from "./Staff.module.scss";

const Staff: React.FC = () => {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<string>("personal");

  // Mock data for dropdowns
  const departments = [
    { label: "Tất cả Khoa/Phòng", value: "all" },
    { label: "Khoa Y Tế", value: "medical" },
    { label: "Tổ Điều Dưỡng", value: "nursing" },
    { label: "Phòng Hành Chính", value: "admin" },
  ];

  const positions = [
    { label: "Bác Sĩ Trưởng Khoa", value: "head_doctor" },
    { label: "Điều Dưỡng Trưởng", value: "head_nurse" },
    { label: "Điều Dưỡng Viên", value: "nurse" },
    { label: "Lễ Tân", value: "receptionist" },
  ];

  // Highly detailed mock data reflecting the Business Logic
  const generateMockStaff = () => {
    const departments = ["Khoa Y Tế", "Tổ Điều Dưỡng", "Phòng Hành Chính", "Kế Toán", "Bảo Vệ", "Tổ Bếp"];
    const positions = ["Bác Sĩ", "Điều Dưỡng", "Lễ Tân", "Nhân Sự", "Kế Toán Viên", "Bảo Vệ Viên", "Đầu Bếp"];
    const roles = ["PRESCRIPTION_WRITE", "NURSE_BASIC", "HR_STAFF", "FINANCE_STAFF", "SECURITY_STAFF", "KITCHEN_STAFF"];

    return Array.from({ length: 42 }).map((_, i) => {
      const isMale = i % 2 === 0;
      const statusRnd = Math.random();
      const status = statusRnd > 0.85 ? "resigned" : statusRnd > 0.7 ? "on_leave" : "active";
      return {
        id: `NV24${String(i + 1).padStart(3, "0")}`,
        name: isMale
          ? `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`
          : `Trần Thị ${String.fromCharCode(65 + (i % 26))}`,
        email: `nv${String.fromCharCode(97 + (i % 26))}${i + 1}@weenabliss.vn`,
        cccd: `001${i % 2 === 0 ? "0" : "1"}${90 + (i % 10)}${String(i * 12345).padStart(6, "0")}`,
        department: departments[i % departments.length],
        position: positions[i % positions.length],
        status: status,
        joinDate: `202${Math.floor(Math.random() * 4)}-0${(i % 9) + 1}-15`,
        autoRoles: status === "resigned" ? [] : [roles[i % roles.length]],
        certWarning: i % 7 === 0,
        gender: isMale ? "male" : "female",
        age: 25 + (i % 20),
        dob: `19${90 + (i % 10)}-01-01`,
        avatar: `https://i.pravatar.cc/150?u=staff_nursing_${i}`,
      };
    });
  };

  const staffList = React.useMemo(() => generateMockStaff(), []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(staffList.length / itemsPerPage);
  const currentStaff = staffList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const { setFooterContent } = useLayout();

  useEffect(() => {
    setFooterContent(
      <BasePagination
        currentPage={currentPage}
        totalItems={staffList.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        style={{ padding: "0 2rem" }}
      />
    );
    return () => setFooterContent(null);
  }, [currentPage, totalPages, itemsPerPage, staffList.length, setFooterContent]);

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
                Tiếp Nhận Nhân Sự Mới
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
                <BaseSelect options={departments} fullWidth={true} />
              </div>
              <div className={styles.filterItem}>
                <BaseSelect options={positions} fullWidth={true} />
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
          <BaseListCard
            key={staff.id}
            isSelected={selectedStaff?.id === staff.id}
            onClick={() => setSelectedStaff(staff)}
            hoverBorderColor={staff.gender === "female" ? "#ec4899" : "#3b82f6"}
            selectedBorderColor={staff.gender === "female" ? "#be185d" : "#1d4ed8"}
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
          </BaseListCard>
        ))}
      </div>

      {/* Add Employee Modal */}
      <BaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tiếp nhận nhân sự mới (Onboarding)"
        onConfirm={() => setIsAddModalOpen(false)}
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
          <BaseInput label="Họ và tên" placeholder="Nhập họ và tên..." />
          <BaseInput label="Số điện thoại / Email" placeholder="Dùng làm tài khoản đăng nhập..." />
          <BaseInput label="Số CCCD" placeholder="..." />
          <BaseSelect label="Thuộc Khoa/Phòng" options={departments.filter((d) => d.value !== "all")} />
          <BaseSelect label="Chức danh bổ nhiệm" options={positions} />
        </div>
      </BaseModal>

      <BaseModal
        isOpen={!!selectedStaff}
        onClose={() => {
          setSelectedStaff(null);
          setIsEditing(false);
        }}
        title="Hồ sơ Nhân sự"
        maxWidth="1300px"
        footerRightContent={
          !isEditing ? (
            <>
              <BaseButton
                variant="outline"
                onClick={() => {
                  setSelectedStaff(null);
                  setIsEditing(false);
                }}
              >
                Đóng
              </BaseButton>
              <BaseButton variant="primary" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </BaseButton>
            </>
          ) : (
            <>
              <BaseButton variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </BaseButton>
              <BaseButton variant="primary" onClick={() => setIsEditing(false)}>
                Lưu lại
              </BaseButton>
            </>
          )
        }
      >
        {selectedStaff && (
          <div className={styles.modalLayout}>
            {/* LEFT SIDEBAR: Avatar & Basic Info */}
            <div className={styles.sidebar}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ position: "relative", marginBottom: "1rem" }}>
                  <img
                    src={selectedStaff.avatar}
                    alt={selectedStaff.name}
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `3px solid ${selectedStaff.gender === "female" ? "#ec4899" : "#3b82f6"}`,
                      boxShadow: "var(--shadow-md)",
                    }}
                  />
                  {isEditing && (
                    <label
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                        backgroundColor: "var(--surface)",
                        borderRadius: "50%",
                        padding: "6px",
                        border: "1px solid var(--border)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary)",
                        transition: "all 0.2s",
                        boxShadow: "var(--shadow-sm)",
                      }}
                      title="Thay đổi ảnh đại diện"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const fileUrl = URL.createObjectURL(e.target.files[0]);
                            setSelectedStaff({ ...selectedStaff, avatar: fileUrl });
                          }
                        }}
                      />
                      <UserCircle size={20} />
                    </label>
                  )}
                </div>

                {!isEditing ? (
                  <>
                    <h2
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        textAlign: "center",
                      }}
                    >
                      {selectedStaff.name}
                    </h2>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#ffffff",
                          fontWeight: 600,
                          backgroundColor: "var(--primary)",
                          padding: "2px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        {selectedStaff.id}
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: selectedStaff.gender === "male" ? "#1e40af" : "#9d174d",
                          fontWeight: 700,
                          backgroundColor: selectedStaff.gender === "male" ? "#dbeafe" : "#fce7f3",
                          padding: "2px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        {selectedStaff.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0",
                        color: "var(--text-muted)",
                        fontSize: "1rem",
                        fontWeight: 500,
                        textAlign: "center",
                      }}
                    >
                      {selectedStaff.position}
                      <br />
                      <span style={{ fontSize: "0.9rem" }}>{selectedStaff.department}</span>
                    </p>

                    <div style={{ marginTop: "1rem" }}>
                      {selectedStaff.status === "active" && (
                        <span
                          style={{
                            backgroundColor: "var(--success)",
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          Đang làm việc
                        </span>
                      )}
                      {selectedStaff.status === "on_leave" && (
                        <span
                          style={{
                            backgroundColor: "var(--warning)",
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          Nghỉ thai sản
                        </span>
                      )}
                      {selectedStaff.status === "resigned" && (
                        <span
                          style={{
                            backgroundColor: "var(--text-muted)",
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          Đã nghỉ việc
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      width: "100%",
                      marginTop: "0.5rem",
                    }}
                  >
                    <BaseInput label="Họ và tên" defaultValue={selectedStaff.name} placeholder="Họ và tên" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <BaseSelect
                        label="Giới tính"
                        options={[
                          { label: "Nam", value: "male" },
                          { label: "Nữ", value: "female" },
                        ]}
                        defaultValue={selectedStaff.gender}
                      />
                      <BaseSelect
                        label="Trạng thái"
                        options={[
                          { label: "Đang làm việc", value: "active" },
                          { label: "Nghỉ thai sản", value: "on_leave" },
                          { label: "Đã nghỉ việc", value: "resigned" },
                        ]}
                        defaultValue={selectedStaff.status}
                      />
                    </div>
                    <BaseSelect
                      label="Phòng ban"
                      options={departments.filter((d) => d.value !== "all")}
                      defaultValue={departments.find((d) => d.label === selectedStaff.department)?.value || ""}
                    />
                    <BaseSelect
                      label="Chức vụ"
                      options={positions}
                      defaultValue={positions.find((p) => p.label === selectedStaff.position)?.value || ""}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                        Tên đăng nhập (Email)
                      </span>
                      <div style={{ display: "flex", alignItems: "stretch", flex: 1, minHeight: "42px" }}>
                        <input
                          defaultValue={selectedStaff.email.split("@")[0]}
                          style={{
                            flex: 1,
                            padding: "0.5rem 0.75rem",
                            border: "1px solid var(--border)",
                            borderRight: "none",
                            borderTopLeftRadius: "var(--radius-sm)",
                            borderBottomLeftRadius: "var(--radius-sm)",
                            outline: "none",
                            fontSize: "1rem",
                            minWidth: 0,
                          }}
                        />
                        <div
                          style={{
                            padding: "0 0.5rem",
                            backgroundColor: "var(--background-alt)",
                            border: "1px solid var(--border)",
                            borderLeft: "none",
                            borderTopRightRadius: "var(--radius-sm)",
                            borderBottomRightRadius: "var(--radius-sm)",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem",
                          }}
                        >
                          @weenabliss.vn
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className={styles.modalMain}>
              {/* TABS */}
              <BaseTabs
                activeTab={activeModalTab}
                onChange={setActiveModalTab}
                options={[
                  { value: "personal", label: "Cá nhân", icon: Contact },
                  { value: "job", label: "Công việc", icon: Briefcase },
                  { value: "payroll", label: "Lương thưởng", icon: Banknote },
                  { value: "performance", label: "Hiệu suất", icon: LineChart },
                  { value: "attendance", label: "Nghỉ phép", icon: CalendarDays },
                ]}
              />

              {/* TAB CONTENT */}
              <div className={styles.tabContent}>
                {activeModalTab === "personal" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {/* Basic Info */}
                    <div className={styles.infoSection}>
                      <h3 className={styles.infoSectionTitle}>Định danh & Giấy tờ</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Ngày sinh</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput type="date" defaultValue={selectedStaff.dob} />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>
                              {selectedStaff.dob} ({selectedStaff.age} tuổi)
                            </span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>CCCD/Hộ chiếu</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue={selectedStaff.cccd} />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600 }}>{selectedStaff.cccd}</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Ngày cấp</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput type="date" defaultValue="2020-08-15" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>15/08/2020</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Nơi cấp</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue="Cục CS QLHC về TTXH" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>Cục CS QLHC về TTXH</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.infoSection}>
                      <h3 className={styles.infoSectionTitle}>Liên lạc & Gia cảnh</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Điện thoại</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue="0988.123.456" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>0988.xxx.xxx</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Email cá nhân</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue={selectedStaff.email} />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>{selectedStaff.email}</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Thường trú</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue="Quận Đống Đa, Hà Nội" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>Quận Đống Đa, Hà Nội</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Người phụ thuộc</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput type="number" defaultValue={2} />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500, color: "var(--primary-dark)" }}>02 người</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Emergency */}
                    <div
                      style={{
                        gridColumn: "1 / -1",
                        backgroundColor: "#fff1f2",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid #fecdd3",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "#be123c",
                          margin: "0 0 0.5rem 0",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <AlertCircle size={16} /> Liên hệ khẩn cấp
                      </h3>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: "200px" }}>
                            <BaseInput label="Họ tên người liên hệ" defaultValue="Nguyễn Văn X" />
                          </div>
                          <div style={{ flex: 1, minWidth: "150px" }}>
                            <BaseInput label="Quan hệ" defaultValue="Chồng" />
                          </div>
                          <div style={{ flex: 1, minWidth: "200px" }}>
                            <BaseInput label="Số điện thoại" defaultValue="0904.xxx.xxx" />
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "2rem", fontSize: "0.9rem", color: "#881337" }}>
                          <span>
                            <strong>Tên:</strong> Nguyễn Văn X (Chồng)
                          </span>
                          <span>
                            <strong>SĐT:</strong> 0904.xxx.xxx
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeModalTab === "job" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Job Details */}
                    <div
                      style={{
                        backgroundColor: "var(--background-alt)",
                        padding: "1.25rem",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                        gridColumn: "1 / -1",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-muted)",
                          margin: "0 0 1rem 0",
                        }}
                      >
                        Vị trí & Pháp lý
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            minHeight: "42px",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ color: "var(--text-muted)", minWidth: "140px" }}>Quản lý trực tiếp</span>
                          {isEditing ? (
                            <div style={{ flex: 1 }}>
                              <BaseInput defaultValue="Giám đốc Trung Tâm" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500, color: "var(--primary-dark)" }}>Giám đốc Trung Tâm</span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            minHeight: "42px",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ color: "var(--text-muted)", minWidth: "140px" }}>Loại HĐLĐ</span>
                          {isEditing ? (
                            <div style={{ flex: 1 }}>
                              <BaseInput defaultValue="Không xác định thời hạn" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>Không xác định thời hạn</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Ngày bắt đầu HĐ</span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput type="date" defaultValue={selectedStaff.joinDate} />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>{selectedStaff.joinDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModalTab === "payroll" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div className={styles.infoSection}>
                      <h3 className={styles.infoSectionTitle}>Thu nhập & Thanh toán</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
                            Mức lương cơ bản
                          </span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput type="number" defaultValue={25000000} />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600, color: "#16a34a" }}>Đã ẩn (Bảo mật)</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
                            Phụ cấp
                          </span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue="Ăn trưa, Điện thoại" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>Ăn trưa, Điện thoại</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
                            Số tài khoản
                          </span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue="1903xxxxxx (Techcombank)" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>1903xxxxxx (Techcombank)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3 className={styles.infoSectionTitle}>Thuế & Bảo hiểm</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
                            Mã số thuế (TNCN)
                          </span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue="830xxxxxxx" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600 }}>830xxxxxxx</span>
                          )}
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel} style={{ minWidth: "140px" }}>
                            Mã số sổ BHXH
                          </span>
                          {isEditing ? (
                            <div className={styles.infoValue}>
                              <BaseInput defaultValue="011xxxxxxx" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600 }}>011xxxxxxx</span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            minHeight: "42px",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ color: "var(--text-muted)", minWidth: "140px" }}>Tỷ lệ đóng</span>
                          {isEditing ? (
                            <div style={{ flex: 1 }}>
                              <BaseInput defaultValue="NLĐ: 10.5% | NSDLĐ: 21.5%" />
                            </div>
                          ) : (
                            <span style={{ fontWeight: 500 }}>NLĐ: 10.5% | NSDLĐ: 21.5%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModalTab === "performance" && (
                  <div
                    style={{
                      backgroundColor: "var(--background-alt)",
                      padding: "1.25rem",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text-muted)",
                        margin: "0 0 1rem 0",
                      }}
                    >
                      Đánh giá Hiệu suất Gần nhất
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                            Mức độ hoàn thành KPIs (Quý 2)
                          </span>
                          <span style={{ fontWeight: 700, color: "var(--primary-dark)" }}>95%</span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "8px",
                            backgroundColor: "var(--border)",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div style={{ width: "95%", height: "100%", backgroundColor: "var(--primary)" }} />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderTop: "1px dashed var(--border)",
                          paddingTop: "0.75rem",
                        }}
                      >
                        <span style={{ color: "var(--text-muted)" }}>Xếp loại</span>
                        <span style={{ fontWeight: 600, color: "#16a34a" }}>Xuất sắc</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeModalTab === "attendance" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div
                      style={{
                        backgroundColor: "var(--background-alt)",
                        padding: "1.25rem",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-muted)",
                          margin: "0 0 1rem 0",
                        }}
                      >
                        Quỹ Phép Năm
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                          {isEditing ? (
                            <BaseInput type="number" defaultValue={12} style={{ width: "70px", textAlign: "center" }} />
                          ) : (
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-main)" }}>12</div>
                          )}
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tổng phép</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#dc2626" }}>3</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Đã nghỉ</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16a34a" }}>9</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Còn lại</div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: "var(--background-alt)",
                        padding: "1.25rem",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-muted)",
                          margin: "0 0 1rem 0",
                        }}
                      >
                        Chuyên Cần (Tháng Này)
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--text-muted)" }}>Đi trễ / Về sớm</span>
                          <span style={{ fontWeight: 500, color: "#dc2626" }}>02 lần</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--text-muted)" }}>Nghỉ không phép</span>
                          <span style={{ fontWeight: 500, color: "var(--text-main)" }}>0 ngày</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--text-muted)" }}>Tăng ca (OT)</span>
                          <span style={{ fontWeight: 500, color: "var(--primary-dark)" }}>14 giờ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
};

export default Staff;
