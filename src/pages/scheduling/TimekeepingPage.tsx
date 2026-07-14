import React, { useState } from "react";
import { PageHeader } from "../../shared/components/PageHeader";
import { BaseCard } from "../../shared/components/BaseCard";
import { MapPin, Wifi, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BaseInput } from "../../shared/components/BaseInput";

// --- Dữ liệu Mock ---
const mockTimekeepingData = [
  { id: 1, staffId: "NV001", staffName: "BS. Nguyễn Văn A", date: "15/08/2026", shift: "SÁNG", scheduledStart: "08:00", scheduledEnd: "17:00", actualStart: "07:55", actualEnd: "17:05", status: "on_time", location: "Bệnh viện", method: "Wifi (VNPT-NHC)" },
  { id: 2, staffId: "NV002", staffName: "ĐD. Trần Thị B", date: "15/08/2026", shift: "SÁNG", scheduledStart: "06:00", scheduledEnd: "14:00", actualStart: "06:15", actualEnd: "", status: "late", location: "Bệnh viện", method: "GPS (10.823, 106.629)" },
  { id: 3, staffId: "NV003", staffName: "ĐD. Lê Văn C", date: "15/08/2026", shift: "CHIỀU", scheduledStart: "14:00", scheduledEnd: "22:00", actualStart: "13:58", actualEnd: "", status: "on_time", location: "Ngoài viện (2km)", method: "GPS (10.821, 106.631)" },
  { id: 4, staffId: "NV004", staffName: "Bác Lão Hạc", date: "15/08/2026", shift: "HC", scheduledStart: "08:00", scheduledEnd: "17:00", actualStart: "", actualEnd: "", status: "absent", location: "", method: "" },
];

export const TimekeepingPage: React.FC = () => {
  const [date, setDate] = useState("2026-08-15");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }}>
      <PageHeader
        title="Quản lý Chấm Công (Timekeeping)"
        subtitle="Đối chiếu tự động giữa Lịch trực đã xếp và Dữ liệu Check-in thực tế."
        actions={
          <div style={{ display: "flex", gap: "12px" }}>
            <BaseInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        }
      />

      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "250px 150px 200px 200px 150px 1fr", padding: "12px", backgroundColor: "#f8fafc", fontWeight: 600, borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            <div>Nhân viên</div>
            <div>Ca trực</div>
            <div>Kế hoạch (Lịch)</div>
            <div>Thực tế (Check-in)</div>
            <div>Trạng thái</div>
            <div>Dữ liệu xác thực</div>
          </div>

          {mockTimekeepingData.map((row) => (
            <BaseCard key={row.id} style={{ padding: "0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "250px 150px 200px 200px 150px 1fr", padding: "16px 12px", alignItems: "center", fontSize: "0.9rem" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{row.staffName}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{row.staffId}</div>
                </div>

                <div>
                  <span style={{ backgroundColor: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "4px", fontWeight: 600, fontSize: "0.8rem" }}>
                    {row.shift}
                  </span>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} /> {row.scheduledStart} - {row.scheduledEnd}</div>
                </div>

                <div>
                  {row.actualStart ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: row.status === "late" ? "#dc2626" : "var(--text-main)", fontWeight: row.status === "late" ? 600 : 400 }}>
                      <Clock size={14} /> {row.actualStart} - {row.actualEnd || "..."}
                    </div>
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Chưa check-in</span>
                  )}
                </div>

                <div>
                  {row.status === "on_time" && <span style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}><CheckCircle2 size={16} /> Đúng giờ</span>}
                  {row.status === "late" && <span style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}><AlertTriangle size={16} /> Đi muộn</span>}
                  {row.status === "absent" && <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}><AlertTriangle size={16} /> Vắng mặt</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {row.location && (
                    <div style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px", color: row.location.includes("Ngoài") ? "#d97706" : "var(--text-muted)" }}>
                      <MapPin size={12} /> {row.location}
                    </div>
                  )}
                  {row.method && (
                    <div style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
                      <Wifi size={12} /> {row.method}
                    </div>
                  )}
                </div>
              </div>
            </BaseCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimekeepingPage;
