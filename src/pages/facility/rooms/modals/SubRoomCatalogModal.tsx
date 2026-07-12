import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Info } from "lucide-react";
import { BaseModal } from "../../../../components/atoms/BaseModal";
import { BaseInput } from "../../../../components/atoms/BaseInput";
import { BaseButton } from "../../../../components/atoms/BaseButton";
import type { SubRoomCatalog } from "../../../../mock/facility";
import { useActivityLog } from "../../../../hooks/useActivityLog";
import { useCatalogImages } from "../../../../hooks/useCatalogImages";
import { ImageGallery } from "../components/ImageGallery";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: SubRoomCatalog) => void;
  onDelete: (id: string) => void;
  editingItem: SubRoomCatalog | null;
}

export const SubRoomCatalogModal: React.FC<Props> = ({
  isOpen, onClose, onSave, onDelete, editingItem,
}) => {
  const { t } = useTranslation();
  const { log } = useActivityLog({ module: "facility" });
  const [isDirty, setIsDirty] = useState(false);

  const empty = (): Partial<SubRoomCatalog> => ({ name: "", unitPrice: 0, billingPrice: 0, images: [], description: "" });
  const [form, setForm] = useState<Partial<SubRoomCatalog>>(empty());

  /* Image management via shared hook */
  const { images, lightboxIdx, setLightboxIdx, handleFileSelect, removeImage, resetImages } = useCatalogImages();

  useEffect(() => {
    if (isOpen) {
      setForm(editingItem ? { ...editingItem } : empty());
      setIsDirty(false);
      resetImages(editingItem?.images ?? []);
    }
  }, [isOpen, editingItem]);

  const upd = (patch: Partial<SubRoomCatalog>) => { setForm((p) => ({ ...p, ...patch })); setIsDirty(true); };

  const handleSave = () => {
    if (!form.name?.trim()) return;
    log("save", editingItem ? "Cập nhật phòng con catalog" : "Thêm phòng con catalog", { name: form.name });
    onSave({
      id: editingItem?.id || `SC${Date.now()}`,
      name: form.name!,
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
      title={editingItem ? t("facility.editSubRoomCatalog") : t("facility.addSubRoomCatalog")}
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
          label={t("facility.subRoomName")}
          value={form.name || ""}
          onChange={(e) => upd({ name: e.target.value })}
          placeholder="VD: Phòng tắm, Karaoke, Massage..."
          required
        />

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
              <Info size={10} /> Chi phí xây dựng / tham khảo
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
            placeholder="Mô tả về loại phòng con này..."
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
