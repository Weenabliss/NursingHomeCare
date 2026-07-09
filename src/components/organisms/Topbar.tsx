import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserCircle, Moon, Sun, Languages } from "lucide-react";
import { SCHEMAS } from "../../config/navigation";
import { useTranslation } from "react-i18next";

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
    <header
      style={{
        height: "64px",
        background: "linear-gradient(90deg, var(--surface) 0%, var(--background) 100%)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--spacing-xl)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginRight: "var(--spacing-xl)",
          cursor: "pointer",
        }}
      >
        <img
          src="/logo.png"
          alt="HomeCare"
          style={{
            width: "56px",
            height: "56px",
            objectFit: "contain",
            borderRadius: "100px",
            boxShadow: "var(--shadow-sm)",
          }}
        />
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          HomeCare
        </span>
      </div>

      {/* Schemas Menu */}
      <nav className="topbar-menu" style={{ flex: 1, justifyContent: "center" }}>
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-lg)",
          marginLeft: "var(--spacing-xl)",
        }}
      >
        <button
          onClick={toggleLanguage}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            color: "var(--text-muted)",
          }}
          title="Toggle Language"
        >
          <Languages size={20} />
          <span style={{ marginLeft: "4px", fontSize: "0.8rem", fontWeight: 600 }}>{i18n.language.toUpperCase()}</span>
        </button>
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            color: "var(--text-muted)",
          }}
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            cursor: "pointer",
          }}
        >
          <UserCircle size={32} color="var(--primary)" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Admin User</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t("common.admin")}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
