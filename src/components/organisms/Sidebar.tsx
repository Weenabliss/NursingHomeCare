import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SCHEMAS } from "../../config/navigation";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Sidebar.module.scss";

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
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
      <nav className={styles.nav}>
        <ul className={`${styles.ul} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
          {currentSchema.subMenus.map((menu) => (
            <li key={menu.path}>
              <NavLink
                to={menu.path}
                data-tooltip={isCollapsed ? t(menu.label) : undefined}
                className={({ isActive }) =>
                  `sidebar-link ${styles.link} ${isCollapsed ? styles.collapsed : styles.expanded} ${isActive ? "active" : ""}`
                }
              >
                {menu.icon && <menu.icon size={20} className={styles.icon} />}
                {!isCollapsed && <span className={styles.label}>{t(menu.label)}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`${styles.footer} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
        <button onClick={onToggle} className={styles.toggleButton}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
};
