import { useRef } from "react";

/**
 * Custom hook đồng bộ scroll ngang giữa Header và Body trong các Grid View.
 * Thay thế cho pattern copy-paste useRef + handleScroll ở WeekView, MonthView, ScheduleStats.
 */
export const useScrollSync = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return { headerRef, handleScroll };
};
