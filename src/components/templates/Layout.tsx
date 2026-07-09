import React, { useState } from "react";
import { Sidebar } from "../organisms/Sidebar";
import { Topbar } from "../organisms/Topbar";
import { Footer } from "../organisms/Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--background)",
      }}
    >
      <Topbar />
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <main
        style={{
          marginTop: "64px", // Space for Topbar
          marginLeft: isSidebarCollapsed ? "80px" : "280px", // Space for Sidebar
          padding: "var(--spacing-xl) var(--spacing-xl) 0 var(--spacing-xl)",
          flex: 1,
          transition: "margin-left 0.25s ease-in-out",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingBottom: 0, overflowY: "hidden" }}>
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
