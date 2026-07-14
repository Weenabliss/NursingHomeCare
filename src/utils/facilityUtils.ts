import type { RoomType, EquipmentCatalog, SubRoomCatalog, PriceMode } from "../mock/facility";

export const PREDEFINED_COLORS = [
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#d97706", // amber-600
  "#ca8a04", // yellow-600
  "#65a30d", // lime-600
  "#16a34a", // green-600
  "#059669", // emerald-600
  "#0d9488", // teal-600
  "#0891b2", // cyan-600
  "#0284c7", // light blue-600
  "#2563eb", // blue-600
  "#4f46e5", // indigo-600
  "#7c3aed", // violet-600
  "#9333ea", // purple-600
  "#c026d3", // fuchsia-600
  "#e11d48", // rose-600
];

export interface RoomPriceBreakdown {
  basePrice: number;
  equipmentTotal: number;
  subRoomTotal: number;
  totalPrice: number;
  priceMode: PriceMode;
}

/** Tính tổng đơn giá loại phòng từ catalog
 * - equipmentTotal / subRoomTotal dùng billingPrice (phí sử dụng/tháng)
 * - unitPrice chỉ là tham khảo khi thiết bị hỏng, KHÔNG tính vào giá phòng
 */
export const calcRoomTypePrice = (
  roomType: Pick<RoomType, "basePrice" | "equipments" | "subRooms" | "priceMode" | "fixedPrice">,
  equipmentCatalog: EquipmentCatalog[],
  subRoomCatalog: SubRoomCatalog[]
): RoomPriceBreakdown => {
  const equipmentTotal = (roomType.equipments || []).reduce((sum, sel) => {
    const catalog = equipmentCatalog.find((c) => c.id === sel.catalogId);
    return sum + (catalog?.billingPrice ?? 0) * sel.quantity;
  }, 0);

  const subRoomTotal = (roomType.subRooms || []).reduce((sum, sel) => {
    const catalog = subRoomCatalog.find((c) => c.id === sel.catalogId);
    return sum + (catalog?.billingPrice ?? 0) * sel.quantity;
  }, 0);

  const basePrice = roomType.basePrice ?? 0;
  const priceMode = roomType.priceMode ?? "auto";

  const totalPrice = priceMode === "fixed"
    ? (roomType.fixedPrice ?? 0)
    : basePrice + equipmentTotal + subRoomTotal;

  return { basePrice, equipmentTotal, subRoomTotal, totalPrice, priceMode };
};


