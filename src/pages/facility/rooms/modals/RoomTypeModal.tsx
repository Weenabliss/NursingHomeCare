import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Zap, DollarSign, Trash2, Check } from "lucide-react";
import { BaseModal } from "../../../../shared/components/BaseModal";
import { BaseInput } from "../../../../shared/components/BaseInput";
import { BaseButton } from "../../../../shared/components/BaseButton";
import type { RoomType, EquipmentCatalog, SubRoomCatalog, PriceMode } from "../../../../mock/facility";
import { calcRoomTypePrice, PREDEFINED_COLORS } from "../../../../utils/facilityUtils";
import { formatCurrency, formatCurrencyShort } from "../../../../shared/utils/format";;
import { useActivityLog } from "../../../../shared/hooks/useActivityLog";
import { useCatalogImages } from "../../../../hooks/useCatalogImages";
import { ImageGallery } from "../components/ImageGallery";
import { EquipmentPanel } from "./EquipmentPanel";
import { SubRoomPanel } from "./SubRoomPanel";

/* ─────────────────────────────────────────────────────────────────────────── */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: RoomType) => void;
  onDelete: (id: string) => void;
  editingType: RoomType | null;
  equipmentCatalog: EquipmentCatalog[];
  subRoomCatalog: SubRoomCatalog[];
  roomTypes?: RoomType[];
}

const emptyForm = (): Partial<RoomType> => ({
  name: "", capacity: 1, area: 0,
  basePrice: 0, priceMode: "auto", fixedPrice: undefined,
  description: "", equipments: [], subRooms: [],
});

/* ── ColTitle: accent bar + uppercase label ─────────────────────────────── */
const ColTitle: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexShrink: 0 }}>
    <div style={{ width: 3, height: 14, borderRadius: 2, background: accent, flexShrink: 0 }} />
    <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
      {label}
    </span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────── */
