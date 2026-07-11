import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserCircle, Moon, Sun, Languages, HeartHandshake } from "lucide-react";
import { SCHEMAS } from "../../config/navigation";
import { useTranslation } from "react-i18next";
import styles from "./Topbar.module.scss";

export const Topbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(!isDark);
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <HeartHandshake size={32} strokeWidth={2.5} className={styles.logoIcon} />
        <span className={styles.logoText}>HomeCare</span>
      </div>

      {/* Schemas Menu */}
      <nav className={`topbar-menu ${styles.nav}`}>
        {SCHEMAS.map((schema) => {
          const isActive = location.pathname.startsWith(schema.path);
          return (
            <NavLink
              key={schema.id}
              to={schema.subMenus[0]?.path || schema.path}
              className={`topbar-link ${isActive ? "active" : ""}`}
            >
              <schema.icon size={18} />
              {t(schema.label)}
            </NavLink>
          );
        })}
      </nav>

      {/* Utilities */}
      <div className={styles.utilities}>
        <button onClick={toggleLanguage} className={styles.iconButton} title={t("common.switchLanguage")}>
          <Languages size={20} />
          <span style={{ fontSize: "0.8rem", fontWeight: "bold", marginLeft: "4px" }}>
            {i18n.language.toUpperCase()}
          </span>
        </button>

        <button onClick={toggleTheme} className={styles.iconButton} title={isDark ? "Light Mode" : "Dark Mode"}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserCircle size={20} className={styles.userIcon} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin</span>
            <span className={styles.userRole}>Quản trị hệ thống</span>
          </div>
        </div>
      </div>
    </header>
  );
};
