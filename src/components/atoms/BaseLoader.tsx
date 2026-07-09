import React from "react";

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
  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return { width: "16px", height: "16px", borderWidth: "2px" };
      case "large":
        return { width: "48px", height: "48px", borderWidth: "4px" };
      case "medium":
      default:
        return { width: "32px", height: "32px", borderWidth: "3px" };
    }
  };

  const loader = (
    <div
      className={`base-loader ${className}`}
      style={{
        ...getSizeStyle(),
        borderStyle: "solid",
        borderColor: `${color}40` /* 25% opacity */,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(2px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
        {loader}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      {loader}
    </>
  );
};
