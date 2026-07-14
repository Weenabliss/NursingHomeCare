import React from "react";
import { BaseCard } from "../../../../shared/components/BaseCard";
import { CatalogAvatar } from "../../../../shared/components/CatalogAvatar";
import { formatCurrency, formatCurrencyShort } from "../../../../shared/utils/format";;

export interface CatalogCardProps {
  id: string;
  name: string;
  images?: string[];
  description?: string;
  /** Màu gradient cho monogram fallback và badge accent */
  accent: string;
  /** Giá tính vào tiền phòng mỗi tháng */
  billingPrice: number;
  billingLabel: string;
  /** Giá tham khảo (đơn giá tham khảo / chi phí xây dựng) */
  referencePrice: number;
  referenceLabel: string;
  /** Badge hiển thị góc phải trên thumbnail (VD: ID hoặc đơn vị) */
  badge?: string;
  onClick: () => void;
}

/**
 * Generic card cho catalog item (thiết bị / phòng con).
 * - Thumbnail 16:9 với ảnh hoặc monogram fallback
 * - Hover zoom + info section phía dưới
 */
export const CatalogCard: React.FC<CatalogCardProps> = ({
  id, name, images, description, accent,
  billingPrice, billingLabel, referencePrice, referenceLabel,
  badge, onClick,
}) => (
  <BaseCard
    onClick={onClick}
    style={{ padding: 0, cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}
  >
    {/* ── Thumbnail ─────────────────────────────────────────────────── */}
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {images?.[0] ? (
        <img
          src={images[0]}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .35s ease" }}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = "none";
            const parent = img.parentElement;
            if (parent) {
              parent.style.background = `linear-gradient(135deg, ${accent}, ${accent}bb)`;
              const fb = parent.querySelector(".monogram-fb") as HTMLElement;
              if (fb) fb.style.display = "flex";
            }
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CatalogAvatar name={name} accent={accent} size={48} fontSize="1.5rem" borderRadius={12} />
        </div>
      )}

      {/* Monogram fallback (hiện khi ảnh bị lỗi) */}
      <div
        className="monogram-fb"
        style={{ display: "none", position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, alignItems: "center", justifyContent: "center" }}
      >
        <CatalogAvatar name={name} accent={accent} size={48} fontSize="1.5rem" borderRadius={12} />
      </div>

      {/* Badge góc phải trên */}
      {badge && (
        <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", color: "#fff", borderRadius: 20, padding: "0.15rem 0.55rem", fontSize: "0.68rem", fontWeight: 700 }}>
          {badge}
        </div>
      )}
    </div>

    {/* ── Info ──────────────────────────────────────────────────────── */}
    <div style={{ padding: "0.6rem 0.75rem", display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}
      </div>
      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{id}</div>

      {description && (
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "1px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>
          {description}
        </p>
      )}

      <div style={{ marginTop: "auto", paddingTop: "0.4rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{billingLabel}</span>
          <span style={{ fontWeight: 800, color: accent, fontSize: "0.88rem" }}>{formatCurrencyShort(billingPrice)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{referenceLabel}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatCurrency(referencePrice)}</span>
        </div>
      </div>
    </div>
  </BaseCard>
);
