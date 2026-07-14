/** Format tiền tệ VND */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

/** Format gọn (triệu đồng) nếu >= 1 triệu */
export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)} triệu`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return `${amount.toLocaleString("vi-VN")} ₫`;
};

/**
 * Lấy chữ viết tắt từ tên (tối đa 4 ký tự).
 * - Nhiều từ: lấy chữ cái đầu mỗi từ, tối đa 4
 * - Một từ: lấy 4 ký tự đầu
 */
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words
    .map((w) => w.replace(/[^a-zA-ZÀ-ỹ]/g, ""))
    .filter((w) => w.length > 0)
    .map((w) => w[0])
    .slice(0, 4)
    .join("")
    .toUpperCase();
};
