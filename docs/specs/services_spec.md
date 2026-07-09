# Đặc tả Schema: `services`
**Mô tả:** Quản lý dịch vụ, gói dịch vụ, lịch mẫu

## Danh sách các bảng dự kiến (Tables)

### 1. `service_catalog`
- Danh mục dịch vụ lẻ (VD: Gội đầu, Xoa bóp, Phục hồi chức năng).

### 2. `service_packages`
- Các gói dịch vụ chăm sóc trọn gói (VD: Gói chăm sóc đặc biệt, Gói phục hồi sau tai biến).

### 3. `package_items`
- Chi tiết các dịch vụ con nằm trong một gói dịch vụ.

### 4. `schedule_templates`
- Lịch trình hoạt động mẫu cho từng loại gói dịch vụ.

> *Ghi chú: Cấu trúc chi tiết của từng bảng (Cột, Khóa chính, Khóa ngoại) sẽ được cập nhật dựa trên thiết kế CSDL thực tế.*
