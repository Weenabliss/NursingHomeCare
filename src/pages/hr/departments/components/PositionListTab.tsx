import React from "react";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Shield, Plus } from "lucide-react";
import { BaseCard } from "../../../../components/atoms/BaseCard";
import { BaseButton } from "../../../../components/atoms/BaseButton";

interface PositionListTabProps {
  positionsList: any[];
  editingPos: any;
  onOpenPosModal: (pos: any) => void;
}

export const PositionListTab: React.FC<PositionListTabProps> = ({
  positionsList,
  editingPos,
  onOpenPosModal,
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
      {positionsList.map((pos) => {
        const isSelected = editingPos?.id === pos.id;
        return (
          <BaseCard
            key={pos.id}
            isSelected={isSelected}
            onClick={() => onOpenPosModal(pos)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
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
                    {pos.autoRoles.map((role: string) => (
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
                        onOpenPosModal(pos);
                      }}
                    >
                      <Plus size={14} /> {t("common.add")}
                    </BaseButton>
                  </div>
                </div>
              </>
            )}
          </BaseCard>
        );
      })}
    </div>
  );
};
