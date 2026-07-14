import React, { useState } from "react";
import { Utensils, Droplets, Wind, Activity, HeartPulse, Pill, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { Resident } from "../../../../mock/residents";
import { BaseButton } from "../../../../components/atoms/BaseButton";

interface ActivitiesTabProps {
  resident: Resident;
}

const LogSection = ({ title, icon: Icon, color, children }: { title: string, icon: any, color: string, children: React.ReactNode }) => (
  <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
    <div style={{ background: color, padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid var(--border)" }}>
      <Icon size={18} style={{ color: "#1e293b" }} />
      <h4 style={{ margin: 0, fontSize: "1rem", color: "#1e293b", fontWeight: 600 }}>{title}</h4>
    </div>
    <div style={{ padding: "1.25rem" }}>
      {children}
    </div>
  </div>
);

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ resident: _resident }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Top Bar: Date Navigator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", padding: "1rem 1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CalendarIcon size={20} color="var(--primary)" /> Nhật ký chăm sóc hàng ngày
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <BaseButton variant="outline" size="sm"><ChevronLeft size={16} /></BaseButton>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "6px", outline: "none", fontSize: "0.95rem" }}
          />
          <BaseButton variant="outline" size="sm"><ChevronRight size={16} /></BaseButton>
        </div>
      </div>

      {/* 6 Sections Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <LogSection title="1. Ăn uống (5 bữa)" icon={Utensils} color="#fef3c7"> {/* Amber/Yellow */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "0.5rem" }}>
                <span style={{ fontWeight: 500 }}>Sáng (07:00)</span><span style={{ color: "var(--success)" }}>Ăn hết suất (Cháo thịt)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "0.5rem" }}>
                <span style={{ fontWeight: 500 }}>Phụ Sáng (09:30)</span><span style={{ color: "var(--success)" }}>Sữa (200ml)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "0.5rem" }}>
                <span style={{ fontWeight: 500 }}>Trưa (11:30)</span><span style={{ color: "#eab308" }}>Ăn nửa suất (Cơm mềm)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "0.5rem" }}>
                <span style={{ fontWeight: 500 }}>Phụ Chiều (15:00)</span><span style={{ color: "var(--text-muted)" }}>Chưa ghi nhận</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 500 }}>Tối (18:00)</span><span style={{ color: "var(--text-muted)" }}>Chưa ghi nhận</span>
              </div>
            </div>
          </LogSection>

          <LogSection title="2. Tắm rửa & Vệ sinh" icon={Droplets} color="#e0f2fe"> {/* Sky blue */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", flex: 1, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Tắm rửa</div>
                <div style={{ fontWeight: 600 }}>08:30 (Tắm bồn)</div>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", flex: 1, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Gội đầu</div>
                <div style={{ fontWeight: 600 }}>Có</div>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", flex: 1, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Thay đồ</div>
                <div style={{ fontWeight: 600 }}>08:45</div>
              </div>
            </div>
          </LogSection>

          <LogSection title="3. Bài tiết" icon={Wind} color="#f4f4f5"> {/* Zinc/Gray */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>Đi đại tiện</span>
                <span style={{ background: "#dcfce7", color: "#166534", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}>1 lần (Bình thường)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>Đi tiểu tiện</span>
                <span style={{ background: "#dcfce7", color: "#166534", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}>3 lần (Vàng nhạt)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>Thay tã bỉm</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Không áp dụng</span>
              </div>
            </div>
          </LogSection>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <LogSection title="4. Đo các chỉ số cơ thể" icon={HeartPulse} color="#ffe4e6"> {/* Rose/Pink */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ background: "#fff1f2", padding: "0.75rem", borderRadius: "8px", border: "1px solid #fecdd3" }}>
                <div style={{ fontSize: "0.85rem", color: "#be123c", fontWeight: 500 }}>Huyết áp (08:00)</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#9f1239" }}>130/85</div>
              </div>
              <div style={{ background: "#fff1f2", padding: "0.75rem", borderRadius: "8px", border: "1px solid #fecdd3" }}>
                <div style={{ fontSize: "0.85rem", color: "#be123c", fontWeight: 500 }}>Nhịp tim</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#9f1239" }}>78 <span style={{ fontSize: "0.85rem" }}>bpm</span></div>
              </div>
              <div style={{ background: "#f0fdf4", padding: "0.75rem", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 500 }}>Nhiệt độ</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#14532d" }}>36.8°C</div>
              </div>
              <div style={{ background: "#f0fdf4", padding: "0.75rem", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 500 }}>SpO2</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#14532d" }}>98%</div>
              </div>
            </div>
          </LogSection>

          <LogSection title="5. Hoạt động & PHCN" icon={Activity} color="#dcfce7"> {/* Green */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ background: "#22c55e", width: "8px", height: "8px", borderRadius: "50%", marginTop: "6px" }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Tập Vật lý trị liệu (09:00 - 09:30)</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Tập vận động khớp gối. Cụ hợp tác tốt.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ background: "#22c55e", width: "8px", height: "8px", borderRadius: "50%", marginTop: "6px" }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Dạo mát sân vườn (16:00)</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Tham gia cùng nhóm 3 cụ khác. Tinh thần vui vẻ.</div>
                </div>
              </div>
            </div>
          </LogSection>

          <LogSection title="6. Uống thuốc" icon={Pill} color="#e0e7ff"> {/* Indigo */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Cữ Sáng (08:00)</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Amlodipine 5mg (1 viên)</div>
                </div>
                <span style={{ background: "#dcfce7", color: "#166534", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}>Đã uống</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Cữ Tối (20:00)</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Glucophage 500mg (1 viên)</div>
                </div>
                <span style={{ background: "#f1f5f9", color: "#64748b", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}>Chưa tới giờ</span>
              </div>
            </div>
          </LogSection>
        </div>

      </div>
    </div>
  );
};
