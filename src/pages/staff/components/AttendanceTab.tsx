import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Coffee, Activity, Droplets, HeartPulse, Pill } from "lucide-react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { BaseButton } from "../../../components/atoms/BaseButton";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

interface AttendanceTabProps {
  staff: Staff;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ staff }) => {
  const [calendarMode, setCalendarMode] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-07-10"));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <BaseCard>
        <div className={styles.calendarControls}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <BaseButton
              variant="outline"
              style={{ padding: "6px" }}
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (calendarMode === "month") newDate.setMonth(newDate.getMonth() - 1);
                else if (calendarMode === "week") newDate.setDate(newDate.getDate() - 7);
                else newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
            >
              <ChevronLeft size={18} />
            </BaseButton>
            <h3 style={{ margin: 0, minWidth: "150px", textAlign: "center", color: "var(--text-main)" }}>
              {calendarMode === "month"
                ? `Tháng ${selectedDate.getMonth() + 1} / ${selectedDate.getFullYear()}`
                : calendarMode === "week"
                  ? `Tuần ${Math.ceil(selectedDate.getDate() / 7)} Tháng ${selectedDate.getMonth() + 1}`
                  : `Ngày ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`}
            </h3>
            <BaseButton
              variant="outline"
              style={{ padding: "6px" }}
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (calendarMode === "month") newDate.setMonth(newDate.getMonth() + 1);
                else if (calendarMode === "week") newDate.setDate(newDate.getDate() + 7);
                else newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            >
              <ChevronRight size={18} />
            </BaseButton>
          </div>

          <div className={styles.calendarModes}>
            <button
              className={`${styles.modeBtn} ${calendarMode === "day" ? styles.active : ""}`}
              onClick={() => setCalendarMode("day")}
            >
              Ngày
            </button>
            <button
              className={`${styles.modeBtn} ${calendarMode === "week" ? styles.active : ""}`}
              onClick={() => setCalendarMode("week")}
            >
              Tuần
            </button>
            <button
              className={`${styles.modeBtn} ${calendarMode === "month" ? styles.active : ""}`}
              onClick={() => setCalendarMode("month")}
            >
              Tháng
            </button>
          </div>
        </div>

        {calendarMode === "month" && (
          <div className={styles.calendarGrid}>
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <div key={d} className={styles.calendarHeader}>
                {d}
              </div>
            ))}
            {/* Empty days for offset (assuming month starts on Wed for dummy UI) */}
            <div className={`${styles.calendarDay} ${styles.emptyDay}`}></div>
            <div className={`${styles.calendarDay} ${styles.emptyDay}`}></div>
            {staff.schedule.days.map((dayData, idx) => {
              const isCurrentDay = dayData.date === "2026-07-10";
              const isSelected = selectedDate.getDate() === idx + 1;
              let shiftClass = styles.off;
              if (dayData.shift === "Ca Sáng") shiftClass = styles.morning;
              if (dayData.shift === "Ca Chiều") shiftClass = styles.afternoon;
              if (dayData.shift === "Ca Đêm") shiftClass = styles.night;
              if (dayData.shift === "Hành Chính") shiftClass = styles.admin;

              return (
                <div
                  key={dayData.date}
                  className={`${styles.calendarDay} ${isCurrentDay ? styles.currentDay : ""}`}
                  onClick={() => {
                    setSelectedDate(new Date(dayData.date));
                    setCalendarMode("day");
                  }}
                  style={{ border: isSelected ? "2px solid var(--primary)" : "none" }}
                >
                  <span className={styles.dayNumber}>{idx + 1}</span>
                  <div className={`${styles.shiftBadge} ${shiftClass}`}>{dayData.shift}</div>
                  {dayData.tasks.length > 0 && (
                    <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", marginTop: "auto" }}>
                      {dayData.tasks.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary-dark)",
                          }}
                        ></div>
                      ))}
                      {dayData.tasks.length > 3 && (
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>+</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {calendarMode === "week" && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            <Calendar size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <p>Chế độ xem tuần (Đang phát triển, vui lòng xem Tháng hoặc Ngày)</p>
          </div>
        )}

        {calendarMode === "day" && (
          <div className={styles.timeline}>
            {staff.schedule.days.find((d) => parseInt(d.date.split("-")[2]) === selectedDate.getDate())
              ?.shift === "Nghỉ" ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "var(--text-muted)",
                  backgroundColor: "var(--background-alt)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <Coffee size={40} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                <p style={{ margin: 0, fontWeight: 500 }}>Nhân viên có lịch nghỉ vào ngày này.</p>
              </div>
            ) : (
              staff.schedule.days
                .find((d) => parseInt(d.date.split("-")[2]) === selectedDate.getDate())
                ?.tasks.map((task) => {
                  let Icon = Activity;
                  if (task.type === "meal") Icon = Coffee;
                  if (task.type === "bath") Icon = Droplets;
                  if (task.type === "toilet") Icon = Droplets; // Reusing icon for demo
                  if (task.type === "health") Icon = HeartPulse;
                  if (task.type === "medication") Icon = Pill;

                  return (
                    <div key={task.id} className={styles.timelineItem}>
                      <div className={styles.timelineTime}>{task.time}</div>
                      <div className={styles.timelineContent}>
                        <div className={`${styles.timelineIcon} ${styles[task.type]}`}>
                          <Icon size={20} />
                        </div>
                        <div className={styles.timelineDetails}>
                          <div className={styles.taskType}>
                            {task.type === "activity"
                              ? "Hoạt động / Tập thể dục"
                              : task.type === "meal"
                                ? "Phục vụ ăn uống"
                                : task.type === "bath"
                                  ? "Tắm rửa / Vệ sinh cá nhân"
                                  : task.type === "toilet"
                                    ? "Hỗ trợ bài tiết"
                                    : task.type === "health"
                                      ? "Đo chỉ số sức khỏe (HA, Nhịp tim)"
                                      : "Hỗ trợ uống thuốc"}
                          </div>
                          <div className={styles.taskPatient}>
                            Bệnh nhân: <span style={{ fontWeight: 600 }}>{task.patientName}</span>
                          </div>
                        </div>
                        <div className={styles.taskRoom}>{task.room}</div>
                      </div>
                    </div>
                  );
                }) || (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  Không có dữ liệu cho ngày này.
                </div>
              )
            )}
          </div>
        )}
      </BaseCard>
    </div>
  );
};
