// ─── ① Catalog thiết bị (danh mục dùng chung) ─────────────────────────────
export interface EquipmentCatalog {
  id: string;
  name: string;           // "Giường bệnh đa chức năng"
  unit: string;           // "cái", "bộ", "chiếc"...
  unitPrice: number;      // Đơn giá tham khảo (VND) — dùng khi tài sản bị hỏng/thay thế
  billingPrice: number;   // Giá tính tiền / tháng (VND) — cộng vào đơn giá phòng
  images?: string[];      // Ảnh minh hoạ thiết bị
  description?: string;
}

// ─── ② Catalog phòng con (danh mục dùng chung) ────────────────────────────
export interface SubRoomCatalog {
  id: string;
  name: string;           // "Phòng tắm", "Karaoke"
  unitPrice: number;      // Đơn giá tham khảo (VND) — chi phí xây dựng / tham chiếu
  billingPrice: number;   // Giá tính tiền / tháng (VND) — cộng vào đơn giá phòng
  images?: string[];      // Ảnh minh hoạ phòng con
  description?: string;
}

// ─── ③ Item đã chọn trong 1 loại phòng (tham chiếu catalog qua id) ─────────
export interface SelectedEquipment {
  catalogId: string;
  quantity: number;
}

export interface SelectedSubRoom {
  catalogId: string;
  quantity: number;
}

// ─── ④ Loại Phòng ──────────────────────────────────────────────────────────
export type PriceMode = "auto" | "fixed";

export interface RoomType {
  id: string;
  name: string;
  capacity: number;       // Sức chứa (người)
  area: number;           // Diện tích (m2)
  basePrice: number;      // Giá phòng cơ bản / tháng (VND)
  priceMode: PriceMode;   // "auto": tính từ catalog, "fixed": nhập tay
  fixedPrice?: number;    // Chỉ dùng khi priceMode === "fixed"
  color?: string;         // Màu phân biệt loại phòng
  images: string[];
  description?: string;
  equipments: SelectedEquipment[];
  subRooms: SelectedSubRoom[];
}

