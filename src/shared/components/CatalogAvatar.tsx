import React, { useState } from "react";
import { getInitials } from "../../shared/utils/format";
import styles from "./CatalogAvatar.module.scss";

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
        className={styles.image}
        style={{ width: size, height: size, borderRadius }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={styles.fallback}
      style={{
        width: size,
        height: size,
        borderRadius,
        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
        boxShadow: `0 1px 4px ${accent}44`,
      }}
    >
      <span
        className={styles.initials}
        style={{ fontSize }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
};
