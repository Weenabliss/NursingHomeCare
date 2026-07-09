import React from "react";
import { useLayout } from "../../contexts/LayoutContext";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  const { footerContent } = useLayout();
  return (
    <footer className={styles.footer}>
      {footerContent || (
        <div className={styles.content}>
          &copy; {new Date().getFullYear()} Weenabliss Nursing Home Care. All rights reserved.
        </div>
      )}
    </footer>
  );
};
