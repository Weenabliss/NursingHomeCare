import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SCHEMAS } from "../../config/navigation";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { t } = useTranslation();

  // Find current schema based on URL
  const currentSchema = SCHEMAS.find((schema) => location.pathname.startsWith(schema.path)) || SCHEMAS[0];

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        width: isCollapsed ? "80px" : "280px",
        height: "calc(100vh - 64px)",
        position: "fixed",
        left: 0,
        top: "64px",
        borderRadius: 0, // override default card border radius for sidebar
        padding: "var(--spacing-md) 0",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
        transition: "width 0.3s ease",
      }}
    >
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingTop: "var(--spacing-md)",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            padding: isCollapsed ? "0 0.5rem" : "0 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {currentSchema.subMenus.map((menu) => (
            <li key={menu.path}>
              <NavLink
                to={menu.path}
                data-tooltip={isCollapsed ? t(menu.label) : undefined}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                style={{
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  padding: isCollapsed ? "0.75rem" : "0.75rem 1rem",
                }}
              >
                {menu.icon && <menu.icon size={20} style={{ flexShrink: 0 }} />}
                {!isCollapsed && (
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(menu.label)}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: isCollapsed ? "center" : "flex-end",
        }}
      >
        <button
          onClick={onToggle}
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
          }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
};
