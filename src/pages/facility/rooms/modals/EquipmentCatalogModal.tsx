import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Info } from "lucide-react";
import { BaseModal } from "../../../../components/atoms/BaseModal";
import { BaseInput } from "../../../../components/atoms/BaseInput";
import { BaseButton } from "../../../../components/atoms/BaseButton";
import type { EquipmentCatalog } from "../../../../mock/facility";
import { useActivityLog } from "../../../../hooks/useActivityLog";
import { useCatalogImages } from "../../../../hooks/useCatalogImages";
import { ImageGallery } from "../components/ImageGallery";

const UNIT_OPTIONS = ["cái", "bộ", "chiếc", "máy", "giường", "bình", "hộp", "cuộn", "m²", "set", "Khác..."];
const PRESET_UNITS = ["cái", "bộ", "chiếc", "máy", "giường", "bình", "hộp", "cuộn", "m²", "set"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: EquipmentCatalog) => void;
  onDelete: (id: string) => void;
  editingItem: EquipmentCatalog | null;
}

export const EquipmentCatalogModal: React.FC<Props> = ({
  isOpen, onClose, onSave, onDelete, editingItem,
}) => {
  const { t } = useTranslation();
  const { log } = useActivityLog({ module: "facility" });
  const [isDirty, setIsDirty] = useState(false);
  const [isCustomUnit, setIsCustomUnit] = useState(false);

  const empty = (): Partial<EquipmentCatalog> => ({ name: "", unit: "cái", unitPrice: 0, billingPrice: 0, images: [], description: "" });
  const [form, setForm] = useState<Partial<EquipmentCatalog>>(empty());

  /* Image management via shared hook */
  const { images, lightboxIdx, setLightboxIdx, handleFileSelect, removeImage, resetImages } = useCatalogImages();

  useEffect(() => {
    if (isOpen) {
      setForm(editingItem ? { ...editingItem } : empty());
      setIsDirty(false);
      resetImages(editingItem?.images ?? []);
      setIsCustomUnit(editingItem ? !PRESET_UNITS.includes(editingItem.unit) : false);
    }
  }, [isOpen, editingItem]);

  const upd = (patch: Partial<EquipmentCatalog>) => { setForm((p) => ({ ...p, ...patch })); setIsDirty(true); };

  const handleSave = () => {
    if (!form.name?.trim()) return;
    log("save", editingItem ? "Cập nhật thiết bị catalog" : "Thêm thiết bị catalog", { name: form.name });
    onSave({
      id: editingItem?.id || `EC${Date.now()}`,
      name: form.name!,
      unit: form.unit || "cái",
      unitPrice: Number(form.unitPrice) || 0,
      billingPrice: Number(form.billingPrice) || 0,
      images,
      description: form.description,
    });
    setIsDirty(false);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? t("facility.editEquipmentCatalog") : t("facility.addEquipmentCatalog")}
      onConfirm={handleSave}
      confirmText={t("common.save")}
      isDirty={isDirty}
      maxWidth="560px"
      footerLeftContent={
        editingItem ? (
          <BaseButton variant="danger" onClick={() => onDelete(editingItem.id)}>
            <Trash2 size={15} /> {t("common.delete")}
          </BaseButton>
        ) : null
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
        <BaseInput
          label={t("facility.equipmentName")}
          value={form.name || ""}
          onChange={(e) => upd({ name: e.target.value })}
          placeholder="VD: Giường bệnh đa chức năng"
          required
        />

        {/* Đơn vị — select + optional custom input */}
        <div>
          <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-main)", marginBottom: 6 }}>
            {t("facility.unit")}
          </label>
          <select
            value={isCustomUnit ? "Khác..." : (form.unit || "cái")}
            onChange={(e) => {
              if (e.target.value === "Khác...") { setIsCustomUnit(true); upd({ unit: "" }); }
              else { setIsCustomUnit(false); upd({ unit: e.target.value }); }
            }}
            style={{ width: "100%", padding: "0.55rem 0.75rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-family)", color: "var(--text-main)", outline: "none", cursor: "pointer", appearance: "auto" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          >
            {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          {isCustomUnit && (
            <input
              type="text" autoFocus placeholder="Nhập đơn vị tùy chỉnh..."
              value={form.unit || ""}
              onChange={(e) => upd({ unit: e.target.value })}
              style={{ width: "100%", marginTop: 8, padding: "0.55rem 0.75rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-family)", color: "var(--text-main)", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          )}
        </div>

        {/* Prices */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
          <div>
            <BaseInput type="number" label={t("facility.billingPrice")} value={form.billingPrice?.toString() || "0"} onChange={(e) => upd({ billingPrice: Number(e.target.value) })} min={0} />
            <p style={{ fontSize: "0.68rem", color: "var(--primary)", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
              <Info size={10} /> Tính vào đơn giá phòng / tháng
            </p>
          </div>
          <div>
            <BaseInput type="number" label={t("facility.unitPrice")} value={form.unitPrice?.toString() || "0"} onChange={(e) => upd({ unitPrice: Number(e.target.value) })} min={0} />
            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
              <Info size={10} /> Tham khảo khi thiết bị hỏng
            </p>
          </div>
        </div>

        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-main)", marginBottom: "0.5rem" }}>
            {t("facility.description")}
          </label>
          <textarea
            rows={2}
            value={form.description || ""}
            onChange={(e) => upd({ description: e.target.value })}
            placeholder="Mô tả ngắn về thiết bị..."
            style={{ padding: "0.6rem 0.875rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-family)", fontSize: "var(--text-sm)", resize: "none", color: "var(--text-main)", background: "#ffffff", outline: "none", transition: "border-color .2s" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Image Gallery */}
        <ImageGallery
          images={images}
          lightboxIdx={lightboxIdx}
          setLightboxIdx={setLightboxIdx}
          onFileSelect={(e) => { handleFileSelect(e); setIsDirty(true); }}
          onRemove={(idx) => { removeImage(idx); setIsDirty(true); }}
          label={t("facility.images")}
        />
      </div>
    </BaseModal>
  );
};
