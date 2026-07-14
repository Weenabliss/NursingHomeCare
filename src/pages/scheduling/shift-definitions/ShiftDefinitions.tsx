import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Plus } from "lucide-react";
import { useShifts } from "../../../contexts/ShiftContext";
import { BaseButton } from "../../../shared/components/BaseButton";
import { BaseBadge } from "../../../shared/components/BaseBadge";
import { isMainShift, isNightShift } from "../../../utils/shiftUtils";
import ShiftModal from "./modals/ShiftModal";
import styles from "./ShiftDefinitions.module.scss";

const ShiftDefinitions: React.FC = () => {
  const { t } = useTranslation();
  const { shifts } = useShifts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingShiftId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEditingShiftId(id);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h2 className={styles.pageTitle}>{t("scheduling.shiftDefinitions")}</h2>
        <BaseButton onClick={handleAdd}>
          <Plus size={16} /> Thêm ca mới
        </BaseButton>
      </div>

      <div className={styles.grid}>
        {shifts.map((shift) => (
          <div key={shift.id} className={styles.card} onClick={(e) => handleEdit(e, shift.id)}>
            <div className={styles.cardHeader}>
              <div className={styles.shiftName}>
                <div className={styles.colorIndicator} style={{ backgroundColor: shift.color }} />
                {shift.name}
              </div>
            </div>

            <div className={styles.badges}>
              {isMainShift(shift.startTime, shift.endTime) ? (
                <BaseBadge variant="success">Ca chính</BaseBadge>
              ) : (
                <BaseBadge variant="default">Ca phụ</BaseBadge>
              )}
              
              {isNightShift(shift.startTime, shift.endTime) ? (
                <BaseBadge variant="warning">Ca đêm</BaseBadge>
              ) : (
                <BaseBadge variant="info">Ca ngày</BaseBadge>
              )}
            </div>

            <div className={styles.shiftTime}>
              <Clock size={16} />
              <span className={styles.timeText}>
                {shift.startTime} - {shift.endTime}
              </span>
            </div>

            {shift.description && (
              <div className={styles.description}>{shift.description}</div>
            )}
          </div>
        ))}
      </div>

      <ShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shiftId={editingShiftId}
      />
    </div>
  );
};

export default ShiftDefinitions;
