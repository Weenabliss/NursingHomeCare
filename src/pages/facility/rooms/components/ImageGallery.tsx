import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { X, ImagePlus, ChevronLeft, ChevronRight } from "lucide-react";

export interface ImageGalleryProps {
  images: string[];
  lightboxIdx: number | null;
  setLightboxIdx: (idx: number | null) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (idx: number) => void;
  label?: string;
  /** Số cột cho lưới thumbnail, mặc định 5 */
  columns?: number;
  /** Aspect ratio của mỗi thumbnail, mặc định "1" (vuông) */
  gridAspectRatio?: string;
}

/**
 * ImageGallery — hiển thị lưới ảnh, nút upload, lightbox fullscreen.
 * Dùng chung cho: EquipmentCatalogModal, SubRoomCatalogModal, RoomTypeModal.
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  lightboxIdx,
  setLightboxIdx,
  onFileSelect,
  onRemove,
  label = "Hình ảnh",
  columns = 5,
  gridAspectRatio = "1",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const go = (d: number) => {
    if (lightboxIdx === null) return;
    setLightboxIdx(((lightboxIdx + d) + images.length) % images.length);
  };

  /* ── Lightbox ────────────────────────────────────────────────────── */
  const lightbox = lightboxIdx !== null && images.length > 0
    ? createPortal(
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={20} />
          </button>

          <img
            src={images[lightboxIdx]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 30px 100px rgba(0,0,0,0.7)" }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "#fff", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "#fff", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 20, padding: "0.25rem 0.85rem", fontSize: "0.8rem", fontWeight: 600 }}>
            {lightboxIdx + 1} / {images.length}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {lightbox}

      <div>
        {/* Header: label + upload button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <label style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-main)" }}>
            {label}
          </label>
          <label
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0.35rem 0.8rem", background: "var(--primary)", color: "#fff", borderRadius: "var(--radius-full)", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", boxShadow: "var(--shadow-sm)", border: "1px solid transparent", fontFamily: "var(--font-family)", transition: "background var(--transition-fast)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.background = "var(--primary-dark, #4f46e5)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.background = "var(--primary)"; }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={onFileSelect} />
            <ImagePlus size={13} /> Thêm ảnh
          </label>
        </div>

        {/* Empty state: drag/drop zone */}
        {images.length === 0 ? (
          <label
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, height: 90, border: "2px dashed #635bff55", borderRadius: "var(--radius-md)", background: "linear-gradient(160deg,#f5f3ff,#eef2ff)", cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "#635bff"; el.style.background = "linear-gradient(160deg,#ede9fe,#e0e7ff)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "#635bff55"; el.style.background = "linear-gradient(160deg,#f5f3ff,#eef2ff)"; }}
          >
            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={onFileSelect} />
            <ImagePlus size={22} color="#635bff" />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#635bff" }}>Bấm để chọn ảnh từ máy tính</span>
          </label>
        ) : (
          <div>
            {/* Thumbnail grid */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 6 }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  style={{ position: "relative", aspectRatio: gridAspectRatio, borderRadius: "var(--radius-md)", overflow: "hidden", border: "2px solid var(--border)", cursor: "zoom-in" }}
                  onClick={() => setLightboxIdx(idx)}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div
                    style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 3, transition: "background .15s" }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(0,0,0,0.25)"; const btn = el.querySelector("button") as HTMLButtonElement; if (btn) btn.style.opacity = "1"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(0,0,0,0)"; const btn = el.querySelector("button") as HTMLButtonElement; if (btn) btn.style.opacity = "0"; }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                      style={{ opacity: 0, background: "rgba(239,68,68,0.9)", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "opacity .15s" }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", textAlign: "right", margin: "4px 0 0" }}>
              {images.length} ảnh · click để xem to
            </p>
          </div>
        )}
      </div>
    </>
  );
};