export const RoomTypeModal: React.FC<Props> = ({
  isOpen, onClose, onSave, onDelete, editingType, equipmentCatalog, subRoomCatalog, roomTypes = [],
}) => {
  const { t } = useTranslation();
  const { log } = useActivityLog({ module: "facility" });

  const [isDirty, setIsDirty] = useState(false);
  const [form, setForm] = useState<Partial<RoomType>>(emptyForm());
  const [selectedEqId, setSelectedEqId] = useState("");
  const [selectedSrId, setSelectedSrId] = useState("");

  /* Image management via shared hook */
  const { images, lightboxIdx, setLightboxIdx, handleFileSelect, removeImage, resetImages } = useCatalogImages();

  /* ── Color logic ────────────────────────────────────────────────────── */
  const usedColors = useMemo(() => {
    return roomTypes
      .filter((r) => r.id !== editingType?.id)
      .map((r) => r.color?.toLowerCase())
      .filter(Boolean);
  }, [roomTypes, editingType]);

  useEffect(() => {
    if (isOpen) {
      if (editingType) {
        setForm({ ...editingType });
      } else {
        const firstUnused = PREDEFINED_COLORS.find(c => !usedColors.includes(c.toLowerCase()));
        setForm({ ...emptyForm(), color: firstUnused || PREDEFINED_COLORS[0] });
      }
      setSelectedEqId(""); setSelectedSrId("");
      setIsDirty(false);
      resetImages(editingType?.images ?? []);
    }
  }, [isOpen, editingType, usedColors]);

  const upd = (patch: Partial<RoomType>) => { setForm((p) => ({ ...p, ...patch })); setIsDirty(true); };

  /* ── Price ──────────────────────────────────────────────────────────── */
  const price = useMemo(
    () => calcRoomTypePrice(
      { basePrice: form.basePrice || 0, priceMode: form.priceMode || "auto", fixedPrice: form.fixedPrice, equipments: form.equipments || [], subRooms: form.subRooms || [] },
      equipmentCatalog, subRoomCatalog
    ),
    [form.basePrice, form.priceMode, form.fixedPrice, form.equipments, form.subRooms, equipmentCatalog, subRoomCatalog]
  );

  /* ── Equipment handlers ─────────────────────────────────────────────── */
  const availableEq = equipmentCatalog.filter((c) => !(form.equipments || []).some((e) => e.catalogId === c.id));
  const addEquipment = () => { if (!selectedEqId) return; upd({ equipments: [...(form.equipments || []), { catalogId: selectedEqId, quantity: 1 }] }); setSelectedEqId(""); };
  const updateEqQty = (id: string, qty: number) => upd({ equipments: (form.equipments || []).map((e) => e.catalogId === id ? { ...e, quantity: Math.max(1, qty) } : e) });
  const removeEq = (id: string) => upd({ equipments: (form.equipments || []).filter((e) => e.catalogId !== id) });

  /* ── Sub-room handlers ──────────────────────────────────────────────── */
  const availableSr = subRoomCatalog.filter((c) => !(form.subRooms || []).some((s) => s.catalogId === c.id));
  const addSubRoom = () => { if (!selectedSrId) return; upd({ subRooms: [...(form.subRooms || []), { catalogId: selectedSrId, quantity: 1 }] }); setSelectedSrId(""); };
  const updateSrQty = (id: string, qty: number) => upd({ subRooms: (form.subRooms || []).map((s) => s.catalogId === id ? { ...s, quantity: Math.max(1, qty) } : s) });
  const removeSr = (id: string) => upd({ subRooms: (form.subRooms || []).filter((s) => s.catalogId !== id) });

  /* ── Save ───────────────────────────────────────────────────────────── */
  const handleSave = () => {
    if (!form.name?.trim()) return;
    log("save", editingType ? "Cập nhật loại phòng" : "Thêm loại phòng mới", { roomTypeName: form.name, totalPrice: price.totalPrice });
    onSave({
      id: editingType?.id || `RT${Date.now()}`,
      name: form.name!, capacity: Number(form.capacity) || 1,
      area: Number(form.area) || 0, basePrice: Number(form.basePrice) || 0,
      priceMode: form.priceMode || "auto", fixedPrice: form.fixedPrice,
      color: form.color,
      images, description: form.description || "",
      equipments: form.equipments || [], subRooms: form.subRooms || [],
    });
    setIsDirty(false);
  };

  /* ── Price bar ──────────────────────────────────────────────────────── */
  const isFixed = price.priceMode === "fixed";

  /* ─────────────────────────────────────────────────────────────────── */
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingType ? t("facility.editRoomType") : t("facility.addRoomType")}
      onConfirm={handleSave}
      confirmText={t("common.save")}
      isDirty={isDirty}
      maxWidth="min(1440px, 96vw)"
      noPadding
      footerLeftContent={
        editingType ? (
          <BaseButton variant="danger" onClick={() => onDelete(editingType.id)}>
            <Trash2 size={15} /> {t("common.delete")}
          </BaseButton>
        ) : null
      }
    >
      {/* Root flex column */}
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

        {/* ── Price bar ────────────────────────────────────────────────── */}
        <div style={{ padding: "0.6rem 1.25rem", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: isFixed ? "linear-gradient(90deg,#d9770612,#d9770606)" : "linear-gradient(90deg,#635bff12,#635bff06)", border: `1px solid ${isFixed ? "#d9770628" : "#635bff28"}`, borderRadius: "var(--radius-md)", padding: "0.55rem 1.1rem" }}>
            {!isFixed ? (
              <>
                {([["Cơ bản", price.basePrice, "#635bff"], ["Thiết bị", price.equipmentTotal, "#16a34a"], ["Phòng con", price.subRoomTotal, "#d97706"]] as [string, number, string][]).map(([lbl, val, c], i, arr) => (
                  <React.Fragment key={lbl}>
                    <div>
                      <div style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>{lbl}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: c }}>{formatCurrencyShort(val)}</div>
                    </div>
                    {i < arr.length - 1 && <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>+</span>}
                  </React.Fragment>
                ))}
                <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>=</span>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 700, color: "#d97706", textTransform: "uppercase" }}>
                <DollarSign size={13} /> Giá cố định
              </div>
            )}
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Tổng đơn giá</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: isFixed ? "#d97706" : "#635bff" }}>{formatCurrency(price.totalPrice)}</div>
            </div>
          </div>
        </div>

        {/* ── 3-column body ─────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", flex: 1, minHeight: 0, overflow: "hidden" }}>

          {/* ╔══════════════════╗
              ║  COL 1 — Info   ║
              ╚══════════════════╝ */}
          <div style={{ borderRight: "1px solid var(--border)", padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: "var(--spacing-md)", overflowY: "auto" }}>
            <ColTitle label="Thông tin cơ bản" accent="var(--primary)" />

            <BaseInput
              label={t("facility.roomTypeName")}
              value={form.name || ""}
              onChange={(e) => upd({ name: e.target.value })}
              placeholder="VD: Phòng VIP Đơn..."
              required
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <BaseInput type="number" label={t("facility.capacity")} value={form.capacity?.toString() || "1"} onChange={(e) => upd({ capacity: Number(e.target.value) })} min={1} />
              <BaseInput type="number" label={t("facility.area")} value={form.area?.toString() || "0"} onChange={(e) => upd({ area: Number(e.target.value) })} min={0} />
            </div>

            {/* Color Picker */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-main)" }}>Màu nhận diện</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {PREDEFINED_COLORS.map((c) => {
                  const isSelected = form.color === c;
                  const isUsed = usedColors.includes(c.toLowerCase());
                  return (
                    <button
                      key={c}
                      onClick={() => !isUsed && upd({ color: c })}
                      disabled={isUsed}
                      style={{
                        width: 28, height: 28, borderRadius: "50%", background: c, border: isSelected ? "2px solid #000" : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: isUsed ? "not-allowed" : "pointer", opacity: isUsed && !isSelected ? 0.3 : 1, transition: "transform 0.1s, opacity 0.2s"
                      }}
                      onMouseEnter={(e) => { if (!isUsed && !isSelected) e.currentTarget.style.transform = "scale(1.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                      title={isUsed ? "Màu này đã được sử dụng" : ""}
                    >
                      {isSelected && <Check size={14} color="#fff" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-main)" }}>
                {t("facility.description")}
              </label>
              <textarea
                rows={2}
                value={form.description || ""}
                onChange={(e) => upd({ description: e.target.value })}
                placeholder="Mô tả đặc điểm, tiêu chuẩn phục vụ..."
                style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-family)", fontSize: "0.875rem", lineHeight: 1.6, resize: "none", color: "var(--text-main)", background: "#fff", boxSizing: "border-box", outline: "none", transition: "border-color .2s" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Cài đặt giá */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--spacing-md)" }}>
              <ColTitle label="Cài đặt giá" accent="var(--primary)" />

              {/* Auto / Fixed segment control */}
              <div style={{ display: "flex", gap: 3, background: "var(--background-alt)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 3, marginBottom: 10 }}>
                {(["auto", "fixed"] as PriceMode[]).map((m) => {
                  const active = form.priceMode === m;
                  return (
                    <button key={m} onClick={() => upd({ priceMode: m })}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "0.35rem 0", borderRadius: "calc(var(--radius-md) - 2px)", border: "1px solid transparent", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-family)", transition: "all .15s", background: active ? (m === "fixed" ? "var(--warning, #d97706)" : "var(--primary)") : "transparent", color: active ? "#fff" : "var(--text-muted)", boxShadow: active ? "var(--shadow-sm)" : "none" }}
                    >
                      {m === "auto" ? <Zap size={13} /> : <DollarSign size={13} />}
                      {m === "auto" ? "Tự động" : "Cố định"}
                    </button>
                  );
                })}
              </div>

              {form.priceMode === "auto" ? (
                <BaseInput type="number" label={`${t("facility.basePrice")} (VND)`}
                  value={form.basePrice?.toString() || "0"}
                  onChange={(e) => upd({ basePrice: Number(e.target.value) })} min={0} />
              ) : (
                <BaseInput type="number" label="Giá cố định / tháng (VND)"
                  value={form.fixedPrice?.toString() || "0"}
                  onChange={(e) => upd({ fixedPrice: Number(e.target.value) })} min={0} />
              )}
            </div>
          </div>

          {/* ╔══════════════════╗
              ║  COL 2 — Images ║
              ╚══════════════════╝ */}
          <div style={{ borderRight: "1px solid var(--border)", padding: "1rem", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <ColTitle label={t("facility.images")} accent="#0096c7" />
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <ImageGallery
                images={images}
                lightboxIdx={lightboxIdx}
                setLightboxIdx={setLightboxIdx}
                onFileSelect={(e) => { handleFileSelect(e); setIsDirty(true); }}
                onRemove={(idx) => { removeImage(idx); setIsDirty(true); }}
                label=""
                columns={2}
                gridAspectRatio="4/3"
              />
            </div>
          </div>

          {/* ╔══════════════════════════════════╗
              ║  COL 3 — Equipment + Sub-rooms  ║
              ╚══════════════════════════════════╝ */}
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Equipment (top half) */}
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "1rem 1.1rem", borderBottom: "1px solid var(--border)" }}>
              <ColTitle label={t("facility.equipments")} accent="#16a34a" />
              <EquipmentPanel
                availableEq={availableEq}
                equipmentCatalog={equipmentCatalog}
                selections={form.equipments || []}
                selectedId={selectedEqId}
                onSelectChange={setSelectedEqId}
                onAdd={addEquipment}
                onQtyChange={updateEqQty}
                onRemove={removeEq}
                selectPlaceholder={t("facility.selectEquipment")}
                emptyText={t("facility.noEquipmentSelected")}
              />
            </div>

            {/* Sub-rooms (bottom half) */}
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "1rem 1.1rem" }}>
              <ColTitle label={t("facility.subRooms")} accent="#d97706" />
              <SubRoomPanel
                availableSr={availableSr}
                subRoomCatalog={subRoomCatalog}
                selections={form.subRooms || []}
                selectedId={selectedSrId}
                onSelectChange={setSelectedSrId}
                onAdd={addSubRoom}
                onQtyChange={updateSrQty}
                onRemove={removeSr}
                selectPlaceholder={t("facility.selectSubRoom")}
                emptyText={t("facility.noSubRoomSelected")}
              />
            </div>

          </div>
        </div>
      </div>
    </BaseModal>
  );
};
