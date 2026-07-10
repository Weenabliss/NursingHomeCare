import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, AlertCircle, Clock } from "lucide-react";
import { BaseButton } from "../../components/atoms/BaseButton";
import { BaseSelect } from "../../components/atoms/BaseSelect";
import { PageHeader } from "../../components/molecules/PageHeader";
import { Toolbar } from "../../components/molecules/Toolbar";
import { BasePagination } from "../../components/atoms/BasePagination";
import { useLayout } from "../../contexts/LayoutContext";
import { staffListMock, departmentsMock, positionsMock } from "../../mock/staff";

// Components
import { StaffGrid } from "./components/StaffGrid";
import { AddStaffModal } from "./modals/AddStaffModal";

import styles from "./StaffList.module.scss";

const StaffList: React.FC = () => {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

      {/* Grid of Staff */}
      <StaffGrid currentStaff={currentStaff} />

      {/* Add Employee Modal */}
      <AddStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default StaffList;
