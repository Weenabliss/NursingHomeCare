import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Search } from "lucide-react";
import { PageHeader } from "../../../components/molecules/PageHeader";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { BasePagination } from "../../../components/atoms/BasePagination";
import { Toolbar } from "../../../components/molecules/Toolbar";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import baseInputStyles from "../../../components/atoms/BaseInput.module.scss";
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
        background: hovered ? "#eef2ff" : "#fff",
        borderRadius: 16,
        border: `2px solid ${hovered ? "var(--primary-light, #818cf8)" : "transparent"}`,
        boxShadow: hovered 
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        position: "relative",
      }}
    >
      {/* ── Grid Container ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "300px 320px 180px minmax(180px, 1fr) 130px",
        gap: "1.5rem",
        padding: "1.25rem 1.5rem",
        alignItems: "center",
        minHeight: 90,
      }}>

        {/* 1. Avatar + Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              border: `3px solid ${genderBg}`,
              boxShadow: `0 0 0 2px ${genderColor}30`,
              background: genderBg, overflow: "hidden", padding: 2,
            }}>
              <img src={resident.avatar} alt={resident.fullName}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
            {/* Status glow dot */}
            <div style={{
              position: "absolute", bottom: 2, right: 2,
              width: 14, height: 14, borderRadius: "50%",
              background: health.dot, border: "2px solid #fff",
              boxShadow: `0 0 6px ${health.dot}90`,
            }} />
          </div>

          {/* Name + tags */}
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{
              fontWeight: 800, fontSize: "1.05rem", color: "#0f172a", lineHeight: 1.3,
              display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"
            }}>
              {resident.fullName}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", overflow: "hidden", maxHeight: 24 }}>
              <span style={{
                fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.03em",
                color: "#fff", background: "var(--primary,#6366f1)",
                padding: "3px 8px", borderRadius: 6,
              }}>
                {resident.code}
              </span>
              <span style={{
                fontSize: "0.75rem", fontWeight: 700, color: genderColor, background: genderBg,
                padding: "3px 8px", borderRadius: 6,
              }}>
                {isFemale ? "Nữ" : "Nam"} • {age}t
              </span>
            </div>
          </div>
        </div>

        {/* 2. Vị trí & Dịch vụ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {location ? (
            <>
              <div style={{
                fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", lineHeight: 1.4,
                wordBreak: "break-word"
              }}>
                {location.room} {location.roomType && <span style={{ fontWeight: 500, color: "#64748b", fontSize: "0.8rem" }}>({location.roomType})</span>}
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0 6px", fontSize: "0.8rem", color: "#475569" }}>
                <span><strong style={{ color: "#0f172a" }}>Tòa:</strong> {location.building}</span>
                <span style={{ color: "#cbd5e1" }}>|</span>
                <span><strong style={{ color: "#0f172a" }}>Tầng:</strong> {location.floor}</span>
                <span style={{ color: "#cbd5e1" }}>|</span>
                <span><strong style={{ color: "#0f172a" }}>Giường:</strong> {location.bed}</span>
                <span style={{ color: "#cbd5e1" }}>|</span>
                <span><strong style={{ color: "#0f172a" }}>Vị trí:</strong> {location.slot}</span>
              </div>

              {resident.servicePackage && (
                <div style={{ marginTop: 2 }}>
                  <span style={{ fontSize: "0.75rem", color: "#86198f", background: "#fdf4ff", border: "1px solid #fae8ff", padding: "3px 8px", borderRadius: 6, fontWeight: 600, display: "inline-block" }}>
                    {resident.servicePackage}
                  </span>
                </div>
              )}
            </>
          ) : (
            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}>Chưa xếp chỗ</span>
          )}
        </div>

        {/* 3. Tình trạng */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: health.bg, borderRadius: 8, padding: "4px 12px",
            width: "fit-content", boxShadow: `inset 0 0 0 1px ${health.dot}30`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: health.dot, boxShadow: `0 0 6px ${health.dot}` }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: health.color }}>{health.label}</span>
          </div>
          <div style={{ display: "flex", gap: 6, overflow: "hidden", flexWrap: "wrap", maxHeight: 24 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: statusInfo.color, background: statusInfo.bg, padding: "3px 10px", borderRadius: 12, whiteSpace: "nowrap" }}>
              {statusInfo.label}
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: mobility.color, background: `${mobility.color}15`, padding: "3px 10px", borderRadius: 12, whiteSpace: "nowrap" }}>
              {mobility.icon} {mobility.label}
            </span>
          </div>
        </div>

        {/* 4. Bệnh nền */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, overflow: "hidden" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
            Bệnh nền
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", overflow: "hidden", maxHeight: 56 }}>
            {resident.medicalHistory.chronicDiseases.length === 0 ? (
              <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}>Không có</span>
            ) : (
              resident.medicalHistory.chronicDiseases.map((d, i) => (
                <span key={i} style={{
                  fontSize: "0.75rem", fontWeight: 600,
                  background: "#fff7ed", color: "#c2410c", border: "1px solid #ffedd5",
                  padding: "4px 10px", borderRadius: 8,
                  maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {d}
                </span>
              ))
            )}
          </div>
        </div>

        {/* 5. Days Stat */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: "100%" }}>
          <div style={{ textAlign: "right", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{
              fontSize: "1.8rem", fontWeight: 900, lineHeight: 1,
              background: "linear-gradient(135deg, var(--primary, #6366f1), #8b5cf6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {days}
            </div>
            <div style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 6 }}>
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

      {/* Premium Filter & Search Panel */}
      <div style={{ flexShrink: 0, paddingBottom: "0.5rem" }}>
        <div style={{
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
          borderRadius: 14,
          padding: "1rem 1.25rem",
          boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.05), 0 2px 4px -1px rgba(99, 102, 241, 0.03)",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem"
        }}>
          {/* Top Row: Search & Stats */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            {/* Search Input */}
            <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
              <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                placeholder="Tìm tên hoặc mã cư dân..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className={baseInputStyles.input}
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>

            {/* Stats Actions */}
            <div style={{ display: "flex", gap: "0.85rem", alignItems: "center", background: "#ffffff", padding: "0.4rem 0.85rem", borderRadius: 8, border: "1px solid #e0e7ff", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.02)" }}>
              {(["normal", "attention", "critical"] as const).map(h => {
                const count = residentsMockData.filter(r => r.healthStatus === h).length;
                const cfg = healthConfig[h];
                return (
                  <div key={h} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 4px ${cfg.dot}80` }} />
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                      <span style={{ color: cfg.color, fontWeight: 700 }}>{count}</span> {cfg.label}
                    </span>
                  </div>
                );
              })}
              <div style={{ width: 1, height: 14, background: "#c7d2fe" }} />
              <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                <strong style={{ color: "#312e81", fontSize: "0.85rem" }}>{filtered.length}</strong> kết quả
              </span>
            </div>
          </div>

          {/* Bottom Row: Filter Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
            <BaseSelect
              label="Tình trạng sức khỏe"
              options={[
                { label: "Tất cả sức khỏe", value: "all" },
                { label: "Bình thường", value: "normal" },
                { label: "Cần theo dõi", value: "attention" },
                { label: "Nghiêm trọng", value: "critical" },
              ]}
              value={filterHealth}
              onChange={(e) => { setFilterHealth(e.target.value); setCurrentPage(1); }}
              fullWidth
            />
            <BaseSelect
              label="Trạng thái lưu trú"
              options={[
                { label: "Tất cả trạng thái", value: "all" },
                { label: "Đang lưu trú", value: "active" },
                { label: "Đi viện", value: "hospitalized" },
                { label: "Về thăm nhà", value: "leave" },
              ]}
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              fullWidth
            />
            <BaseSelect
              label="Tòa nhà"
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
            <BaseSelect
              label="Tầng"
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
            <BaseSelect
              label="Phòng"
              options={roomOptions}
              value={filterRoom}
              onChange={(e) => { setFilterRoom(e.target.value); setCurrentPage(1); }}
              disabled={filterFloor === "all"}
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", background: "transparent", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "4px 0 1.5rem 0" }}>
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
