import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Contact, BedDouble, UserSquare2, ShieldAlert, Calendar, Activity, ChevronDown, Settings, Plus, Trash2, Check, X, Pencil } from "lucide-react";
import type { Resident } from "../../../../mock/residents";
import { BaseButton } from "../../../../components/atoms/BaseButton";
import { BaseModal } from "../../../../components/atoms/BaseModal";
import { BaseInput } from "../../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../../components/atoms/BaseSelect";

interface HealthOption {
  label: string;
  value: string;
  color: string;
  isBuiltIn?: boolean;
}

const DEFAULT_HEALTH_OPTIONS: HealthOption[] = [
  { label: "Bình thường", value: "normal", color: "#10b981", isBuiltIn: true },
  { label: "Cần chú ý", value: "attention", color: "#f59e0b", isBuiltIn: true },
  { label: "Nguy kịch", value: "critical", color: "#ef4444", isBuiltIn: true },
];

const HEALTH_COLORS = [
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6",
  "#f59e0b", "#f97316", "#ef4444", "#ec4899",
  "#8b5cf6", "#a855f7", "#6366f1", "#64748b",
];

const CustomHealthSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [options, setOptions] = useState<HealthOption[]>(DEFAULT_HEALTH_OPTIONS);

  // State cho form sửa/thêm trong modal quản lý
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editColor, setEditColor] = useState(HEALTH_COLORS[0]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    if (isOpen) {
      window.addEventListener("scroll", handleClose, true);
      window.addEventListener("resize", handleClose);
    }
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [isOpen]);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  // ── Manage modal handlers ──
  const startEdit = (opt: HealthOption) => {
    setEditingId(opt.value);
    setEditLabel(opt.label);
    setEditColor(opt.color);
    setIsAddingNew(false);
  };

  const saveEdit = () => {
    if (!editLabel.trim()) return;
    if (isAddingNew) {
      const newVal = `custom_${Date.now()}`;
      setOptions([...options, { label: editLabel.trim(), value: newVal, color: editColor }]);
      onChange(newVal);
    } else {
      setOptions(options.map((o) => (o.value === editingId ? { ...o, label: editLabel.trim(), color: editColor } : o)));
    }
    setEditingId(null);
    setIsAddingNew(false);
    setEditLabel("");
  };

  const deleteOption = (optValue: string) => {
    setOptions(options.filter((o) => o.value !== optValue));
    if (value === optValue) onChange("normal");
  };

  const startAddNew = () => {
    setEditingId(null);
    setIsAddingNew(true);
    setEditLabel("");
    setEditColor(HEALTH_COLORS[0]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setEditLabel("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "2px" }}>
        Tình trạng sức khỏe
      </label>

      {/* Row: Combobox + Gear button */}
      <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
        <div
          ref={triggerRef}
          onClick={handleOpen}
          style={{
            flex: 1,
            border: "1.5px solid #cbd5e1",
            borderRadius: "10px",
            padding: "0.6rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            background: "#fff",
            minHeight: "42px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {selectedOpt.color !== "transparent" && (
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: selectedOpt.color }} />
            )}
            <span style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>{selectedOpt.label}</span>
          </div>
          <ChevronDown size={16} color="#64748b" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </div>

        {/* Gear button → mở BaseModal quản lý */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsManageModalOpen(true); cancelEdit(); }}
          title="Quản lý danh sách tình trạng sức khỏe"
          style={{
            padding: "0 12px",
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            background: isManageModalOpen ? "#f5f3ff" : "#f8fafc",
            color: isManageModalOpen ? "var(--primary)" : "#64748b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "42px",
            transition: "all 0.15s",
          }}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* ── SELECT Dropdown (Portal) ── */}
      {isOpen && rect && createPortal(
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={() => setIsOpen(false)} />
          <div style={{
            position: "fixed",
            top: rect.bottom + 4,
            left: rect.left,
            width: Math.max(rect.width, 240),
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            zIndex: 99999,
            padding: "4px",
            maxHeight: "260px",
            overflowY: "auto",
          }}>
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: value === opt.value ? "#f1f5f9" : "transparent",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseOut={(e) => (e.currentTarget.style.background = value === opt.value ? "#f1f5f9" : "transparent")}
              >
                {opt.color !== "transparent" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: opt.color }} />}
                <span style={{ fontSize: "0.95rem", color: "var(--text-main)", fontWeight: value === opt.value ? 600 : 400, flex: 1 }}>
                  {opt.label}
                </span>
                {value === opt.value && <Check size={14} color="var(--primary)" />}
              </div>
            ))}
          </div>
        </>,
        document.body
      )}

      {/* ── MANAGE Modal ── */}
      <BaseModal
        isOpen={isManageModalOpen}
        onClose={() => { setIsManageModalOpen(false); cancelEdit(); }}
        title="Quản lý Tình trạng Sức khỏe"
        confirmText="Xong"
        onConfirm={() => { setIsManageModalOpen(false); cancelEdit(); }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Danh sách options hiện có */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {options.map((opt) => (
              editingId === opt.value ? (
                /* ── Inline edit form ── */
                <div key={opt.value} style={{ padding: "12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #c7d2fe" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: editColor, flexShrink: 0 }} />
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", background: "#fff" }}
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                    />
                    <button onClick={saveEdit} disabled={!editLabel.trim()} style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: 600 }}>
                      <Check size={15} />
                    </button>
                    <button onClick={cancelEdit} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#64748b" }}>
                      <X size={15} />
                    </button>
                  </div>
                  {/* Color picker */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {HEALTH_COLORS.map((c) => (
                      <div
                        key={c}
                        onClick={() => setEditColor(c)}
                        style={{
                          width: "26px", height: "26px", borderRadius: "50%", background: c, cursor: "pointer",
                          border: editColor === c ? "2.5px solid #1e293b" : "2px solid rgba(0,0,0,0.08)",
                          boxShadow: editColor === c ? "0 0 0 2px white inset" : "none",
                          transform: editColor === c ? "scale(1.15)" : "scale(1)",
                          transition: "all 0.15s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* ── Normal row ── */
                <div key={opt.value} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: opt.color }} />
                    <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>{opt.label}</span>
                    {opt.isBuiltIn && (
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8", background: "#f1f5f9", padding: "1px 6px", borderRadius: "4px" }}>mặc định</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => startEdit(opt)} style={{ background: "#eef2ff", border: "none", cursor: "pointer", color: "#6366f1", padding: "6px 8px", borderRadius: "6px" }} title="Sửa">
                      <Pencil size={14} />
                    </button>
                    {!opt.isBuiltIn && (
                      <button onClick={() => deleteOption(opt.value)} style={{ background: "#fff0f0", border: "none", cursor: "pointer", color: "#ef4444", padding: "6px 8px", borderRadius: "6px" }} title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Add new section */}
          {isAddingNew ? (
            <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: "10px", border: "1px solid #86efac" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: editColor, flexShrink: 0 }} />
                <input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Tên trạng thái mới..."
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", background: "#fff" }}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                />
                <button onClick={saveEdit} disabled={!editLabel.trim()} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>
                  <Check size={15} />
                </button>
                <button onClick={cancelEdit} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#64748b" }}>
                  <X size={15} />
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {HEALTH_COLORS.map((c) => (
                  <div key={c} onClick={() => setEditColor(c)} style={{ width: "26px", height: "26px", borderRadius: "50%", background: c, cursor: "pointer", border: editColor === c ? "2.5px solid #1e293b" : "2px solid rgba(0,0,0,0.08)", boxShadow: editColor === c ? "0 0 0 2px white inset" : "none", transform: editColor === c ? "scale(1.15)" : "scale(1)", transition: "all 0.15s" }} />
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={startAddNew}
              style={{ padding: "10px", borderRadius: "10px", border: "1.5px dashed #c7d2fe", background: "#f5f3ff", color: "var(--primary)", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <Plus size={16} /> Thêm trạng thái mới
            </button>
          )}
        </div>
      </BaseModal>
    </div>
  );
};

interface ResidentHeaderProps {
  resident: Resident | undefined;
}

export const ResidentHeader: React.FC<ResidentHeaderProps> = ({ resident }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [displayResident, setDisplayResident] = useState<Resident | undefined>(resident);
  const [formData, setFormData] = useState<Partial<Resident>>({});

  // Sync displayResident if resident prop changes (e.g. navigation)
  useEffect(() => {
    setDisplayResident(resident);
  }, [resident]);

  const handleOpenModal = () => {
    if (displayResident) {
      setFormData(displayResident);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDirty(false);
  };

  const handleConfirm = () => {
    if (displayResident) {
      setDisplayResident({ ...displayResident, ...formData });
      if (resident) {
        // Also mutate the original mock object so it persists across local tab switching
        Object.assign(resident, formData);
      }
    }
    setIsModalOpen(false);
    setIsDirty(false);
  };

  // Helper to get age
  const getAge = (dob: string) => {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  return (
    <>
      {/* 
        Rich Premium Header 
        - Banner Background with subtle pattern
        - Frosted Glass Overlay Card
        - Clickable to edit (similar to StaffHeader)
      */}
      <div 
        style={{ 
          flexShrink: 0, 
          position: "relative",
          margin: "1rem 1.5rem 0.5rem 1.5rem",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          cursor: displayResident ? "pointer" : "default",
          transition: "transform 0.2s, box-shadow 0.2s",
          background: "#ffffff"
        }}
        onClick={handleOpenModal}
        onMouseOver={(e) => {
          if (displayResident) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.1)";
          }
        }}
        onMouseOut={(e) => {
          if (displayResident) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
          }
        }}
        title="Nhấn để chỉnh sửa thông tin hồ sơ"
      >
        
        {/* Abstract Cover Banner */}
        <div style={{ 
          height: "140px", 
          width: "100%", 
          background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)", // Premium Deep Indigo/Royal Blue
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Subtle Premium Overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.05) 0%, transparent 40%)",
          }} />
          
          {/* Top Actions */}
          <div style={{ 
            position: "absolute", top: "1.25rem", left: "1.5rem", right: "1.5rem", 
            display: "flex", justifyContent: "space-between", zIndex: 10 
          }}>
            <BaseButton variant="outline" size="sm" 
              onClick={(e) => { e.stopPropagation(); navigate("/elderly/list"); }} 
              style={{ background: "rgba(255,255,255,0.9)", border: "none", color: "#1e293b", fontWeight: 600, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
            >
              <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Quay lại
            </BaseButton>
            {/* Nút lưu đã bị loại bỏ theo yêu cầu */}
          </div>
        </div>

        {/* Content Container (Overlapping the banner slightly) */}
        <div style={{ 
          display: "flex", 
          padding: "0 2rem 1.5rem 2rem", 
          marginTop: "-60px", // Pull up over the banner
          position: "relative",
          zIndex: 5
        }}>
          
          {/* Avatar Area */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "2rem" }}>
            <div style={{ position: "relative" }}>
              {displayResident ? (
                <img 
                  src={displayResident.avatar} 
                  alt="Avatar" 
                  style={{ 
                    width: "140px", height: "140px", borderRadius: "20px", objectFit: "cover", 
                    border: "6px solid #ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    background: "#ffffff"
                  }} 
                />
              ) : (
                <div style={{ 
                  width: "140px", height: "140px", borderRadius: "20px", background: "#f8fafc", 
                  border: "6px solid #ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", 
                  display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                  <UserSquare2 size={48} color="#cbd5e1" />
                </div>
              )}
            </div>
            {/* Status Badge */}
            {displayResident && (
              <div style={{ 
                marginTop: "-15px",
                zIndex: 10,
                background: (displayResident as any).healthColor ? `${(displayResident as any).healthColor}20` : (displayResident.healthStatus === "critical" ? "#fee2e2" : displayResident.healthStatus === "attention" ? "#fef3c7" : "#d1fae5"),
                color: (displayResident as any).healthColor || (displayResident.healthStatus === "critical" ? "#b91c1c" : displayResident.healthStatus === "attention" ? "#b45309" : "#047857"),
                padding: "4px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>
                <Activity size={14} /> 
                {displayResident.healthStatus === "critical" ? "Nguy kịch" : displayResident.healthStatus === "attention" ? "Cần chú ý" : displayResident.healthStatus === "normal" ? "Ổn định" : displayResident.healthStatus}
              </div>
            )}
          </div>

          {/* Info Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: "60px" }}>
            
            {/* Title Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                  {displayResident ? displayResident.fullName : "Tiếp nhận Cư dân mới"}
                </h1>
                {displayResident && (
                  <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 500 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Contact size={16} /> Mã: <strong style={{ color: "var(--text-main)" }}>{displayResident.code}</strong>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <BedDouble size={16} /> Giường: <strong style={{ color: "var(--text-main)" }}>{(displayResident as any).room || "A-101"}</strong>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Calendar size={16} /> Tuổi: <strong style={{ color: "var(--text-main)" }}>{getAge(displayResident.dateOfBirth)}</strong>
                    </span>
                  </div>
                )}
              </div>
              
              {displayResident && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <div style={{ 
                    background: displayResident.status === "active" ? "#dcfce7" : "#f1f5f9", 
                    color: displayResident.status === "active" ? "#166534" : "#475569", 
                    padding: "6px 16px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: 700 
                  }}>
                    {displayResident.status === "active" ? "Đang lưu trú" : displayResident.status === "hospitalized" ? "Nhập viện" : "Khác"}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--primary-dark)", fontWeight: 600, background: "#e0e7ff", padding: "4px 12px", borderRadius: "12px" }}>
                    {displayResident.servicePackage || "Gói Chăm sóc Cơ bản"}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Edit Modal (Premium Style) */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Chỉnh sửa Hồ sơ Cư dân"
        confirmText="Lưu thay đổi"
        onConfirm={handleConfirm}
        isDirty={isDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Avatar Banner Header (Inside Modal - Full Bleed) */}
          <div style={{ 
            position: "relative", 
            margin: "-1.5rem -1.5rem 2rem -1.5rem", // Negative margin to bleed to the edges of modalBody
            background: "#f8fafc",
            overflow: "hidden",
            borderBottom: "1px solid #e2e8f0"
          }}>
            {/* Modal Banner Background */}
            <div style={{ 
              height: "120px", 
              background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)",
              width: "100%",
              position: "relative"
            }}>
              {/* Subtle pattern for infinity feel */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 60%)",
              }} />
            </div>
            
            {/* Center Avatar Editor */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "-50px", paddingBottom: "1rem" }}>
              <label 
                style={{ position: "relative", cursor: "pointer", display: "inline-block" }} 
                title="Nhấn để đổi ảnh đại diện"
              >
                <img 
                  src={formData.avatar || "https://loremflickr.com/150/150/elderly,portrait,person/all?lock=999"} 
                  alt="Avatar Preview" 
                  style={{ 
                    width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", 
                    border: "5px solid #ffffff", boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    background: "#ffffff"
                  }} 
                />
                <div style={{
                  position: "absolute", bottom: "5px", right: "5px",
                  background: "var(--primary)", color: "white",
                  borderRadius: "50%", padding: "8px", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)", border: "3px solid #ffffff",
                }}>
                  <UserSquare2 size={16} />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const fileUrl = URL.createObjectURL(e.target.files[0]);
                      setFormData({ ...formData, avatar: fileUrl });
                      setIsDirty(true);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <BaseInput
            label="Họ và tên *"
            defaultValue={formData.fullName || ""}
            onChange={(e: any) => {
              setFormData({ ...formData, fullName: e.target.value });
              setIsDirty(true);
            }}
          />

          <BaseSelect
            label="Giới tính *"
            defaultValue={formData.gender || ""}
            options={[
              { label: "Nam", value: "male" },
              { label: "Nữ", value: "female" },
            ]}
            onChange={(e) => {
              setFormData({ ...formData, gender: e.target.value as any });
              setIsDirty(true);
            }}
          />

          <BaseSelect
            label="Trạng thái lưu trú"
            defaultValue={formData.status || ""}
            options={[
              { label: "Đang lưu trú", value: "active" },
              { label: "Nhập viện", value: "hospitalized" },
              { label: "Về nhà phép", value: "leave" },
              { label: "Đã xuất viện", value: "discharged" },
            ]}
            onChange={(e) => {
              setFormData({ ...formData, status: e.target.value as any });
              setIsDirty(true);
            }}
          />

          {/* Health Status Picker */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <CustomHealthSelect
              value={["normal", "attention", "critical"].includes(formData.healthStatus || "normal") ? (formData.healthStatus as string) : "custom"}
              onChange={(val) => {
                if (val === "custom") {
                  setFormData({ ...formData, healthStatus: "Cách ly", healthColor: "#8b5cf6" });
                } else {
                  setFormData({ ...formData, healthStatus: val, healthColor: undefined });
                }
                setIsDirty(true);
              }}
            />
            
            {formData.healthStatus !== undefined && !["normal", "attention", "critical"].includes(formData.healthStatus) && (
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", marginTop: "0.25rem", padding: "1rem", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                <div style={{ flex: 1 }}>
                  <BaseInput
                    label="Tên trạng thái tùy chỉnh"
                    value={formData.healthStatus}
                    onChange={(e: any) => {
                      setFormData({ ...formData, healthStatus: e.target.value });
                      setIsDirty(true);
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Màu sắc hiển thị</label>
                  <div style={{ 
                    display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "6px", width: "100%" 
                  }}>
                    {[
                      "#ef4444", "#f97316", "#f59e0b", "#eab308", 
                      "#84cc16", "#22c55e", "#10b981", "#14b8a6",
                      "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
                      "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"
                    ].map(color => (
                      <div 
                        key={color}
                        onClick={() => {
                          setFormData({ ...formData, healthColor: color });
                          setIsDirty(true);
                        }}
                        title={color}
                        style={{
                          width: "24px", height: "24px", borderRadius: "50%", 
                          background: color, cursor: "pointer",
                          border: formData.healthColor === color ? "3px solid #1e293b" : "1px solid rgba(0,0,0,0.1)",
                          boxShadow: formData.healthColor === color ? "0 0 0 2px #ffffff inset" : "none",
                          transform: formData.healthColor === color ? "scale(1.1)" : "scale(1)",
                          transition: "all 0.2s ease"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </BaseModal>
    </>
  );
};
