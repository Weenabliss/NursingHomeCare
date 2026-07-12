import React, { useState } from "react";
import { getInitials } from "../../utils/facilityUtils";

export interface CatalogAvatarProps {
  /** Tên hiển thị (dùng để tạo monogram fallback) */
  name: string;
  /** Mảng URL ảnh — chỉ lấy ảnh đầu tiên */
  images?: string[];
  /** Màu gradient cho monogram fallback */
  accent: string;
  /** Kích thước avatar (px), mặc định 28 */
  size?: number;
  /** Font-size cho chữ monogram, mặc định "0.6rem" */
  fontSize?: string;
  /** Border-radius (px), mặc định 7 */
  borderRadius?: number;
}

/**
 * Avatar hiển thị ảnh đầu tiên từ `images[]`.
 * Nếu không có ảnh hoặc ảnh bị lỗi → hiển thị monogram gradient.
 */
export const CatalogAvatar: React.FC<CatalogAvatarProps> = ({
  name,
  images,
  accent,
  size = 28,
  fontSize = "0.6rem",
  borderRadius = 7,
}) => {
  const [imgError, setImgError] = useState(false);

  if (images?.[0] && !imgError) {
    return (
      <img
        src={images[0]}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius,
          objectFit: "cover",
          flexShrink: 0,
          border: "1px solid var(--border)",
        }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 1px 4px ${accent}44`,
      }}
    >
      <span
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize,
          letterSpacing: "0.02em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
};
