import React from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid, UserCheck, Network, Users } from "lucide-react";
import { BaseCard } from "../../../../components/atoms/BaseCard";
import { departmentIconMap } from "../../../../config/departmentIcons";

interface DepartmentTreeTabProps {
  departmentsList: any[];
  editingDept: any;
  onOpenDeptModal: (dept: any) => void;
}

export const DepartmentTreeTab: React.FC<DepartmentTreeTabProps> = ({
  departmentsList,
  editingDept,
  onOpenDeptModal,
}) => {
  const { t } = useTranslation();

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
              {/* Tree Connectors */}
              {parentId && (
                <div style={{ width: "40px", position: "relative", flexShrink: 0 }}>
                  {/* Horizontal line */}
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
                  {/* Vertical line */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-16px",
                      bottom: isLast ? "auto" : "-16px",
                      height: isLast ? "70px" : "auto",
                      left: "20px",
                      width: "2px",
                      backgroundColor: "var(--border)",
                      zIndex: 1,
                    }}
                  />
                </div>
              )}

              {/* Card + its children */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <BaseCard
                  onClick={() => onOpenDeptModal(dept)}
                  isSelected={isSelected}
                  style={{
                    zIndex: 2,
                    position: "relative",
                    padding: "1.25rem",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
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
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", flex: "1 1 250px" }}>
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
                          {/* Uses shared iconMap from config — no more duplication */}
                          {departmentIconMap[dept.icon] || <LayoutGrid size={24} />}
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
                        {[
                          {
                            label: t("hr.manager"),
                            icon: <UserCheck size={16} color="var(--primary)" />,
                            value: dept.manager,
                          },
                          {
                            label: t("hr.headcount"),
                            icon: <Users size={16} color="var(--text-muted)" />,
                            value: `${dept.headCount} người`,
                          },
                          {
                            label: t("hr.directParent"),
                            icon: <Network size={16} color="var(--text-muted)" />,
                            value: dept.parent
                              ? departmentsList.find((d) => d.id === dept.parent)?.name || dept.parent
                              : t("hr.rootDept"),
                          },
                        ].map(({ label, icon, value }) => (
                          <div
                            key={label}
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
                              {label}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              {icon}
                              <span
                                style={{
                                  fontSize: "0.9rem",
                                  color: "var(--text-main)",
                                  fontWeight: 600,
                                }}
                              >
                                {value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </BaseCard>

                {/* Render children recursively */}
                {renderDeptTree(dept.id, depth + 1)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return renderDeptTree(null, 0);
};
