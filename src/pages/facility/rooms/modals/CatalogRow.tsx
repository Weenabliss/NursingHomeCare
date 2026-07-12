import React from "react";
import { Trash2 } from "lucide-react";
import { CatalogAvatar } from "../../../../components/atoms/CatalogAvatar";
import { formatCurrencyShort } from "../../../../utils/facilityUtils";

interface CatalogRowProps {
  name: string;
  sub: string;
  qty: number;
  subtotal: number;
  accent: string;
  /** URL ảnh đầu tiên của catalog item */
  image?: string;
  onQtyChange: (qty: number) => void;
  onDel: () => void;
}

/**
 * Một hàng catalog item đã chọn: avatar | tên + phụ đề | qty input | subtotal | xóa.
 * Dùng trong EquipmentPanel và SubRoomPanel.
 */
export const CatalogRow: React.FC<CatalogRowProps> = ({
  name, sub, qty, subtotal, accent, image, onQtyChange, onDel,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.35rem 0.5rem", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 4, flexShrink: 0 }}>
    <CatalogAvatar
      name={name}
      images={image ? [image] : undefined}
      accent={accent}
      size={28}
      fontSize="0.55rem"
      borderRadius={7}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}
      </div>
      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{sub}</div>
    </div>
    <input
      type="number"
      value={qty}
      min={1}
      onChange={(e) => onQtyChange(Number(e.target.value))}
      style={{ width: 50, padding: "0.22rem 0.3rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.82rem", fontFamily: "var(--font-family)", textAlign: "center", color: "var(--text-main)", background: "#fff", flexShrink: 0, outline: "none" }}
      onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    />
    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: accent, minWidth: 68, textAlign: "right", flexShrink: 0 }}>
      {formatCurrencyShort(subtotal)}
    </div>
    <button
      onClick={onDel}
      title="Xóa"
      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem", borderRadius: "var(--radius-sm)", display: "flex", flexShrink: 0, transition: "all .15s", lineHeight: 0 }}
      onMouseEnter={(e) => { const b = e.currentTarget; b.style.color = "#ef4444"; b.style.background = "rgba(239,68,68,0.08)"; }}
      onMouseLeave={(e) => { const b = e.currentTarget; b.style.color = "var(--text-muted)"; b.style.background = "none"; }}
    >
      <Trash2 size={14} />
    </button>
  </div>
);
