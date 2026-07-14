import { useState, useRef, useCallback } from "react";

export interface UseCatalogImagesReturn {
  images: string[];
  lightboxIdx: number | null;
  setLightboxIdx: (idx: number | null) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (idx: number) => void;
  /** Đặt lại danh sách ảnh (dùng khi mở modal với item có sẵn) */
  resetImages: (initial?: string[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * Hook quản lý ảnh cho catalog modals.
 * Gộp: upload, xoá, lightbox, blob URL cleanup.
 */
export const useCatalogImages = (): UseCatalogImagesReturn => {
  const [images, setImages] = useState<string[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newUrls = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newUrls]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const removeImage = useCallback((idx: number) => {
    setImages((prev) => {
      if (prev[idx]?.startsWith("blob:")) URL.revokeObjectURL(prev[idx]);
      const next = prev.filter((_, i) => i !== idx);
      // Điều chỉnh lightboxIdx nếu đang xem ảnh bị xóa
      setLightboxIdx((li) => {
        if (li === null) return null;
        if (next.length === 0) return null;
        return Math.min(li, next.length - 1);
      });
      return next;
    });
  }, []);

  const resetImages = useCallback((initial?: string[]) => {
    setImages(initial ?? []);
    setLightboxIdx(null);
  }, []);

  return { images, lightboxIdx, setLightboxIdx, handleFileSelect, removeImage, resetImages, fileInputRef };
};
