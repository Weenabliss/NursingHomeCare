import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { PageHeader } from "../../../components/molecules/PageHeader";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { BasePagination } from "../../../components/atoms/BasePagination";
import { Toolbar } from "../../../components/molecules/Toolbar";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { usePagination } from "../../../hooks/usePagination";
import { useLayout } from "../../../contexts/LayoutContext";
import { residentsMockData } from "../../../mock/residents";
import type { Resident } from "../../../mock/residents";
import { slotsMockData, bedsMockData, roomsMockData, floorsMockData, buildingsMockData, roomTypesMockData } from "../../../mock/facility";
import type { Slot, Bed, Room, Floor, Building } from "../../../mock/facility";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const calculateAge = (dob: string) => {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

const getDaysInCare = (admissionDate: string) =>
  Math.floor((Date.now() - new Date(admissionDate).getTime()) / (1000 * 60 * 60 * 24));

const getSlotLocation = (slotId?: string) => {
  if (!slotId) return null;
  const slot = slotsMockData.find((s: Slot) => s.id === slotId);
  if (!slot) return null;
  const bed = bedsMockData.find((b: Bed) => b.id === slot.bedId);
  if (!bed) return { building: "", floor: "", room: "", bed: "", slot: slot.name, roomType: "" };
  const room = roomsMockData.find((r: Room) => r.id === bed.roomId);
  if (!room) return { building: "", floor: "", room: "", bed: bed.name, slot: slot.name, roomType: "" };
  const floor = floorsMockData.find((f: Floor) => f.id === room.floorId);
  const building = buildingsMockData.find((b: Building) => b.id === floor?.buildingId);
  const roomType = roomTypesMockData.find(rt => rt.id === room.typeId)?.name || "";

  return {
    building: building?.name || "",
    floor: floor?.name || "",
    room: room.name,
    bed: bed.name,
    slot: slot.name,
    roomType
  };
};

// ─── Config ───────────────────────────────────────────────────────────────────
const healthConfig = {
  normal: { label: "Bình thường", color: "#16a34a", bg: "#dcfce7", dot: "#22c55e" },
  attention: { label: "Cần theo dõi", color: "#b45309", bg: "#fef3c7", dot: "#f59e0b" },
  critical: { label: "Nghiêm trọng", color: "#dc2626", bg: "#fee2e2", dot: "#ef4444" },
};

const statusConfig = {
  active: { label: "Đang lưu trú", color: "#0369a1", bg: "#e0f2fe" },
  hospitalized: { label: "Đi viện", color: "#7c3aed", bg: "#ede9fe" },
  leave: { label: "Về thăm nhà", color: "#64748b", bg: "#f1f5f9" },
  discharged: { label: "Ra viện", color: "#6b7280", bg: "#f3f4f6" },
};

const mobilityConfig = {
  normal: { label: "Tự đi lại", icon: "🚶", color: "#16a34a" },
  wheelchair: { label: "Xe lăn", icon: "♿", color: "#b45309" },
  bedridden: { label: "Nằm liệt", icon: "🛏️", color: "#dc2626" },
};

// ─── SectionLabel ─────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    fontSize: "0.62rem", fontWeight: 700, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.07em",
  }}>
    {children}
  </span>
);

