# Đặc tả Schema: `inventory`
**Mô tả:** Quản lý kho (vật tư, thuốc, nhập-xuất-tồn)

## Danh sách các bảng dự kiến (Tables)

### 1. `items` (Sản phẩm/Vật tư)
- Danh mục thuốc, vật tư y tế, nhu yếu phẩm.

### 2. `categories` (Danh mục)
- Phân loại vật tư (VD: Thuốc tim mạch, Bông băng, Thực phẩm).

### 3. `warehouses` (Kho)
- Danh sách các kho chứa hàng.

### 4. `transactions` (Giao dịch)
- Lịch sử phiếu nhập kho, xuất kho.

### 5. `transaction_details` (Chi tiết giao dịch)
- Chi tiết từng mặt hàng trong phiếu nhập/xuất.

### 6. `inventory_stock` (Tồn kho)
- Theo dõi số lượng tồn kho hiện tại của từng mặt hàng tại mỗi kho.

> *Ghi chú: Cấu trúc chi tiết của từng bảng (Cột, Khóa chính, Khóa ngoại) sẽ được cập nhật dựa trên thiết kế CSDL thực tế.*
