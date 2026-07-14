import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { CatalogAvatar } from "../../../../shared/components/CatalogAvatar";
import { formatCurrencyShort } from "../../../../shared/utils/format";;

export interface MonogramOption {
  id: string;
  name: string;
  billingPrice: number;
  unit?: string;
  images?: string[];
}

interface MonogramSelectProps {
  options: MonogramOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  accent: string;
}

/**
 * Custom dropdown với avatar ảnh/monogram.
 * Render qua portal để thoát overflow:hidden của modal.
 * Được định nghĩa ở module-level để tránh re-mount khi parent re-render.
 */
export const MonogramSelect: React.FC<MonogramSelectProps> = ({
  options, value, onChange, placeholder, accent,
}) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const selected = options.find((o) => o.id === value);

  const toggle = () => {
    if (!open && btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    setOpen((v) => !v);
  };

  const dropdown = open && rect ? createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 10000 }} onClick={() => setOpen(false)} />
      <div style={{
        position: "fixed", top: rect.bottom + 4, left: rect.left, width: rect.width,
        zIndex: 10001, background: "#fff", border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)", boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        overflow: "hidden", maxHeight: 240, overflowY: "auto",
      }}>
        {options.length === 0 ? (
          <div style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
            Không có mục nào
          </div>
        ) : options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => { onChange(opt.id); setOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0.75rem", cursor: "pointer", background: "transparent", borderBottom: "1px solid var(--border)", transition: "background .12s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--background-alt, #f8fafc)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            <CatalogAvatar name={opt.name} images={opt.images} accent={accent} size={32} fontSize="0.62rem" borderRadius={8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {opt.name}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                {formatCurrencyShort(opt.billingPrice)}{opt.unit ? `/${opt.unit}` : "/phòng"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      {dropdown}
      <button
        ref={btnRef}
        onClick={toggle}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "0.5rem 0.75rem", background: "#fff", border: `1px solid ${open ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-family)", textAlign: "left", transition: "border-color .2s" }}
      >
        {selected ? (
          <>
            <CatalogAvatar name={selected.name} images={selected.images} accent={accent} size={24} fontSize="0.52rem" borderRadius={5} />
            <span style={{ fontSize: "0.85rem", fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-main)" }}>
              {selected.name}
            </span>
          </>
        ) : (
          <span style={{ fontSize: "0.85rem", flex: 1, color: "var(--text-muted)" }}>{placeholder}</span>
        )}
        <ChevronDown size={14} style={{ flexShrink: 0, color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
    </>
  );
};
