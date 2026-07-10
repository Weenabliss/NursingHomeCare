import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserCircle,
  Contact,
  Briefcase,
  Banknote,
  LineChart,
  CalendarDays,
  AlertCircle,
  ArrowLeft,
  X,
  Image as ImageIcon,
  FileText,
  ChevronLeft,
  ChevronRight,
  Activity,
  Coffee,
  Droplets,
  HeartPulse,
  Pill,
  Calendar,
  Clock,
} from "lucide-react";
import { BaseButton } from "../components/atoms/BaseButton";
import { BaseInput } from "../components/atoms/BaseInput";
import { BaseModal } from "../components/atoms/BaseModal";
import { BaseTabs } from "../components/atoms/BaseTabs";
import { BaseCard } from "../components/atoms/BaseCard";
import { BaseSelect } from "../components/atoms/BaseSelect";
import { useTranslation } from "react-i18next";
import { staffListMock, departmentsMock, positionsMock } from "../mock/staff";
import type { Staff } from "../mock/staff";
import styles from "./StaffDetail.module.scss";

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [headerFormData, setHeaderFormData] = useState<Partial<Staff>>({});
  const [isHeaderDirty, setIsHeaderDirty] = useState(false);
  
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isIdentityDirty, setIsIdentityDirty] = useState(false);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isContactDirty, setIsContactDirty] = useState(false);
  
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isEmergencyDirty, setIsEmergencyDirty] = useState(false);
  
  const closeHeaderModal = () => { setIsHeaderModalOpen(false); setIsHeaderDirty(false); };
  const closeIdentityModal = () => { setIsIdentityModalOpen(false); setIsIdentityDirty(false); };
  const closeContactModal = () => { setIsContactModalOpen(false); setIsContactDirty(false); };
  const closeEmergencyModal = () => { setIsEmergencyModalOpen(false); setIsEmergencyDirty(false); };

  const isEditing = false; // Tạm thời đặt hằng số để tránh lỗi crash ở các tab chưa chuyển sang Modal
  const [activeTab, setActiveTab] = useState<string>("attendance"); // Default to attendance as requested
  const [calendarMode, setCalendarMode] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-07-10"));
  const [isPreviewAvatarOpen, setIsPreviewAvatarOpen] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch data from API here.
    const foundStaff = staffListMock.find((s) => s.id === id);
    if (foundStaff) {
      setStaff(foundStaff);
    }
  }, [id]);

  if (!staff) {
    return (
      <div className={styles.container} style={{ alignItems: "center", justifyContent: "center" }}>
        <h2>Không tìm thấy nhân sự</h2>
        <BaseButton onClick={() => navigate("/hr/staff")}>Quay lại</BaseButton>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div 
        className={styles.topHeader} 
        onClick={() => {
          setHeaderFormData(staff);
          setIsHeaderModalOpen(true);
        }}
        title="Nhấn để chỉnh sửa thông tin"
      >
        <div className={styles.headerLeft}>
          <div className={styles.avatarWrapper}>
            <div onClick={(e) => { e.stopPropagation(); setIsPreviewAvatarOpen(true); }} title="Xem ảnh lớn" style={{ display: "inline-block" }}>
              <img
                src={staff.avatar}
                alt={staff.name}
                className={styles.avatar}
                style={{
                  borderColor: staff.gender === "female" ? "#ec4899" : "#3b82f6",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerTitleRow}>
              <h1 className={styles.staffName}>{staff.name}</h1>
              {staff.status === "active" && (
                <span
                  style={{
                    backgroundColor: "#dcfce7",
                    color: "#16a34a",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Đang làm việc
                </span>
              )}
              {staff.status === "on_leave" && (
                <span
                  style={{
                    backgroundColor: "#fef08a",
                    color: "#854d0e",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Nghỉ thai sản
                </span>
              )}
              {staff.status === "resigned" && (
                <span
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Đã nghỉ việc
                </span>
              )}
            </div>
            <div className={styles.basicInfoRow}>
              <div className={styles.basicInfoItem}>
                <Contact size={16} /> <span>{staff.id}</span>
              </div>
              <div className={styles.basicInfoItem}>
                <Briefcase size={16} />{" "}
                <span>
                  {staff.position} - {staff.department}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <BaseButton variant="outline" onClick={(e) => { e.stopPropagation(); navigate("/hr/staff"); }}>
            <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Quay lại
          </BaseButton>
        </div>
      </div>

      <div className={styles.mainContent}>
        <BaseTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "personal", label: "Cá nhân", icon: Contact },
            { value: "job", label: "Công việc", icon: Briefcase },
            { value: "payroll", label: "Lương thưởng", icon: Banknote },
            { value: "performance", label: "Hiệu suất", icon: LineChart },
            { value: "attendance", label: "Lịch làm việc", icon: CalendarDays },
            { value: "timekeeping", label: "Check-in/out", icon: Clock },
          ]}
        />
        <div className={styles.tabContent}>
          {activeTab === "personal" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Basic Info */}
              <BaseCard
                isSelected={isIdentityModalOpen}
                onClick={() => setIsIdentityModalOpen(true)}
              >
                <h3 className={styles.infoSectionTitle}>Định danh & Giấy tờ</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Ngày sinh</div>
                    <div style={{ fontWeight: 500, color: "var(--text-main)", fontSize: "0.95rem" }}>
                      {staff.dob} ({staff.age} tuổi)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>CCCD/Hộ chiếu</div>
                    <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>{staff.cccd}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Ngày cấp</div>
                    <div style={{ fontWeight: 500, color: "var(--text-main)", fontSize: "0.95rem" }}>15/08/2020</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Nơi cấp</div>
                    <div style={{ fontWeight: 500, color: "var(--text-main)", fontSize: "0.95rem" }}>Cục CS QLHC về TTXH</div>
                  </div>
                </div>
              </BaseCard>

              {/* Contact Info */}
              <BaseCard
                isSelected={isContactModalOpen}
                onClick={() => setIsContactModalOpen(true)}
              >
                <h3 className={styles.infoSectionTitle}>Liên lạc & Gia cảnh</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Điện thoại</div>
                    <div style={{ fontWeight: 500, color: "var(--text-main)", fontSize: "0.95rem" }}>0988.xxx.xxx</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Email cá nhân</div>
                    <div style={{ fontWeight: 500, color: "var(--text-main)", fontSize: "0.95rem" }}>{staff.email}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Thường trú</div>
                    <div style={{ fontWeight: 500, color: "var(--text-main)", fontSize: "0.95rem" }}>Quận Đống Đa, Hà Nội</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Người phụ thuộc</div>
                    <div style={{ fontWeight: 600, color: "var(--primary-dark)", fontSize: "0.95rem" }}>02 người</div>
                  </div>
                </div>
              </BaseCard>

              {/* Emergency */}
              <BaseCard
                isSelected={isEmergencyModalOpen}
                onClick={() => setIsEmergencyModalOpen(true)}
                style={{ backgroundColor: "#fff1f2", borderColor: isEmergencyModalOpen ? "var(--primary)" : "#fecdd3" }}
              >
                <h3
                  className={styles.infoSectionTitle}
                  style={{ color: "#be123c", display: "flex", alignItems: "center", gap: "0.5rem", borderBottomColor: "#fda4af" }}
                >
                  <AlertCircle size={16} /> Liên hệ khẩn cấp
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#9f1239", marginBottom: "4px" }}>Họ tên người liên hệ</div>
                    <div style={{ fontWeight: 600, color: "#881337", fontSize: "0.95rem" }}>Nguyễn Văn X</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#9f1239", marginBottom: "4px" }}>Quan hệ</div>
                    <div style={{ fontWeight: 500, color: "#881337", fontSize: "0.95rem" }}>Chồng</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#9f1239", marginBottom: "4px" }}>Số điện thoại</div>
                    <div style={{ fontWeight: 600, color: "#be123c", fontSize: "0.95rem" }}>09xx.xxx.xxx</div>
                  </div>
                </div>
              </BaseCard>

              {/* RBAC */}
              <BaseCard>
                <h3 className={styles.infoSectionTitle}>Quyền hạn hệ thống (RBAC)</h3>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {staff.autoRoles.length > 0 ? (
                    staff.autoRoles.map((role: string) => (
                      <span
                        key={role}
                        style={{
                          fontSize: "0.8rem",
                          padding: "4px 12px",
                          borderRadius: "16px",
                          backgroundColor: "var(--surface)",
                          color: "var(--primary-dark)",
                          fontWeight: 600,
                          border: "1px solid var(--border)",
                        }}
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#dc2626", fontStyle: "italic", fontWeight: 500 }}>
                      Tài khoản đang bị khóa - Đã thu hồi toàn bộ quyền
                    </span>
                  )}
                </div>
              </BaseCard>
            </div>
          )}

          {activeTab === "payroll" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <BaseCard>
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
              </BaseCard>

              <BaseCard>
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
                </div>
              </BaseCard>
            </div>
          )}

          {activeTab === "job" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {/* Certificates */}
              <BaseCard>
                <h3 className={styles.infoSectionTitle}>Hồ sơ & Bằng cấp</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {staff.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--background)",
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", width: "100%" }}>
                          <div style={{ flex: 1, minWidth: "200px" }}>
                            <BaseInput label="Tên bằng cấp" defaultValue={cert.name} />
                          </div>
                          <div style={{ flex: 1, minWidth: "150px" }}>
                            <BaseInput label="Nơi cấp" defaultValue={cert.issuer} />
                          </div>
                          <div style={{ width: "130px" }}>
                            <BaseInput label="Ngày cấp" type="date" defaultValue={cert.issueDate} />
                          </div>
                          <div style={{ width: "130px" }}>
                            <BaseInput label="Ngày hết hạn" type="date" defaultValue={cert.expiryDate || ""} />
                          </div>
                          <div
                            style={{
                              width: "100%",
                              marginTop: "0.25rem",
                              display: "flex",
                              alignItems: "flex-end",
                              gap: "0.5rem",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <BaseInput label="URL Ảnh chụp" defaultValue={cert.imageUrl || ""} />
                            </div>
                            <BaseButton variant="outline" type="button" style={{ height: "38px" }}>
                              <ImageIcon size={16} style={{ marginRight: "4px" }} /> Tải lên
                            </BaseButton>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            {cert.imageUrl && (
                              <img
                                src={cert.imageUrl}
                                alt={cert.name}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  border: "1px solid var(--border)",
                                }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-main)" }}>
                                {cert.name}
                              </div>
                              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{cert.issuer}</div>
                            </div>
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.25rem",
                              alignItems: "flex-end",
                            }}
                          >
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Cấp: {cert.issueDate}</div>
                            {cert.expiryDate && (
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: staff.certWarning ? "#dc2626" : "var(--text-muted)",
                                  fontWeight: staff.certWarning ? 600 : 400,
                                }}
                              >
                                Hết hạn: {cert.expiryDate}
                              </div>
                            )}
                            {cert.imageUrl && (
                              <a
                                href={cert.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  fontSize: "0.8rem",
                                  color: "var(--primary)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  textDecoration: "none",
                                  marginTop: "2px",
                                }}
                              >
                                <ImageIcon size={14} /> Xem ảnh
                              </a>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </BaseCard>

              {/* Contracts */}
              <BaseCard>
                <h3 className={styles.infoSectionTitle}>Hợp đồng lao động</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {staff.contracts.map((contract) => (
                    <div
                      key={contract.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--background)",
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", width: "100%" }}>
                          <div style={{ flex: 1 }}>
                            <BaseSelect
                              label="Loại hợp đồng"
                              defaultValue={contract.type}
                              options={[
                                { label: "Thử việc", value: "Thử việc" },
                                { label: "Có thời hạn 1 năm", value: "Có thời hạn 1 năm" },
                                { label: "Có thời hạn 3 năm", value: "Có thời hạn 3 năm" },
                                { label: "Vô thời hạn", value: "Vô thời hạn" },
                              ]}
                            />
                          </div>
                          <div style={{ width: "130px" }}>
                            <BaseInput label="Từ ngày" type="date" defaultValue={contract.startDate} />
                          </div>
                          <div style={{ width: "130px" }}>
                            <BaseInput label="Đến ngày" type="date" defaultValue={contract.endDate || ""} />
                          </div>
                          <div style={{ width: "130px" }}>
                            <BaseSelect
                              label="Trạng thái"
                              defaultValue={contract.status}
                              options={[
                                { label: "Hiệu lực", value: "active" },
                                { label: "Hết hạn", value: "expired" },
                                { label: "Đã chấm dứt", value: "terminated" },
                              ]}
                            />
                          </div>
                          <div
                            style={{
                              width: "100%",
                              marginTop: "0.25rem",
                              display: "flex",
                              alignItems: "flex-end",
                              gap: "0.5rem",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <BaseInput label="URL Bản quét Hợp đồng" defaultValue={contract.documentUrl || ""} />
                            </div>
                            <BaseButton variant="outline" type="button" style={{ height: "38px" }}>
                              <FileText size={16} style={{ marginRight: "4px" }} /> Đính kèm
                            </BaseButton>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                color: "var(--text-main)",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {contract.type}
                              {contract.documentUrl && (
                                <a
                                  href={contract.documentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ display: "inline-flex", color: "var(--primary)", textDecoration: "none" }}
                                  title="Xem bản quét"
                                >
                                  <FileText size={16} />
                                </a>
                              )}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                              Từ: {contract.startDate} {contract.endDate ? `Đến: ${contract.endDate}` : ""}
                            </div>
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}
                          >
                            {contract.status === "active" && (
                              <span
                                style={{
                                  backgroundColor: "#dcfce7",
                                  color: "#16a34a",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                }}
                              >
                                Hiệu lực
                              </span>
                            )}
                            {contract.status === "expired" && (
                              <span
                                style={{
                                  backgroundColor: "#fee2e2",
                                  color: "#dc2626",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                }}
                              >
                                Hết hạn
                              </span>
                            )}
                            {contract.status === "terminated" && (
                              <span
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  color: "#4b5563",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                }}
                              >
                                Đã chấm dứt
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </BaseCard>

              {/* Work History */}
              <BaseCard>
                <h3 className={styles.infoSectionTitle}>Quá trình công tác</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {staff.workHistory.map((history) => (
                    <div key={history.id} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", width: "100%" }}>
                          <div style={{ flex: 1 }}>
                            <BaseInput label="Chức vụ" defaultValue={history.role} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <BaseInput label="Phòng ban" defaultValue={history.department} />
                          </div>
                          <div style={{ width: "130px" }}>
                            <BaseInput label="Từ ngày" type="date" defaultValue={history.startDate} />
                          </div>
                          <div style={{ width: "130px" }}>
                            <BaseInput label="Đến ngày" type="date" defaultValue={history.endDate || ""} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              minWidth: "120px",
                              fontSize: "0.85rem",
                              color: "var(--text-muted)",
                              paddingTop: "2px",
                            }}
                          >
                            {history.startDate} - {history.endDate || "Nay"}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              paddingBottom: "0.5rem",
                              borderLeft: "2px solid var(--border)",
                              paddingLeft: "1rem",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                left: "-5px",
                                top: "4px",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "var(--primary)",
                              }}
                            ></div>
                            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-main)" }}>
                              {history.role}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{history.department}</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </BaseCard>
            </div>
          )}

          {activeTab === "attendance" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <BaseCard>
                <div className={styles.calendarControls}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <BaseButton
                      variant="outline"
                      style={{ padding: "6px" }}
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        if (calendarMode === "month") newDate.setMonth(newDate.getMonth() - 1);
                        else if (calendarMode === "week") newDate.setDate(newDate.getDate() - 7);
                        else newDate.setDate(newDate.getDate() - 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      <ChevronLeft size={18} />
                    </BaseButton>
                    <h3 style={{ margin: 0, minWidth: "150px", textAlign: "center", color: "var(--text-main)" }}>
                      {calendarMode === "month"
                        ? `Tháng ${selectedDate.getMonth() + 1} / ${selectedDate.getFullYear()}`
                        : calendarMode === "week"
                          ? `Tuần ${Math.ceil(selectedDate.getDate() / 7)} Tháng ${selectedDate.getMonth() + 1}`
                          : `Ngày ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`}
                    </h3>
                    <BaseButton
                      variant="outline"
                      style={{ padding: "6px" }}
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        if (calendarMode === "month") newDate.setMonth(newDate.getMonth() + 1);
                        else if (calendarMode === "week") newDate.setDate(newDate.getDate() + 7);
                        else newDate.setDate(newDate.getDate() + 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      <ChevronRight size={18} />
                    </BaseButton>
                  </div>

                  <div className={styles.calendarModes}>
                    <button
                      className={`${styles.modeBtn} ${calendarMode === "day" ? styles.active : ""}`}
                      onClick={() => setCalendarMode("day")}
                    >
                      Ngày
                    </button>
                    <button
                      className={`${styles.modeBtn} ${calendarMode === "week" ? styles.active : ""}`}
                      onClick={() => setCalendarMode("week")}
                    >
                      Tuần
                    </button>
                    <button
                      className={`${styles.modeBtn} ${calendarMode === "month" ? styles.active : ""}`}
                      onClick={() => setCalendarMode("month")}
                    >
                      Tháng
                    </button>
                  </div>
                </div>

                {calendarMode === "month" && (
                  <div className={styles.calendarGrid}>
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                      <div key={d} className={styles.calendarHeader}>
                        {d}
                      </div>
                    ))}
                    {/* Empty days for offset (assuming month starts on Wed for dummy UI) */}
                    <div className={`${styles.calendarDay} ${styles.emptyDay}`}></div>
                    <div className={`${styles.calendarDay} ${styles.emptyDay}`}></div>
                    {staff.schedule.days.map((dayData, idx) => {
                      const isCurrentDay = dayData.date === "2026-07-10";
                      const isSelected = selectedDate.getDate() === idx + 1;
                      let shiftClass = styles.off;
                      if (dayData.shift === "Ca Sáng") shiftClass = styles.morning;
                      if (dayData.shift === "Ca Chiều") shiftClass = styles.afternoon;
                      if (dayData.shift === "Ca Đêm") shiftClass = styles.night;
                      if (dayData.shift === "Hành Chính") shiftClass = styles.admin;

                      return (
                        <div
                          key={dayData.date}
                          className={`${styles.calendarDay} ${isCurrentDay ? styles.currentDay : ""}`}
                          onClick={() => {
                            setSelectedDate(new Date(dayData.date));
                            setCalendarMode("day");
                          }}
                          style={{ border: isSelected ? "2px solid var(--primary)" : "none" }}
                        >
                          <span className={styles.dayNumber}>{idx + 1}</span>
                          <div className={`${styles.shiftBadge} ${shiftClass}`}>{dayData.shift}</div>
                          {dayData.tasks.length > 0 && (
                            <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", marginTop: "auto" }}>
                              {dayData.tasks.slice(0, 3).map((t) => (
                                <div
                                  key={t.id}
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "var(--primary-dark)",
                                  }}
                                ></div>
                              ))}
                              {dayData.tasks.length > 3 && (
                                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>+</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {calendarMode === "week" && (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <Calendar size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
                    <p>Chế độ xem tuần (Đang phát triển, vui lòng xem Tháng hoặc Ngày)</p>
                  </div>
                )}

                {calendarMode === "day" && (
                  <div className={styles.timeline}>
                    {staff.schedule.days.find((d) => parseInt(d.date.split("-")[2]) === selectedDate.getDate())
                      ?.shift === "Nghỉ" ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "3rem",
                          color: "var(--text-muted)",
                          backgroundColor: "var(--background-alt)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <Coffee size={40} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                        <p style={{ margin: 0, fontWeight: 500 }}>Nhân viên có lịch nghỉ vào ngày này.</p>
                      </div>
                    ) : (
                      staff.schedule.days
                        .find((d) => parseInt(d.date.split("-")[2]) === selectedDate.getDate())
                        ?.tasks.map((task) => {
                          let Icon = Activity;
                          if (task.type === "meal") Icon = Coffee;
                          if (task.type === "bath") Icon = Droplets;
                          if (task.type === "toilet") Icon = Droplets; // Reusing icon for demo
                          if (task.type === "health") Icon = HeartPulse;
                          if (task.type === "medication") Icon = Pill;

                          return (
                            <div key={task.id} className={styles.timelineItem}>
                              <div className={styles.timelineTime}>{task.time}</div>
                              <div className={styles.timelineContent}>
                                <div className={`${styles.timelineIcon} ${styles[task.type]}`}>
                                  <Icon size={20} />
                                </div>
                                <div className={styles.timelineDetails}>
                                  <div className={styles.taskType}>
                                    {task.type === "activity"
                                      ? "Hoạt động / Tập thể dục"
                                      : task.type === "meal"
                                        ? "Phục vụ ăn uống"
                                        : task.type === "bath"
                                          ? "Tắm rửa / Vệ sinh cá nhân"
                                          : task.type === "toilet"
                                            ? "Hỗ trợ bài tiết"
                                            : task.type === "health"
                                              ? "Đo chỉ số sức khỏe (HA, Nhịp tim)"
                                              : "Hỗ trợ uống thuốc"}
                                  </div>
                                  <div className={styles.taskPatient}>
                                    Bệnh nhân: <span style={{ fontWeight: 600 }}>{task.patientName}</span>
                                  </div>
                                </div>
                                <div className={styles.taskRoom}>{task.room}</div>
                              </div>
                            </div>
                          );
                        }) || (
                        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                          Không có dữ liệu cho ngày này.
                        </div>
                      )
                    )}
                  </div>
                )}
              </BaseCard>
            </div>
          )}

          {activeTab === "performance" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <BaseCard>
                <h3 className={styles.infoSectionTitle}>Lịch sử hoạt động</h3>
                {isEditing && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      color: "#dc2626",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <AlertCircle
                      size={14}
                      style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "4px" }}
                    />
                    Lịch sử hệ thống (Audit logs) không thể được chỉnh sửa để đảm bảo tính minh bạch.
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {staff.activities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.75rem",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", minWidth: "120px" }}>
                        {act.date}
                      </div>
                      <div style={{ flex: 1, fontSize: "0.95rem", color: "var(--text-main)" }}>{act.description}</div>
                      <div>
                        {act.type === "system" && (
                          <span
                            style={{
                              backgroundColor: "#f3f4f6",
                              color: "#4b5563",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                            }}
                          >
                            Hệ thống
                          </span>
                        )}
                        {act.type === "audit" && (
                          <span
                            style={{
                              backgroundColor: "#e0e7ff",
                              color: "#4f46e5",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                            }}
                          >
                            Hồ sơ
                          </span>
                        )}
                        {act.type === "performance" && (
                          <span
                            style={{
                              backgroundColor: "#fef9c3",
                              color: "#ca8a04",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                            }}
                          >
                            Thành tích
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </BaseCard>
            </div>
          )}

          {activeTab === "timekeeping" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <BaseCard>
                <h3 className={styles.infoSectionTitle}>Lịch sử quẹt thẻ (Check-in/out)</h3>

                {isEditing && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      color: "#dc2626",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <AlertCircle
                      size={14}
                      style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "4px" }}
                    />
                    Dữ liệu chấm công từ máy quẹt thẻ. Chỉ có thể chỉnh sửa trạng thái bởi Quản trị viên nhân sự.
                  </div>
                )}

                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid var(--border-light)",
                    }}
                  >
                    <div>Ngày</div>
                    <div>Check In</div>
                    <div>Check Out</div>
                    <div>Trạng thái</div>
                  </div>

                  {staff.timeLogs &&
                    staff.timeLogs.map((log) => (
                      <div
                        key={log.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          alignItems: "center",
                          padding: "0.75rem 0",
                          borderBottom: "1px solid var(--border)",
                          fontSize: "0.95rem",
                        }}
                      >
                        <div style={{ color: "var(--text-main)", fontWeight: 500 }}>{log.date}</div>

                        <div style={{ color: log.checkIn === "--:--" ? "var(--text-muted)" : "var(--text-main)" }}>
                          {isEditing && log.status !== "missing" ? (
                            <BaseInput type="time" defaultValue={log.checkIn} />
                          ) : (
                            log.checkIn
                          )}
                        </div>

                        <div style={{ color: log.checkOut === "--:--" ? "var(--text-muted)" : "var(--text-main)" }}>
                          {isEditing && log.status !== "missing" ? (
                            <BaseInput type="time" defaultValue={log.checkOut} />
                          ) : (
                            log.checkOut
                          )}
                        </div>

                        <div>
                          {isEditing ? (
                            <select
                              defaultValue={log.status}
                              style={{
                                padding: "4px",
                                fontSize: "0.85rem",
                                borderRadius: "4px",
                                border: "1px solid var(--border)",
                              }}
                            >
                              <option value="on_time">Đúng giờ</option>
                              <option value="late">Đi muộn</option>
                              <option value="early">Về sớm</option>
                              <option value="overtime">Tăng ca</option>
                              <option value="missing">Vắng mặt</option>
                            </select>
                          ) : (
                            <>
                              {log.status === "on_time" && (
                                <span
                                  style={{
                                    backgroundColor: "#dcfce7",
                                    color: "#16a34a",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  Đúng giờ
                                </span>
                              )}
                              {log.status === "late" && (
                                <span
                                  style={{
                                    backgroundColor: "#ffedd5",
                                    color: "#ea580c",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  Đi muộn
                                </span>
                              )}
                              {log.status === "early" && (
                                <span
                                  style={{
                                    backgroundColor: "#fef08a",
                                    color: "#854d0e",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  Về sớm
                                </span>
                              )}
                              {log.status === "overtime" && (
                                <span
                                  style={{
                                    backgroundColor: "#e0e7ff",
                                    color: "#4f46e5",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  Tăng ca
                                </span>
                              )}
                              {log.status === "missing" && (
                                <span
                                  style={{
                                    backgroundColor: "#fee2e2",
                                    color: "#dc2626",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  Vắng mặt
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                  {(!staff.timeLogs || staff.timeLogs.length === 0) && (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                      Không có dữ liệu chấm công.
                    </div>
                  )}
                </div>
              </BaseCard>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Preview Modal */}
      {isPreviewAvatarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            overflow: "auto",
            display: "grid",
            placeItems: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
          onClick={() => setIsPreviewAvatarOpen(false)}
        >
          <img
            src={staff.avatar}
            alt={staff.name}
            style={{
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "4px solid rgba(255,255,255,0.1)",
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
          <button
            onClick={() => setIsPreviewAvatarOpen(false)}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              padding: "0.5rem",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={24} />
          </button>
        </div>
      )}
      {/* Header Edit Modal */}
      <BaseModal
        isOpen={isHeaderModalOpen}
        onClose={closeHeaderModal}
        title="Chỉnh sửa thông tin cơ bản"
        confirmText={t("common.save")}
        onConfirm={() => {
          setStaff({ ...staff, ...headerFormData } as Staff);
          closeHeaderModal();
        }}
        isDirty={isHeaderDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
          <label style={{ position: "relative", cursor: "pointer", display: "inline-block" }} title="Nhấn để đổi ảnh đại diện">
            <img 
              src={headerFormData.avatar || staff.avatar} 
              alt="Avatar preview" 
              style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", border: "4px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} 
            />
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              background: "var(--primary)", color: "white",
              borderRadius: "50%", padding: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              border: "3px solid #ffffff"
            }}>
              <UserCircle size={18} />
            </div>
            <input 
              type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const fileUrl = URL.createObjectURL(e.target.files[0]);
                  setHeaderFormData({ ...headerFormData, avatar: fileUrl });
                  setIsHeaderDirty(true);
                }
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput 
            label="Họ và tên"
            defaultValue={headerFormData.name || ""} 
            onChange={(e: any) => { setHeaderFormData({ ...headerFormData, name: e.target.value }); setIsHeaderDirty(true); }}
          />
          <BaseSelect 
            label="Phòng ban"
            defaultValue={headerFormData.department || ""}
            options={departmentsMock.map((d) => ({ label: d.label, value: d.label }))}
            onChange={(val) => { setHeaderFormData({ ...headerFormData, department: val }); setIsHeaderDirty(true); }}
          />
          <BaseSelect 
            label="Chức vụ"
            defaultValue={headerFormData.position || ""}
            options={positionsMock.map((p) => ({ label: p.label, value: p.label }))}
            onChange={(val) => { setHeaderFormData({ ...headerFormData, position: val }); setIsHeaderDirty(true); }}
          />
          <BaseSelect 
            label="Trạng thái công việc"
            defaultValue={headerFormData.status || "active"}
            options={[
              { label: "Đang làm việc", value: "active" },
              { label: "Nghỉ thai sản", value: "on_leave" },
              { label: "Đã nghỉ việc", value: "resigned" }
            ]}
            onChange={(val) => { setHeaderFormData({ ...headerFormData, status: val as any }); setIsHeaderDirty(true); }}
          />
        </div>
      </BaseModal>

      {/* Identity Modal */}
      <BaseModal
        isOpen={isIdentityModalOpen}
        onClose={closeIdentityModal}
        title="Định danh & Giấy tờ"
        confirmText={t("common.save")}
        onConfirm={closeIdentityModal}
        isDirty={isIdentityDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput label="Ngày sinh" type="date" defaultValue={staff.dob} onChange={() => setIsIdentityDirty(true)} />
          <BaseInput label="CCCD/Hộ chiếu" type="text" defaultValue={staff.cccd} onChange={() => setIsIdentityDirty(true)} />
          <BaseInput label="Ngày cấp" type="date" defaultValue="2020-08-15" onChange={() => setIsIdentityDirty(true)} />
          <BaseInput label="Nơi cấp" type="text" defaultValue="Cục CS QLHC về TTXH" onChange={() => setIsIdentityDirty(true)} />
        </div>
      </BaseModal>

      {/* Contact Modal */}
      <BaseModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        title="Liên lạc & Gia cảnh"
        confirmText={t("common.save")}
        onConfirm={closeContactModal}
        isDirty={isContactDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput label="Điện thoại" type="text" defaultValue="0988.xxx.xxx" onChange={() => setIsContactDirty(true)} />
          <BaseInput label="Email cá nhân" type="email" defaultValue={staff.email} onChange={() => setIsContactDirty(true)} />
          <BaseInput label="Thường trú" type="text" defaultValue="Quận Đống Đa, Hà Nội" onChange={() => setIsContactDirty(true)} />
          <BaseInput label="Người phụ thuộc (người)" type="number" defaultValue={2} onChange={() => setIsContactDirty(true)} />
        </div>
      </BaseModal>

      {/* Emergency Modal */}
      <BaseModal
        isOpen={isEmergencyModalOpen}
        onClose={closeEmergencyModal}
        title="Liên hệ khẩn cấp"
        confirmText={t("common.save")}
        onConfirm={closeEmergencyModal}
        isDirty={isEmergencyDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput label="Họ tên người liên hệ" type="text" defaultValue="Nguyễn Văn X" onChange={() => setIsEmergencyDirty(true)} />
          <BaseInput label="Quan hệ" type="text" defaultValue="Chồng" onChange={() => setIsEmergencyDirty(true)} />
          <BaseInput label="Số điện thoại" type="text" defaultValue="09xx.xxx.xxx" onChange={() => setIsEmergencyDirty(true)} />
        </div>
      </BaseModal>
    </div>
  );
};

export default StaffDetail;