// ─── ResidentRowCard ──────────────────────────────────────────────────────────
const ResidentRowCard: React.FC<{ resident: Resident; onClick: () => void }> = ({ resident, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const health = healthConfig[resident.healthStatus];
  const statusInfo = statusConfig[resident.status];
  const mobility = mobilityConfig[resident.medicalHistory.mobilityStatus];
  const location = getSlotLocation(resident.assignedSlotId);
  const age = calculateAge(resident.dateOfBirth);
  const days = getDaysInCare(resident.admissionDate);
  const isFemale = resident.gender === "female";
  const genderColor = isFemale ? "#db2777" : "#2563eb";
  const genderBg = isFemale ? "#fdf2f8" : "#eff6ff";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#f8fafc" : "#fff",
        borderRadius: 12,
        border: `1.5px solid ${hovered ? "var(--primary,#6366f1)" : "#e8edf2"}`,
        boxShadow: hovered ? "0 6px 24px rgba(99,102,241,.12)" : "0 1px 4px rgba(0,0,0,.05)",
        cursor: "pointer",
        transition: "all .2s ease",
        position: "relative",
      }}
    >
      {/* ── Left health bar ── */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: `linear-gradient(180deg, ${health.dot}, ${health.color}80)`,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }} />

      {/* ── Grid Container ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 280px 180px minmax(200px, 1fr) 100px",
        gap: "1.25rem",
        padding: "1rem 1.25rem 1rem 1.5rem",
        alignItems: "stretch",
        minHeight: 84,
      }}>

        {/* 1. Avatar + Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              border: `2.5px solid ${genderColor}30`,
              background: genderBg, overflow: "hidden", padding: 2,
            }}>
              <img src={resident.avatar} alt={resident.fullName}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
            {/* Status glow dot */}
            <div style={{
              position: "absolute", bottom: 1, right: 1,
              width: 12, height: 12, borderRadius: "50%",
              background: health.dot, border: "2px solid #fff",
              boxShadow: `0 0 5px ${health.dot}90`,
            }} />
          </div>

          {/* Name + tags */}
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{
              fontWeight: 700, fontSize: "0.92rem", color: "#0f172a", lineHeight: 1.3,
              display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"
            }}>
              {resident.fullName}
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", overflow: "hidden", maxHeight: 22 }}>
              <span style={{
                fontSize: "0.67rem", fontWeight: 800, letterSpacing: "0.03em",
                color: "#fff", background: "var(--primary,#6366f1)",
                padding: "2px 6px", borderRadius: 4,
              }}>
                {resident.code}
              </span>
              <span style={{
                fontSize: "0.7rem", fontWeight: 600, color: genderColor, background: genderBg,
                padding: "2px 6px", borderRadius: 4,
              }}>
                {isFemale ? "♀" : "♂"} {age}t
              </span>
            </div>
          </div>
        </div>

        {/* 2. Vị trí & Dịch vụ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden", borderLeft: "1px solid #f0f4f8", paddingLeft: "1.25rem", justifyContent: "center" }}>
          {location ? (
            <>
              <div style={{
                display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
                fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", lineHeight: 1.3
              }}>
                {location.room} <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 400 }}>(Tầng {location.floor} - {location.building})</span>
              </div>
              <div style={{ display: "flex", gap: 4, overflow: "hidden", flexWrap: "wrap", maxHeight: 22 }}>
                <span style={{ fontSize: "0.68rem", color: "#475569", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap" }}>
                  🛏 {location.bed}-{location.slot}
                </span>
                {location.roomType && (
                  <span style={{ fontSize: "0.68rem", color: "#475569", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap" }}>
                    {location.roomType}
                  </span>
                )}
                {resident.servicePackage && (
                  <span style={{ fontSize: "0.68rem", color: "#86198f", background: "#fdf4ff", border: "1px solid #fae8ff", padding: "1px 6px", borderRadius: 4, fontWeight: 500, whiteSpace: "nowrap" }}>
                    {resident.servicePackage}
                  </span>
                )}
              </div>
            </>
          ) : (
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic" }}>Chưa xếp chỗ</span>
          )}
        </div>

        {/* 3. Tình trạng */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden", borderLeft: "1px solid #f0f4f8", paddingLeft: "1.25rem", justifyContent: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: health.bg, borderRadius: 7, padding: "3px 9px",
            width: "fit-content", boxShadow: `inset 0 0 0 1px ${health.dot}20`,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: health.dot, boxShadow: `0 0 4px ${health.dot}` }} />
            <span style={{ fontSize: "0.77rem", fontWeight: 700, color: health.color }}>{health.label}</span>
          </div>
          <div style={{ display: "flex", gap: 4, overflow: "hidden", flexWrap: "wrap", maxHeight: 22 }}>
            <span style={{ fontSize: "0.67rem", fontWeight: 600, color: statusInfo.color, background: statusInfo.bg, padding: "2px 7px", borderRadius: 10, whiteSpace: "nowrap" }}>
              {statusInfo.label}
            </span>
            <span style={{ fontSize: "0.67rem", fontWeight: 600, color: mobility.color, background: `${mobility.color}15`, padding: "2px 7px", borderRadius: 10, whiteSpace: "nowrap" }}>
              {mobility.icon} {mobility.label}
            </span>
          </div>
        </div>

        {/* 4. Bệnh nền */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0, overflow: "hidden", borderLeft: "1px solid #f0f4f8", paddingLeft: "1.25rem", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", overflow: "hidden", maxHeight: 46 }}>
            {resident.medicalHistory.chronicDiseases.length === 0 ? (
              <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontStyle: "italic" }}>Không có</span>
            ) : (
              resident.medicalHistory.chronicDiseases.map((d, i) => (
                <span key={i} style={{
                  fontSize: "0.69rem", fontWeight: 500,
                  background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa",
                  padding: "2px 8px", borderRadius: 6,
                  maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {d}
                </span>
              ))
            )}
          </div>
        </div>

        {/* 5. Days Stat */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", borderLeft: "1px solid #f0f4f8" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "1.75rem", fontWeight: 900, lineHeight: 1,
              background: "linear-gradient(135deg,var(--primary,#6366f1),#a5b4fc)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {days}
            </div>
            <div style={{ fontSize: "0.59rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>
              Ngày lưu trú
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8;

export const ResidentList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHealth, setFilterHealth] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Vị trí filters
  const [filterBuilding, setFilterBuilding] = useState<string>("all");
  const [filterFloor, setFilterFloor] = useState<string>("all");
  const [filterRoom, setFilterRoom] = useState<string>("all");

  const filtered = useMemo(() => {
    return residentsMockData.filter((r: Resident) => {
      const matchSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || r.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchHealth = filterHealth === "all" || r.healthStatus === filterHealth;
      const matchStatus = filterStatus === "all" || r.status === filterStatus;

      let matchLocation = true;
      if (filterBuilding !== "all" || filterFloor !== "all" || filterRoom !== "all") {
        if (!r.assignedSlotId) {
          matchLocation = false;
        } else {
          const slot = slotsMockData.find(s => s.id === r.assignedSlotId);
          const bed = bedsMockData.find(b => b.id === slot?.bedId);
          const room = roomsMockData.find(rm => rm.id === bed?.roomId);
          const floor = floorsMockData.find(f => f.id === room?.floorId);

          if (filterBuilding !== "all" && floor?.buildingId !== filterBuilding) matchLocation = false;
          if (filterFloor !== "all" && room?.floorId !== filterFloor) matchLocation = false;
          if (filterRoom !== "all" && bed?.roomId !== filterRoom) matchLocation = false;
        }
      }

      return matchSearch && matchHealth && matchStatus && matchLocation;
    });
  }, [searchTerm, filterHealth, filterStatus, filterBuilding, filterFloor, filterRoom]);

  const { currentPage, setCurrentPage, paginate } = usePagination<Resident>({
    totalItems: filtered.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const currentItems = paginate(filtered);

  // Inject pagination into footer
  const { setFooterContent } = useLayout();
  useEffect(() => {
    setFooterContent(
      <BasePagination
        currentPage={currentPage}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        style={{ padding: "0 2rem" }}
      />
    );
    return () => setFooterContent(null);
  }, [currentPage, filtered.length, setCurrentPage, setFooterContent]);

  // Options for Dropdowns
  const buildingOptions = [
    { label: "Tất cả Tòa", value: "all" },
    ...buildingsMockData.map(b => ({ label: b.name, value: b.id }))
  ];

  const floorOptions = [
    { label: "Tất cả Tầng", value: "all" },
    ...floorsMockData
      .filter(f => filterBuilding === "all" || f.buildingId === filterBuilding)
      .map(f => ({ label: f.name, value: f.id }))
  ];

  const roomOptions = [
    { label: "Tất cả Phòng", value: "all" },
    ...roomsMockData
      .filter(r => filterFloor === "all" || r.floorId === filterFloor)
      .map(r => ({ label: r.name, value: r.id }))
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <PageHeader
          title="Danh sách Người cao tuổi"
          subtitle={`${residentsMockData.length} cư dân đang được quản lý`}
          actions={
            <BaseButton onClick={() => navigate("/elderly/list/new")}>
              <Plus size={18} /> Tiếp nhận Cư dân
            </BaseButton>
          }
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchPlaceholder="Tìm tên hoặc mã cư dân..."
        onSearch={(query) => { setSearchTerm(query); setCurrentPage(1); }}
        filters={
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "nowrap", width: "100%", overflowX: "auto" }}>
            <div style={{ width: 140, flexShrink: 0 }}>
              <BaseSelect
                options={[
                  { label: "Sức khỏe (Tất cả)", value: "all" },
                  { label: "Bình thường", value: "normal" },
                  { label: "Cần theo dõi", value: "attention" },
                  { label: "Nghiêm trọng", value: "critical" },
                ]}
                value={filterHealth}
                onChange={(e) => { setFilterHealth(e.target.value); setCurrentPage(1); }}
                fullWidth
              />
            </div>
            <div style={{ width: 140, flexShrink: 0 }}>
              <BaseSelect
                options={[
                  { label: "Trạng thái (Tất cả)", value: "all" },
                  { label: "Đang lưu trú", value: "active" },
                  { label: "Đi viện", value: "hospitalized" },
                  { label: "Về thăm nhà", value: "leave" },
                ]}
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                fullWidth
              />
            </div>

            <div style={{ width: "1px", height: 24, background: "var(--border)", margin: "0 4px", flexShrink: 0, alignSelf: "center" }} />

            <div style={{ width: 120, flexShrink: 0 }}>
              <BaseSelect
                options={buildingOptions}
                value={filterBuilding}
                onChange={(e) => {
                  setFilterBuilding(e.target.value);
                  setFilterFloor("all");
                  setFilterRoom("all");
                  setCurrentPage(1);
                }}
                fullWidth
              />
            </div>
            <div style={{ width: 120, flexShrink: 0 }}>
              <BaseSelect
                options={floorOptions}
                value={filterFloor}
                onChange={(e) => {
                  setFilterFloor(e.target.value);
                  setFilterRoom("all");
                  setCurrentPage(1);
                }}
                disabled={filterBuilding === "all"}
                fullWidth
              />
            </div>
            <div style={{ width: 130 }}>
              <BaseSelect
                options={roomOptions}
                value={filterRoom}
                onChange={(e) => { setFilterRoom(e.target.value); setCurrentPage(1); }}
                disabled={filterFloor === "all"}
                fullWidth
              />
            </div>
          </div>
        }
        actions={
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {(["normal", "attention", "critical"] as const).map(h => {
              const count = residentsMockData.filter(r => r.healthStatus === h).length;
              const cfg = healthConfig[h];
              return (
                <div key={h} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot }} />
                  <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    {count} <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                  </span>
                </div>
              );
            })}
            <span style={{ color: "#cbd5e1" }}>|</span>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> kết quả
            </span>
          </div>
        }
      />

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", background: "#f3f4f8", padding: "1rem 1.25rem", position: "relative" }}>
        
        {/* Header Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "260px 280px 180px minmax(200px, 1fr) 100px",
          gap: "1.25rem",
          padding: "0.75rem 1.25rem 0.75rem 1.5rem",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          position: "sticky",
          top: 0,
          zIndex: 10,
          marginBottom: "0.75rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          {["Cư dân", "Vị trí & Dịch vụ", "Tình trạng", "Bệnh nền", "Lưu trú"].map((col, i) => (
            <div key={i} style={{
              fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: "0.07em",
              textAlign: i === 4 ? "center" : "left",
            }}>
              {col}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {currentItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
              <p style={{ fontSize: "1rem", fontWeight: 500 }}>Không tìm thấy cư dân phù hợp</p>
            </div>
          ) : currentItems.map((r: Resident) => (
            <ResidentRowCard key={r.id} resident={r} onClick={() => navigate(`/elderly/list/${r.id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
};
