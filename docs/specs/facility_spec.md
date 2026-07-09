# Đặc tả Schema: `facility`
**Mô tả:** Quản lý cơ sở vật chất (tòa nhà, phòng ốc, thiết bị, bảo trì)

## Danh sách các bảng (Tables)

### 1. `sites` (Cơ sở)
- Quản lý các cơ sở/chi nhánh của viện.

### 2. `buildings` (Tòa nhà)
- Quản lý các khối nhà trong từng cơ sở.

### 3. `floors` (Tầng)
- Quản lý các tầng thuộc tòa nhà.

### 4. `rooms` (Phòng)
- Quản lý danh sách phòng (phòng lưu trú, phòng chức năng).

### 5. `room_templates`
- Mẫu thiết lập tiêu chuẩn cho phòng (VD: Phòng VIP 1 giường, Phòng tiêu chuẩn 4 giường).

### 6. `beds`, `bed_slots`, `bed_types`
- Quản lý danh sách giường bệnh, chỗ trống, và phân loại giường.

### 7. `equipment_types`, `room_equipment_instances`
- Danh mục loại thiết bị và dữ liệu phân bổ thiết bị vật tư vào từng phòng.

### 8. `utility_types`, `template_utilities`, `room_utility_instances`
- Danh mục tiện ích đi kèm (điều hòa, TV, chuông gọi) và phân bổ vào phòng/mẫu phòng.

### 9. `room_schedules`
- Lịch sử dụng các phòng chức năng/phòng trị liệu.

> *Ghi chú: Cấu trúc chi tiết của từng bảng (Cột, Khóa chính, Khóa ngoại) sẽ được cập nhật dựa trên thiết kế CSDL thực tế.*
