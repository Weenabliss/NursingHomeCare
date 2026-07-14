import styles from "./BaseTimeline.module.scss";

interface BaseTimelineProps {
  children: React.ReactNode;
}

interface BaseTimelineItemProps {
  isLast?: boolean;
  children: React.ReactNode;
}

const TimelineItem: React.FC<BaseTimelineItemProps> = ({ isLast = false, children }) => {
  return (
    <div className={`${styles.item} ${isLast ? styles.last : ""}`}>
      {/* Vertical Line */}
      {!isLast && <div className={styles.verticalLine}></div>}
      
      {/* TIMELINE NODE */}
      <div className={styles.node}></div>
      
      {/* Form Card */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export const BaseTimeline: React.FC<BaseTimelineProps> & { Item: typeof TimelineItem } = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

BaseTimeline.Item = TimelineItem;
