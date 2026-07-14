import React from "react";
import { BedDouble, User, Calendar, Plus, Info, Settings2 } from "lucide-react";
import type { Room, Bed, Slot, RoomType } from "../../../../mock/facility";
import { BaseButton } from "../../../../shared/components/BaseButton";
import { BaseCard } from "../../../../shared/components/BaseCard";

interface Props {
  room: Room;
  roomType?: RoomType;
  beds: Bed[];
  slots: Slot[];
}

export const RoomDetailPanel: React.FC<Props> = ({ room, roomType, beds, slots }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
      {/* ── Header: Thông tin chung của phòng ────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)" }}>
              {room.name}
            </h2>
            <span style={{
              padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.7rem", fontWeight: 700,
              background: room.status === "active" ? "#dcfce7" : "#fee2e2",
              color: room.status === "active" ? "#16a34a" : "#ef4444"
            }}>
              {room.status === "active" ? "Đang hoạt động" : "Bảo trì"}
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {roomType ? (
              <>
                {roomType.color && <div style={{ width: 10, height: 10, borderRadius: "50%", background: roomType.color }} />}
                <span style={{ fontWeight: 600 }}>{roomType.name}</span>
                <span>• {roomType.capacity} người • {roomType.area}m²</span>
              </>
            ) : (
              <span style={{ fontStyle: "italic" }}>Chưa gán Loại Phòng</span>
            )}
          </div>
        </div>
        
        <BaseButton variant="primary" size="sm" onClick={() => {}}>
          <Plus size={14} /> Thêm Giường
        </BaseButton>
      </div>

      {/* ── Danh sách Giường & Slot ──────────────────────────────────── */}
      {beds.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-muted)" }}>
          <BedDouble size={48} style={{ opacity: 0.2, margin: "0 auto 1rem" }} />
          <p style={{ margin: 0, fontWeight: 500 }}>Phòng này chưa có giường nào.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--spacing-md)" }}>
          {beds.map((bed) => {
            const bedSlots = slots.filter(s => s.bedId === bed.id);
            return (
              <BaseCard key={bed.id} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Bed Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BedDouble size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>{bed.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{bedSlots.length} Slots</div>
                    </div>
                  </div>
                  <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                    <Settings2 size={16} />
                  </button>
                </div>
                
                {/* Slots List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {bedSlots.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>Chưa có Slot nào được chia.</div>
                  ) : bedSlots.map(slot => (
                    <div key={slot.id} style={{
                      border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0.75rem",
                      background: slot.status === "occupied" ? "linear-gradient(to right, #f0fdf4, #ffffff)" : "#fff",
                      borderLeft: `4px solid ${slot.status === "occupied" ? "#16a34a" : slot.status === "maintenance" ? "#ef4444" : "#cbd5e1"}`
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>{slot.name}</span>
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: 4,
                          background: slot.status === "occupied" ? "#16a34a22" : slot.status === "maintenance" ? "#ef444422" : "#f1f5f9",
                          color: slot.status === "occupied" ? "#16a34a" : slot.status === "maintenance" ? "#ef4444" : "var(--text-muted)"
                        }}>
                          {slot.status === "occupied" ? "ĐANG CÓ KHÁCH" : slot.status === "maintenance" ? "BẢO TRÌ" : "TRỐNG"}
                        </span>
                      </div>
                      
                      {slot.status === "occupied" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-main)", fontWeight: 500 }}>
                            <User size={12} color="var(--primary)" /> {slot.occupantName}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            <Calendar size={12} /> {slot.startDate} — {slot.endDate || "Chưa có ngày trả"}
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Info size={12} /> Sẵn sàng nhận khách mới
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </BaseCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
