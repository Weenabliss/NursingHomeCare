import React from "react";
import styles from "./BaseLoader.module.scss";

interface BaseLoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
  fullScreen?: boolean;
}

export const BaseLoader: React.FC<BaseLoaderProps> = ({
  size = "medium",
  color = "var(--primary)",
  className = "",
  fullScreen = false,
}) => {
  const loader = (
    <div
      className={`${styles.loader} ${styles[size]} ${className}`}
      style={{
        borderColor: `${color}40` /* 25% opacity */,
        borderTopColor: color,
      }}
    />
  );

  if (fullScreen) {
    return <div className={styles.fullscreen}>{loader}</div>;
  }

  return <>{loader}</>;
};
