import React, { useState } from "react";
import { Sidebar } from "../organisms/Sidebar";
import { Topbar } from "../organisms/Topbar";
import { Footer } from "../organisms/Footer";
import styles from "./Layout.module.scss";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <Topbar />
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`${styles.main} ${isSidebarCollapsed ? styles.collapsed : styles.expanded}`}>
        <div className={styles.content}>{children}</div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
