import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { UserPlus, Clock, AlertTriangle, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BaseButton } from "../../shared/components/BaseButton";
import { BaseSelect } from "../../shared/components/BaseSelect";
import { PageHeader } from "../../shared/components/PageHeader";
import { BasePagination } from "../../shared/components/BasePagination";
import baseInputStyles from "../../shared/components/BaseInput.module.scss";
import { useLayout } from "../../contexts/LayoutContext";
import { usePagination } from "../../hooks/usePagination";
import { useStaffList, useDeleteStaff } from "../../modules/hr/hooks/useStaffQuery";
import { useActivityLog } from "../../shared/hooks/useActivityLog";
import { departmentsMockData, positionsMockData } from "../../mock/departments";

const departmentsMock = [{ label: "Tất cả Phòng ban", value: "all" }, ...departmentsMockData.map(d => ({ label: d.name, value: d.id }))];
const positionsMock = positionsMockData.map(p => ({ label: p.title, value: p.title }));

// Components
import { StaffGrid } from "./components/StaffGrid";

import styles from "./StaffList.module.scss";

// ─── Warning Toast ─────────────────────────────────────────────────────────────
interface CertWarningButtonProps {
  count: number;
  message: string;
}

const CertWarningButton: React.FC<CertWarningButtonProps> = ({ count, message }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastPos, setToastPos] = useState({ top: 0, right: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setToastPos({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    }
    setShowToast((prev) => !prev);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowToast(false), 5000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const toast = showToast
    ? ReactDOM.createPortal(
        <div
          style={{
            position: "fixed",
            top: toastPos.top,
            right: toastPos.right,
            width: "320px",
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            borderRadius: "10px",
            padding: "12px 14px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: 99999,
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
            animation: "fadeInDown 0.2s ease",
          }}
        >
          <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
          <span style={{ fontSize: "0.82rem", color: "#92400e", lineHeight: 1.5, flex: 1 }}>
            {message}
          </span>
          <button
            onClick={() => setShowToast(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#b45309", flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        ref={btnRef}
        onClick={handleClick}
        title="Xem cảnh báo chứng chỉ"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          background: showToast ? "#fef08a" : "#fef9c3",
          border: `1.5px solid ${showToast ? "#facc15" : "#fde047"}`,
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#fef08a";
          e.currentTarget.style.borderColor = "#facc15";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = showToast ? "#fef08a" : "#fef9c3";
          e.currentTarget.style.borderColor = showToast ? "#facc15" : "#fde047";
        }}
      >
        <AlertTriangle size={16} color="#ca8a04" />
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ca8a04" }}>
          {count}
        </span>
      </button>
      {toast}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const StaffList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { log } = useActivityLog({ module: "staff" });

  // ── Staff API ─────────────────────────────────────────────────────────────
  const { data: staffList = [], isLoading } = useStaffList();
  const { mutate: deleteStaff } = useDeleteStaff();

  // ── Filter / Search State ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");

  // ── Derived: Filtered List ──────────────────────────────────────────────────
  const filteredStaff = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return staffList.filter((s: any) => {
      const matchSearch =
        !searchQuery ||
        s.personal.fullName.toLowerCase().includes(lowerQuery) ||
        s.personal.code.toLowerCase().includes(lowerQuery) ||
        (s.personal.email && s.personal.email.toLowerCase().includes(lowerQuery)) ||
        (s.personal.phone && s.personal.phone.includes(searchQuery));

      const matchDept = filterDept === "all" || s.employment.departmentId === filterDept;
      const matchPosition = filterPosition === "all" || s.employment.jobTitle === filterPosition;

      return matchSearch && matchDept && matchPosition;
    });
  }, [staffList, searchQuery, filterDept, filterPosition]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const { currentPage, totalPages, itemsPerPage, setCurrentPage, paginate } = usePagination({
    totalItems: filteredStaff.length,
    itemsPerPage: 10,
  });

  const currentStaff = paginate(filteredStaff) as any;

  const { setFooterContent } = useLayout();
  useEffect(() => {
    setFooterContent(
      <BasePagination
        currentPage={currentPage}
        totalItems={filteredStaff.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        style={{ padding: "0 2rem" }}
      />
    );
    return () => setFooterContent(null);
  }, [currentPage, totalPages, itemsPerPage, setCurrentPage, setFooterContent, filteredStaff.length]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query) log("search", `Tìm kiếm nhân sự: "${query}"`, { query });
  };

  const handleFilterDept = (value: string) => {
    setFilterDept(value);
    setCurrentPage(1);
    log("filter", `Lọc theo phòng ban: ${value}`);
  };

  const handleFilterPosition = (value: string) => {
    setFilterPosition(value);
    setCurrentPage(1);
    log("filter", `Lọc theo chức vụ: ${value}`);
  };

  const handleDelete = (id: string) => {
    deleteStaff(id);
    log("delete", `Xóa nhân viên ID: ${id}`);
  };

  const handleAddNew = () => {
    log("open_modal", "Điều hướng tạo nhân viên mới");
    navigate("/hr/staff/new");
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  const certWarningCount = staffList.filter((s: any) => {
    if (s.employment.status === "resigned") return false;
    const cert = s.medicalCredentials?.practicingCert;
    if (cert && cert.expiryDate) {
      // Logic kiểm tra hết hạn (mock tạm)
      return new Date(cert.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    return false;
  }).length;
  const certWarningMessage = `Hệ thống phát hiện có ${certWarningCount} nhân viên sắp hết hạn Chứng chỉ hành nghề trong 30 ngày tới. Yêu cầu nộp bổ sung hồ sơ!`;

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
              <BaseButton onClick={handleAddNew}>
                <UserPlus size={18} />
                {t("common.add")}
              </BaseButton>
            </>
          }
        />

        {/* Premium Filter & Search Panel */}
        <div style={{ flexShrink: 0, paddingBottom: "0.5rem" }}>
          <div style={{
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            borderRadius: 14,
            padding: "1rem 1.25rem",
            boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.05), 0 2px 4px -1px rgba(99, 102, 241, 0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem"
          }}>
            {/* Inline Search & Filter Row */}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              
              {/* Search Input */}
              <div style={{ position: "relative", flex: "1 1 250px", minWidth: "200px" }}>
                <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="text" 
                  placeholder={t("hr.searchEmp")} 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={baseInputStyles.input}
                  style={{ paddingLeft: "2.5rem", width: "100%", height: "42px", margin: 0 }}
                />
              </div>

              {/* Filters */}
              <div style={{ flex: "1 1 200px", minWidth: "180px" }}>
                <BaseSelect
                  options={departmentsMock}
                  value={filterDept}
                  onChange={(e) => handleFilterDept(e.target.value)}
                  fullWidth
                  style={{ height: "42px", margin: 0 }}
                />
              </div>
              
              <div style={{ flex: "1 1 200px", minWidth: "180px" }}>
                <BaseSelect
                  options={[{ label: "Tất cả Chức vụ", value: "all" }, ...positionsMock]}
                  value={filterPosition}
                  onChange={(e) => handleFilterPosition(e.target.value)}
                  fullWidth
                  style={{ height: "42px", margin: 0 }}
                />
              </div>

              {/* Actions */}
              {certWarningCount > 0 && (
                <div style={{ flexShrink: 0 }}>
                  <CertWarningButton count={certWarningCount} message={certWarningMessage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải dữ liệu...</div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, padding: "0 0 0.75rem 0" }}>
          <StaffGrid currentStaff={currentStaff} onDeleteStaff={handleDelete} />
        </div>
      )}
    </div>
  );
};

export default StaffList;
