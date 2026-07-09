# Đặc tả Schema: `common`
**Mô tả:** Danh mục dùng chung toàn hệ thống (tỉnh/huyện, nhóm máu, mức độ chăm sóc…)

## Danh sách các bảng dự kiến (Tables)

### 1. `cloudcode_config`
- Quản lý danh sách các viện dưỡng lão (tenant) sử dụng hệ thống.

### 2. `provinces`, `districts`, `wards`
- Dữ liệu địa lý (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã) dùng chung.

### 3. `blood_types`
- Danh mục nhóm máu.

### 4. `care_levels`
- Danh mục mức độ chăm sóc (VD: Tự phục vụ, Chăm sóc một phần, Chăm sóc toàn diện).

> *Ghi chú: Cấu trúc chi tiết của từng bảng (Cột, Khóa chính, Khóa ngoại) sẽ được cập nhật dựa trên thiết kế CSDL thực tế.*
