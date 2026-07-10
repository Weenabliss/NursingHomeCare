import React from "react";

interface BaseTimelineProps {
  children: React.ReactNode;
}

interface BaseTimelineItemProps {
  isLast?: boolean;
  children: React.ReactNode;
}

const TimelineItem: React.FC<BaseTimelineItemProps> = ({ isLast = false, children }) => {
  return (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", position: "relative", paddingBottom: isLast ? "0" : "1.5rem" }}>
      {/* Vertical Line */}
      {!isLast && (
        <div style={{ position: "absolute", left: "5px", top: "24px", height: "100%", width: "2px", backgroundColor: "#e2e8f0" }}></div>
      )}
      {/* TIMELINE NODE */}
      <div style={{ position: "relative", marginTop: "18px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--primary)", boxShadow: "0 0 0 4px #e0e7ff", flexShrink: 0, zIndex: 1 }}></div>
      
      {/* Form Card */}
      <div style={{ flex: 1, backgroundColor: "#f8fafc", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {children}
      </div>
    </div>
  );
};

export const BaseTimeline: React.FC<BaseTimelineProps> & { Item: typeof TimelineItem } = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0", paddingLeft: "4px" }}>
      {children}
    </div>
  );
};

BaseTimeline.Item = TimelineItem;
