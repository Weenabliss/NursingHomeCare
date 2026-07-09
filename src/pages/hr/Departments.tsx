import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Network,
  BadgeCheck,
  LayoutGrid,
  Users,
  Shield,
  Upload,
  HeartPulse,
  Briefcase,
  Coffee,
  Building,
  UserCheck,
  Stethoscope,
  Activity,
  Pill,
  FileText,
  Phone,
  ShieldPlus,
  Bed,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import { BaseButton } from "../../components/atoms/BaseButton";
import { PageHeader } from "../../components/molecules/PageHeader";
import { BaseInput } from "../../components/atoms/BaseInput";
import { BaseSelect } from "../../components/atoms/BaseSelect";
import { BaseModal } from "../../components/atoms/BaseModal";
import { BaseTabs } from "../../components/atoms/BaseTabs";
import { BaseListCard } from "../../components/atoms/BaseListCard";

// Sample Icon Map
const iconMap: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid size={24} />,
  HeartPulse: <HeartPulse size={24} />,
  Briefcase: <Briefcase size={24} />,
  Coffee: <Coffee size={24} />,
  Building: <Building size={24} />,
  Users: <Users size={24} />,
  Stethoscope: <Stethoscope size={24} />,
  Activity: <Activity size={24} />,
  Pill: <Pill size={24} />,
  FileText: <FileText size={24} />,
  Phone: <Phone size={24} />,
  ShieldPlus: <ShieldPlus size={24} />,
  Bed: <Bed size={24} />,
};

const mockStaffList = [
  { id: "S01", name: "Trần Anh Tuấn", gender: "Nam", dob: "1980", age: 44, avatar: "https://i.pravatar.cc/150?u=S01" },
  { id: "S02", name: "Lê Hoàng Yến", gender: "Nữ", dob: "1985", age: 39, avatar: "https://i.pravatar.cc/150?u=S02" },
  {
    id: "S03",
    name: "BS. Nguyễn Văn A",
    gender: "Nam",
    dob: "1975",
    age: 49,
    avatar: "https://i.pravatar.cc/150?u=S03",
  },
  { id: "S04", name: "ĐD. Trần Thị Bé", gender: "Nữ", dob: "1992", age: 32, avatar: "https://i.pravatar.cc/150?u=S04" },
  { id: "S05", name: "Nguyễn Văn B", gender: "Nam", dob: "1990", age: 34, avatar: "https://i.pravatar.cc/150?u=S05" },
];

