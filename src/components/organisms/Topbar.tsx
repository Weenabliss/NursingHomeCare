import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserCircle, Moon, Sun, Languages } from "lucide-react";
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
        {/* Custom SVG Logo Mark */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.logoIcon}
        >
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="crossGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.85" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer rounded square background */}
          <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#logoGradient)" />

          {/* Subtle inner highlight */}
          <rect x="2" y="2" width="36" height="18" rx="10" fill="white" fillOpacity="0.08" />

          {/* Medical cross */}
          <rect x="17" y="8" width="6" height="24" rx="3" fill="url(#crossGradient)" />
          <rect x="8" y="17" width="24" height="6" rx="3" fill="url(#crossGradient)" />

          {/* Small heart at center of cross */}
          <path
            d="M20 23.5c0 0-5-3.2-5-6.2a3 3 0 0 1 5-2.2 3 3 0 0 1 5 2.2c0 3-5 6.2-5 6.2z"
            fill="#6366f1"
            fillOpacity="0.6"
          />

          {/* Corner accent dots */}
          <circle cx="8" cy="8" r="1.5" fill="white" fillOpacity="0.3" />
          <circle cx="32" cy="32" r="1.5" fill="white" fillOpacity="0.3" />
        </svg>

        {/* Logo Text */}
        <div className={styles.logoTextGroup}>
          <span className={styles.logoText}>
            <span className={styles.logoTextHome}>Home</span>
            <span className={styles.logoTextCare}>Care</span>
          </span>
          <span className={styles.logoSubtext}>Nursing Management</span>
        </div>
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