// ─── Mock: Catalog Thiết bị ────────────────────────────────────────────────
// unitPrice   = Đơn giá mua / thay thế (tham khảo khi bị hỏng)
// billingPrice = Phí sử dụng / tháng (tính vào đơn giá phòng)
export const equipmentCatalogMockData: EquipmentCatalog[] = [
  { id: "EC001", name: "Giường bệnh đa chức năng", unit: "cái", unitPrice: 15_000_000, billingPrice: 750_000, images: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=70"], description: "Giường điều chỉnh điện tử, có thể nâng hạ đầu/chân" },
  { id: "EC002", name: "Giường y tế cơ bản", unit: "cái", unitPrice: 5_000_000, billingPrice: 250_000, images: ["https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=300&auto=format&fit=crop&q=70"], description: "Giường y tế 2 khúc tiêu chuẩn" },
  { id: "EC003", name: "Máy theo dõi nhịp tim & SpO2", unit: "cái", unitPrice: 25_000_000, billingPrice: 1_200_000, images: ["https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC004", name: "Smart TV 55 inch", unit: "cái", unitPrice: 8_000_000, billingPrice: 300_000, images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC005", name: "Tủ lạnh mini", unit: "cái", unitPrice: 3_500_000, billingPrice: 150_000, images: ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC006", name: "Sofa tiếp khách", unit: "bộ", unitPrice: 6_000_000, billingPrice: 200_000, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC007", name: "Điều hòa nhiệt độ", unit: "cái", unitPrice: 12_000_000, billingPrice: 500_000, images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC008", name: "Quạt treo tường", unit: "cái", unitPrice: 800_000, billingPrice: 50_000, images: ["https://images.unsplash.com/photo-1615671524827-f3bb036e0e0a?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC009", name: "Hệ thống oxy trung tâm", unit: "bộ", unitPrice: 30_000_000, billingPrice: 2_000_000, images: ["https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC010", name: "Tủ đồ cá nhân", unit: "cái", unitPrice: 2_000_000, billingPrice: 80_000, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC011", name: "Bàn ăn + ghế", unit: "bộ", unitPrice: 4_000_000, billingPrice: 150_000, images: ["https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=300&auto=format&fit=crop&q=70"] },
  { id: "EC012", name: "Xe lăn tự động", unit: "cái", unitPrice: 18_000_000, billingPrice: 800_000, images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&auto=format&fit=crop&q=70"] },
];

// ─── Mock: Catalog Phòng con ───────────────────────────────────────────────
// unitPrice   = Chi phí xây dựng / đầu tư (tham khảo)
// billingPrice = Phí sử dụng / tháng (tính vào đơn giá phòng)
export const subRoomCatalogMockData: SubRoomCatalog[] = [
  { id: "SC001", name: "Phòng tắm & WC khép kín", unitPrice: 50_000_000, billingPrice: 1_500_000, images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&auto=format&fit=crop&q=70"] },
  { id: "SC002", name: "Phòng khách", unitPrice: 30_000_000, billingPrice: 800_000, images: ["https://images.unsplash.com/photo-1602028915047-37269d369887?w=300&auto=format&fit=crop&q=70"] },
  { id: "SC003", name: "Ban công", unitPrice: 15_000_000, billingPrice: 300_000, images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=300&auto=format&fit=crop&q=70"] },
  { id: "SC004", name: "Phòng Karaoke", unitPrice: 80_000_000, billingPrice: 3_000_000, images: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&auto=format&fit=crop&q=70"], description: "Hệ thống âm thanh chuyên nghiệp" },
  { id: "SC005", name: "Phòng Massage", unitPrice: 60_000_000, billingPrice: 2_500_000, images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&auto=format&fit=crop&q=70"], description: "Giường massage + thiết bị thư giãn" },
  { id: "SC006", name: "Phòng ăn riêng", unitPrice: 25_000_000, billingPrice: 700_000, images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&auto=format&fit=crop&q=70"] },
  { id: "SC007", name: "Phòng tắm chuyên dụng (hỗ trợ khuyết tật)", unitPrice: 70_000_000, billingPrice: 2_000_000, images: ["https://images.unsplash.com/photo-1620626011761-996317702782?w=300&auto=format&fit=crop&q=70"], description: "Thanh vịn + sàn chống trơn" },
  { id: "SC008", name: "Phòng thay đồ", unitPrice: 10_000_000, billingPrice: 400_000, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&auto=format&fit=crop&q=70"] },
];

// ─── Mock: Loại Phòng ──────────────────────────────────────────────────────
export const roomTypesMockData: RoomType[] = [
  {
    id: "RT001",
    name: "Phòng Chăm sóc Tích cực (ICU)",
    capacity: 1,
    area: 25,
    basePrice: 15_000_000,
    priceMode: "auto",
    color: "#dc2626", // red-600
    images: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=60"],
    description: "Phòng dành cho người bệnh cần chăm sóc và theo dõi liên tục 24/7.",
    equipments: [
      { catalogId: "EC001", quantity: 1 },
      { catalogId: "EC003", quantity: 1 },
      { catalogId: "EC009", quantity: 1 },
    ],
    subRooms: [{ catalogId: "SC007", quantity: 1 }],
  },
  {
    id: "RT002",
    name: "Phòng VIP Đơn",
    capacity: 1,
    area: 40,
    basePrice: 8_000_000,
    priceMode: "auto",
    color: "#d97706", // amber-600
    images: ["https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=600&auto=format&fit=crop&q=60"],
    description: "Phòng tiêu chuẩn cao cấp, không gian yên tĩnh, có khu vực tiếp khách.",
    equipments: [
      { catalogId: "EC001", quantity: 1 },
      { catalogId: "EC004", quantity: 1 },
      { catalogId: "EC005", quantity: 1 },
      { catalogId: "EC006", quantity: 1 },
      { catalogId: "EC007", quantity: 1 },
    ],
    subRooms: [
      { catalogId: "SC001", quantity: 1 },
      { catalogId: "SC002", quantity: 1 },
      { catalogId: "SC003", quantity: 1 },
    ],
  },
  {
    id: "RT003",
    name: "Phòng Tiêu chuẩn 4 Giường",
    capacity: 4,
    area: 50,
    basePrice: 3_000_000,
    priceMode: "fixed",
    fixedPrice: 5_500_000,
    color: "#16a34a", // green-600
    images: ["https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=60"],
    description: "Phòng ở tập thể, thiết kế rộng rãi, thoáng mát, chi phí tiết kiệm.",
    equipments: [
      { catalogId: "EC002", quantity: 4 },
      { catalogId: "EC010", quantity: 4 },
      { catalogId: "EC008", quantity: 4 },
      { catalogId: "EC007", quantity: 1 },
    ],
    subRooms: [{ catalogId: "SC001", quantity: 1 }],
  },
];
// Append to src/mock/facility.ts

// ─── ⑤ Sơ đồ cơ sở vật chất (Facility Map) ──────────────────────────────────

export interface Slot {
  id: string;
  bedId: string;
  name: string; // VD: "Slot A", "Slot B"
  status: "available" | "occupied" | "maintenance";
  occupantName?: string;
  startDate?: string;
  endDate?: string;
}

export interface Bed {
  id: string;
  roomId: string;
  name: string; // VD: "Giường 1"
  status: "active" | "maintenance";
}

export interface Room {
  id: string;
  floorId: string;
  name: string; // VD: "Phòng 101"
  roomTypeId?: string; // Tham chiếu đến Loại phòng
  status: "active" | "maintenance";
}

export interface Floor {
  id: string;
  buildingId: string;
  name: string; // VD: "Tầng 1"
  level: number; // Thứ tự tầng
}

export interface Building {
  id: string;
  name: string; // VD: "Tòa A"
  description?: string;
}

// ─── Mock Data: Facility Map ───────────────────────────────────────────────

export const buildingsMockData: Building[] = [
  { id: "B1", name: "Tòa A - Chăm sóc đặc biệt", description: "Dành cho người cao tuổi cần chăm sóc y tế chuyên sâu" },
  { id: "B2", name: "Tòa B - Sinh hoạt chung", description: "Khu vực sinh hoạt và các phòng tiêu chuẩn" },
];

export const floorsMockData: Floor[] = [
  { id: "F1", buildingId: "B1", name: "Tầng 1", level: 1 },
  { id: "F2", buildingId: "B1", name: "Tầng 2", level: 2 },
  { id: "F3", buildingId: "B2", name: "Tầng 1", level: 1 },
];

export const roomsMockData: Room[] = [
  { id: "R101", floorId: "F1", name: "Phòng 101", roomTypeId: "RT001", status: "active" },
  { id: "R102", floorId: "F1", name: "Phòng 102", roomTypeId: "RT001", status: "active" },
  { id: "R201", floorId: "F2", name: "Phòng 201", roomTypeId: "RT002", status: "active" },
  { id: "R301", floorId: "F3", name: "Phòng 101 (Tòa B)", roomTypeId: "RT003", status: "active" },
];

export const bedsMockData: Bed[] = [
  { id: "BED1", roomId: "R101", name: "Giường 1", status: "active" },
  { id: "BED2", roomId: "R101", name: "Giường 2", status: "active" },
  { id: "BED3", roomId: "R201", name: "Giường 1", status: "active" },
  { id: "BED4", roomId: "R301", name: "Giường 1", status: "active" },
  { id: "BED5", roomId: "R301", name: "Giường 2", status: "active" },
];

export const slotsMockData: Slot[] = [
  // R101 - BED 1 (Giường đôi có 2 vị trí)
  { id: "SLOT1", bedId: "BED1", name: "Vị trí 1 (Trái)", status: "occupied", occupantName: "Nguyễn Văn A", startDate: "2026-06-25", endDate: "2026-07-20" },
  { id: "SLOT2", bedId: "BED1", name: "Vị trí 2 (Phải)", status: "occupied", occupantName: "Trần Thế B", startDate: "2026-07-05", endDate: "2026-08-05" },
  
  // R101 - BED 2 (Giường đơn - 1 vị trí)
  { id: "SLOT3", bedId: "BED2", name: "Giường đơn", status: "available" },
  
  // R201 - BED 1 (Giường đơn)
  { id: "SLOT4", bedId: "BED3", name: "Giường đơn", status: "maintenance", startDate: "2026-07-02", endDate: "2026-07-08" },
  
  // R301 - BED 1 (Giường đôi)
  { id: "SLOT5", bedId: "BED4", name: "Vị trí 1", status: "occupied", occupantName: "Trần Thị C", startDate: "2026-07-10" },
  { id: "SLOT6", bedId: "BED4", name: "Vị trí 2", status: "available" },
];