const StaffComboBox: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = mockStaffList.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedStaff = mockStaffList.find((s) => s.name === value);

  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--text-main)",
          marginBottom: "0.5rem",
          display: "block",
        }}
      >
        {t("hr.manager")}
      </label>

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          backgroundColor: "var(--surface)",
          cursor: "pointer",
          height: "42px",
        }}
      >
        <span style={{ color: selectedStaff ? "var(--text-main)" : "var(--text-muted)" }}>
          {selectedStaff ? `${selectedStaff.id} - ${selectedStaff.name}` : t("hr.selectManager")}
        </span>
        <ChevronDown size={16} color="var(--text-muted)" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 100,
            maxHeight: "350px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              padding: "0.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              autoFocus
              placeholder={t("hr.searchStaff")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", boxShadow: "none", width: "100%", fontSize: "0.9rem" }}
            />
          </div>

          {/* List */}
          <div
            style={{ overflowY: "auto", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {filtered.map((staff) => {
              const isSelected = value === staff.name;
              return (
                <div
                  key={staff.id}
                  onClick={() => {
                    onChange(staff.name);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#e0e7ff" : "transparent",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "#eef2ff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: isSelected ? "var(--primary-dark)" : "var(--text-main)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {staff.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          backgroundColor: "var(--surface-alt)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {staff.id}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {staff.gender} • {staff.age} tuổi (SN: {staff.dob})
                    </span>
                  </div>
                  {isSelected && <Check size={18} color="var(--primary)" />}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {t("hr.noStaffFound")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Departments: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("departments");
  const [isAddPosModalOpen, setIsAddPosModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<any>(null);

  // New States for Dept
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null); // null means Add, otherwise Edit

  // Mock data for Org Chart with more details
  const [departmentsList] = useState([
    {
      id: "BGĐ",
      name: "Ban Giám đốc",
      parent: null,
      headCount: 3,
      manager: "Trần Anh Tuấn",
      icon: "Building",
      description: "Điều hành chung toàn bộ trung tâm",
      autoRoles: ["VIEW_ALL_REPORTS"],
    },
    {
      id: "HCTH",
      name: "Hành chính Tổng hợp",
      parent: "BGĐ",
      headCount: 5,
      manager: "Lê Hoàng Yến",
      icon: "Briefcase",
      description: "Nhân sự, kế toán, văn thư lưu trữ",
      autoRoles: ["VIEW_HR_DASHBOARD"],
    },
    {
      id: "YTSC",
      name: "Khoa Y tế & Chăm sóc",
      parent: "BGĐ",
      headCount: 25,
      manager: "BS. Nguyễn Văn A",
      icon: "HeartPulse",
      description: "Khám chữa bệnh và cấp phát thuốc",
      autoRoles: ["VIEW_MEDICAL_RECORDS"],
    },
    {
      id: "ĐDNT",
      name: "Tổ Điều dưỡng Nội trú",
      parent: "YTSC",
      headCount: 15,
      manager: "ĐD. Trần Thị Bé",
      icon: "Coffee",
      description: "Chăm sóc sinh hoạt 24/7 cho người cao tuổi",
      autoRoles: ["VIEW_SHIFT_SCHEDULE"],
    },
  ]);

  // Mock data for Positions and Auto-Mapping (RBAC) Template
  const positionsList = [
    {
      id: "DIR_01",
      title: "Giám đốc Điều hành",
      department: "Ban Giám đốc",
      autoRoles: ["SUPER_ADMIN", "FINANCE_APPROVER"],
    },
    {
      id: "HR_01",
      title: "Trưởng phòng Hành chính",
      department: "Hành chính Tổng hợp",
      autoRoles: ["HR_MANAGER", "PAYROLL_VIEWER"],
    },
    {
      id: "MED_01",
      title: "Bác Sĩ Trưởng Khoa",
      department: "Khoa Y tế & Chăm sóc",
      autoRoles: ["MEDICAL_LEAD", "PRESCRIPTION_WRITE", "ROSTER_MANAGER"],
    },
    {
      id: "NUR_01",
      title: "Điều Dưỡng Viên",
      department: "Tổ Điều dưỡng Nội trú",
      autoRoles: ["NURSE_BASIC", "VITAL_SIGNS_INPUT"],
    },
  ];

  const handleOpenDeptModal = (dept: any = null) => {
    setEditingDept(dept);
    setIsDeptModalOpen(true);
  };

  const handleCloseDeptModal = () => {
    setEditingDept(null);
    setIsDeptModalOpen(false);
  };

  const handleSaveDept = () => {
    // Save logic mock
    handleCloseDeptModal();
  };

  const handleDeleteDept = () => {
    // Delete logic mock
    handleCloseDeptModal();
  };

  const handleAddPos = () => {
    // Save logic mock
    handleClosePosModal();
  };

  const handleClosePosModal = () => {
    setEditingPos(null);
    setIsAddPosModalOpen(false);
  };

  const renderDeptTree = (parentId: string | null = null, depth: number = 0) => {
    const children = departmentsList.filter((d) => d.parent === parentId);
    if (children.length === 0) return null;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-md)",
          marginTop: parentId ? "var(--spacing-md)" : "0",
        }}
      >
        {children.map((dept, index) => {
          const isSelected = editingDept?.id === dept.id;
          const isLast = index === children.length - 1;

          return (
            <div key={dept.id} style={{ display: "flex", position: "relative" }}>
              {/* Tree Connectors Container */}
              {parentId && (
                <div style={{ width: "40px", position: "relative", flexShrink: 0 }}>
                  {/* Horizontal line to this card (center of 104px card is ~52px) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "52px",
                      left: "20px",
                      right: "0",
                      height: "2px",
                      backgroundColor: "var(--border)",
                    }}
                  />

                  {/* Vertical continuous line */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-16px", // Connect to previous sibling or parent
                      bottom: isLast ? "auto" : "-16px", // Connect to next sibling if not last
                      height: isLast ? "70px" : "auto", // 52px + 16px gap + 2px thickness = 70px
                      left: "20px",
                      width: "2px",
                      backgroundColor: "var(--border)",
                      zIndex: 1,
                    }}
                  />
                </div>
              )}

              {/* The actual content (Card + its children) */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <BaseListCard
                  onClick={() => handleOpenDeptModal(dept)}
                  isSelected={isSelected}
                  style={{
                    zIndex: 2,
                    position: "relative",
                    padding: "1.25rem",
                  }}
                >
                  {({ isSelected }) => (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "var(--spacing-lg)",
                      }}
                    >
                      {/* 1. Icon & Name */}
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", flex: "1 1 250px" }}
                      >
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "14px",
                            backgroundColor: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.4)",
                          }}
                        >
                          {iconMap[dept.icon] || <LayoutGrid size={24} />}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: "1.15rem",
                              fontWeight: 700,
                              color: "var(--text-main)",
                              margin: "0 0 0.25rem 0",
                            }}
                          >
                            {dept.name}
                          </h3>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block" }}>
                            {dept.description}
                          </span>
                        </div>
                      </div>

                      {/* 2. Bento-Box Badges */}
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", flex: "2 1 auto" }}>
                        {/* Manager Badge */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem",
                            backgroundColor: isSelected ? "rgba(255,255,255,0.6)" : "var(--background)",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border)",
                            flex: "1 1 0%",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {t("hr.manager")}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <UserCheck size={16} color="var(--primary)" />
                            <span style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 600 }}>
                              {dept.manager}
                            </span>
                          </div>
                        </div>

                        {/* Headcount Badge */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem",
                            backgroundColor: isSelected ? "rgba(255,255,255,0.6)" : "var(--background)",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border)",
                            flex: "1 1 0%",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {t("hr.headcount")}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Users size={16} color="var(--text-muted)" />
                            <span style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 600 }}>
                              {dept.headCount} người
                            </span>
                          </div>
                        </div>

                        {/* Parent Badge */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem",
                            backgroundColor: isSelected ? "rgba(255,255,255,0.6)" : "var(--background)",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border)",
                            flex: "1 1 0%",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {t("hr.directParent")}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Network size={16} color="var(--text-muted)" />
                            <span
                              style={{
                                fontSize: "0.9rem",
                                color: dept.parent ? "var(--text-main)" : "var(--text-muted)",
                                fontWeight: 600,
                              }}
                            >
                              {dept.parent
                                ? departmentsList.find((d) => d.id === dept.parent)?.name || dept.parent
                                : t("hr.rootDept")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </BaseListCard>

                {/* Render children */}
                {renderDeptTree(dept.id, depth + 1)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flexShrink: 0 }}>
        <PageHeader
          title={t("hr.orgChartTitle")}
          subtitle={t("hr.orgChartDesc")}
          actions={
            activeTab === "departments" ? (
              <BaseButton onClick={() => handleOpenDeptModal(null)}>
                <Plus size={18} /> {t("hr.addDepartment")}
              </BaseButton>
            ) : (
              <BaseButton
                onClick={() => {
                  setEditingPos(null);
                  setIsAddPosModalOpen(true);
                }}
              >
                <Plus size={18} /> {t("hr.addPosition")}
              </BaseButton>
            )
          }
        />

        {/* Tabs */}
        <BaseTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "departments", label: "Sơ đồ Phòng Ban", icon: Network },
            { value: "positions", label: "Cấu hình Chức Vụ & Quyền", icon: BadgeCheck },
          ]}
        />
      </div>

      {/* Card List Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem 0.5rem 1rem 0.5rem",
        }}
      >
        {activeTab === "departments" && renderDeptTree(null, 0)}

        {activeTab === "positions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            {positionsList.map((pos) => {
              const isSelected = editingPos?.id === pos.id;
              return (
                <BaseListCard
                  key={pos.id}
                  isSelected={isSelected}
                  onClick={() => {
                    setEditingPos(pos);
                    setIsAddPosModalOpen(true);
                  }}
                >
                  {({ isHovered, isSelected }) => (
                    <>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", flex: "1 1 200px" }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: isHovered ? "var(--primary-light)" : "#fef2f2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isHovered ? "#ffffff" : "#b91c1c",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <BadgeCheck size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
                            {pos.title}
                          </h3>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            {pos.id} • {pos.department}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          flex: "2 1 300px",
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "0.5rem",
                          backgroundColor: isSelected ? "rgba(255,255,255,0.6)" : isHovered ? "#ffffff" : "#f8fafc",
                          borderRadius: "var(--radius-md)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingRight: "1rem",
                            borderRight: "1px solid #cbd5e1",
                          }}
                        >
                          <Shield size={20} color="#0f172a" />
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, marginTop: "4px" }}>
                            {t("hr.rbacMapping")}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          {pos.autoRoles.map((role) => (
                            <span
                              key={role}
                              style={{
                                fontSize: "0.75rem",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                backgroundColor: "#1e293b",
                                color: "#f8fafc",
                                fontWeight: 500,
                              }}
                            >
                              {role}
                            </span>
                          ))}
                          <BaseButton
                            variant="outline"
                            size="sm"
                            style={{ padding: "0 8px", height: "24px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPos(pos);
                              setIsAddPosModalOpen(true);
                            }}
                          >
                            <Plus size={14} /> {t("hr.addRole")}
                          </BaseButton>
                        </div>
                      </div>
                    </>
                  )}
                </BaseListCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Dept Modal */}
      <BaseModal
        isOpen={isDeptModalOpen}
        onClose={handleCloseDeptModal}
        title={editingDept ? t("hr.editDept") : t("hr.newDept")}
        onConfirm={handleSaveDept}
        footerLeftContent={
          editingDept ? (
            <BaseButton variant="danger" onClick={handleDeleteDept}>
              {t("hr.deleteDept")}
            </BaseButton>
          ) : null
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 120px" }}>
              <BaseInput label={t("hr.deptCode")} placeholder="VD: HCTH" defaultValue={editingDept?.id} />
            </div>
            <div style={{ flex: "2 1 200px" }}>
              <BaseInput
                label={t("hr.deptName")}
                placeholder="VD: Hành chính tổng hợp"
                defaultValue={editingDept?.name}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--text-main)",
                  marginBottom: "0.5rem",
                }}
              >
                {t("hr.selectIcon")}
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {Object.keys(iconMap).map((iconKey) => {
                  const isSelected = (editingDept?.icon || "LayoutGrid") === iconKey;
                  return (
                    <button
                      key={iconKey}
                      onClick={() => setEditingDept({ ...editingDept, icon: iconKey })}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isSelected ? "var(--primary)" : "var(--background-alt)",
                        color: isSelected ? "#ffffff" : "var(--text-muted)",
                        transition: "all 0.2s ease",
                      }}
                      title={iconKey}
                    >
                      {iconMap[iconKey]}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--text-main)",
                  marginBottom: "0.5rem",
                }}
              >
                {t("hr.uploadImage")}
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.5rem",
                  border: "1px dashed var(--border)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  backgroundColor: "var(--background-alt)",
                  color: "var(--text-muted)",
                  height: "44px",
                }}
              >
                <Upload size={16} /> Tải ảnh icon từ máy tính
                <input type="file" style={{ display: "none" }} accept="image/*" />
              </label>
            </div>
          </div>

          <BaseSelect
            label="Trực thuộc (Phòng ban cha)"
            options={[
              { label: "-- Đơn vị cao nhất (Root) --", value: "none" },
              ...departmentsList
                .filter((d) => d.id !== editingDept?.id)
                .map((d) => ({
                  label: d.name,
                  value: d.id,
                })),
            ]}
            defaultValue={editingDept?.parent || "none"}
          />

          <StaffComboBox
            value={editingDept?.manager || ""}
            onChange={(val) => setEditingDept({ ...editingDept, manager: val })}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-main)", marginBottom: "0.5rem" }}
            >
              Mô tả chức năng
            </label>
            <textarea
              rows={3}
              defaultValue={editingDept?.description}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontFamily: "inherit",
                resize: "none",
              }}
              placeholder="Mô tả tóm tắt vai trò của phòng ban..."
            ></textarea>
          </div>

          <div
            style={{
              backgroundColor: "var(--background-alt)",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--border)",
            }}
          >
            <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>
              {t("hr.rbacMapping")} cấp Phòng ban (Tự động gán quyền)
            </h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1rem 0" }}>
              Bất kỳ nhân sự nào thuộc phòng ban này sẽ tự động nhận được các Role bên dưới (kết hợp với các Role từ
              chức vụ của họ).
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
                minHeight: "32px",
                alignItems: "center",
              }}
            >
              {(editingDept?.autoRoles || []).map((role: string) => (
                <span
                  key={role}
                  style={{
                    fontSize: "0.75rem",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    backgroundColor: "#1e293b",
                    color: "#f8fafc",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {role}
                  <span style={{ cursor: "pointer", opacity: 0.7, paddingLeft: "4px" }}>&times;</span>
                </span>
              ))}
              {(!editingDept?.autoRoles || editingDept.autoRoles.length === 0) && (
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Chưa có Role nào được gán cho toàn bộ phòng ban
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ flex: 1 }}>
                <BaseSelect
                  options={[
                    { label: "XEM BỆNH ÁN KHOA", value: "r1" },
                    { label: "QUẢN LÝ TÀI SẢN PHÒNG", value: "r2" },
                    { label: "XEM LỊCH TRỰC", value: "r3" },
                  ]}
                />
              </div>
              <BaseButton variant="outline" style={{ flex: "0 0 auto" }}>
                <Plus size={18} /> Thêm Role
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Position Modal */}
      <BaseModal
        isOpen={isAddPosModalOpen}
        onClose={handleClosePosModal}
        title={editingPos ? "Sửa Chức vụ & Phân quyền" : "Thêm Chức vụ & Phân quyền"}
        onConfirm={handleAddPos}
        footerLeftContent={
          editingPos ? (
            <BaseButton variant="danger" onClick={handleClosePosModal}>
              {t("hr.delete")}
            </BaseButton>
          ) : null
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 120px" }}>
              <BaseInput label="Mã chức vụ" placeholder="VD: BS" defaultValue={editingPos?.id} />
            </div>
            <div style={{ flex: "2 1 200px" }}>
              <BaseInput
                label={t("hr.positionTitle")}
                placeholder="VD: Bác sĩ điều trị"
                defaultValue={editingPos?.title}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 250px" }}>
              <BaseSelect
                label="Thuộc Khối/Phòng/Khoa"
                options={departmentsList.map((d) => ({
                  label: d.name,
                  value: d.id,
                }))}
              />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <BaseInput label="Hệ số lương cơ bản" placeholder="VD: 1.5" type="number" />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--background-alt)",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--border)",
            }}
          >
            <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>
              {t("hr.rbacMapping")} (Tự động gán quyền)
            </h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1rem 0" }}>
              Khi bổ nhiệm 1 nhân sự vào chức vụ này, hệ thống sẽ tự động bơm các Role (Quyền) bên dưới vào tài khoản
              của nhân sự đó.
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
                minHeight: "32px",
                alignItems: "center",
              }}
            >
              {(editingPos?.autoRoles || []).map((role: string) => (
                <span
                  key={role}
                  style={{
                    fontSize: "0.75rem",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    backgroundColor: "#1e293b",
                    color: "#f8fafc",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {role}
                  <span style={{ cursor: "pointer", opacity: 0.7, paddingLeft: "4px" }}>&times;</span>
                </span>
              ))}
              {(!editingPos?.autoRoles || editingPos.autoRoles.length === 0) && (
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Chưa có Role nào được gán
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ flex: 1 }}>
                <BaseSelect
                  options={[
                    { label: "KẾ TOÁN", value: "r1" },
                    { label: "NHÂN SỰ", value: "r2" },
                    { label: "BÁC SĨ TỔNG QUÁT", value: "r3" },
                    { label: "QUẢN LÝ THUỐC", value: "r4" },
                  ]}
                />
              </div>
              <BaseButton variant="outline" style={{ flex: "0 0 auto" }}>
                <Plus size={18} /> Thêm Role
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default Departments;
