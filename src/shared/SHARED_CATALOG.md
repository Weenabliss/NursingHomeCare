# Shared Library Catalog
> Tài liệu tra cứu nhanh — cập nhật khi thêm/xóa component/hook/util

---

## Cách import

```ts
// ✅ ĐÚNG — import từ barrel index
import { BaseModal, BaseButton, useFormModal, formatCurrency } from "../../shared";

// ❌ SAI — import trực tiếp từng file
import { BaseModal } from "../../shared/components/BaseModal";
```

---

## 📦 Components

### Atoms — Form & Input

#### `BaseInput`
Ô nhập văn bản chuẩn với label và validation.
```tsx
<BaseInput
  label="Họ tên"        // string
  value={name}          // string
  onChange={handler}    // (e: ChangeEvent<HTMLInputElement>) => void
  placeholder="..."     // string?
  error="Lỗi..."        // string? — hiển thị text đỏ bên dưới
  disabled              // boolean?
  type="text"           // HTMLInputTypeAttribute?
/>
```

#### `BaseSelect`
Dropdown select native với label.
```tsx
<BaseSelect
  label="Loại hợp đồng"
  value={value}
  onChange={handler}     // (e: ChangeEvent<HTMLSelectElement>) => void
  options={[{ value: "A", label: "Loại A" }]}
  placeholder="Chọn..."  // string?
  disabled               // boolean?
/>
```

#### `BaseCheckbox`
Checkbox với label inline.
```tsx
<BaseCheckbox
  label="Đã xác nhận"
  checked={isChecked}
  onChange={handler}    // (checked: boolean) => void
  disabled              // boolean?
/>
```

#### `BaseRadio`
Radio button với label.
```tsx
<BaseRadio
  label="Nam"
  value="male"
  checked={gender === "male"}
  onChange={handler}    // (value: string) => void
/>
```

#### `BaseDatePicker`
Date picker với label, hỗ trợ min/max.
```tsx
<BaseDatePicker
  label="Ngày sinh"
  value={date}          // string (YYYY-MM-DD)
  onChange={handler}    // (val: string) => void
  min="1900-01-01"      // string?
  max="2099-12-31"      // string?
/>
```

---

### Atoms — Display

#### `BaseBadge`
Tag/badge với màu variant.
```tsx
<BaseBadge
  variant="primary"   // "primary"|"success"|"danger"|"warning"|"info"|"neutral"
  size="sm"           // "sm"|"md"?
>
  Đang làm việc
</BaseBadge>
```

#### `BaseButton`
Nút bấm với nhiều variant và size.
```tsx
<BaseButton
  variant="primary"   // "primary"|"outline"|"danger"|"ghost"|"success"
  size="md"           // "sm"|"md"|"lg"?
  onClick={handler}
  disabled            // boolean?
  type="button"       // "button"|"submit"|"reset"?
>
  Lưu
</BaseButton>
```

#### `BaseLoader`
Spinner loading.
```tsx
<BaseLoader
  size="medium"          // "small"|"medium"|"large"?
  color="var(--primary)" // string? — màu dynamic
  fullScreen             // boolean? — overlay toàn màn hình
/>
```

#### `CatalogAvatar`
Avatar ảnh hoặc monogram fallback.
```tsx
<CatalogAvatar
  name="Nguyễn Văn A"     // string — tạo initials khi không có ảnh
  images={staff.images}   // string[]? — dùng ảnh đầu tiên
  accent="#6366f1"        // string — màu gradient fallback (dynamic prop)
  size={36}               // number? — px, default 28
  fontSize="0.7rem"       // string? — font chữ initials
  borderRadius={8}        // number? — px, default 7
/>
```

#### `InfoField`
Hiển thị cặp label + value (read-only).
```tsx
<InfoField
  label="Mã nhân viên"
  value={staff.code}    // ReactNode — có thể truyền JSX
/>
```

---

### Atoms — Layout

#### `BaseCard`
Wrapper card với shadow, border, hover effect.
```tsx
<BaseCard
  onClick={handler}       // () => void? — clickable card
  selected                // boolean? — border highlight khi active
  className="..."         // string?
  style={...}             // CSSProperties?
>
  {children}
</BaseCard>
```

#### `FormRow`
Flex row wrapper cho form fields.
```tsx
<FormRow>
  <BaseInput label="Họ" value={...} onChange={...} />
  <BaseInput label="Tên" value={...} onChange={...} />
</FormRow>
```

#### `PageHeader`
Header của trang với title và optional actions.
```tsx
<PageHeader
  title="Danh sách Nhân viên"
  subtitle="Quản lý hồ sơ"   // string?
  actions={<BaseButton>Thêm mới</BaseButton>}  // ReactNode?
/>
```

#### `Toolbar`
Thanh công cụ với search và filter.
```tsx
<Toolbar
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="Tìm kiếm..."  // string?
  rightContent={<BaseButton>...</BaseButton>}  // ReactNode?
/>
```

---

### Molecules — Data Display

#### `BaseTable<T>`
Bảng dữ liệu với cột configurable.
```tsx
<BaseTable
  columns={[
    { key: "name", title: "Tên", width: "200px", align: "left" },
    { key: "status", title: "Trạng thái", render: (row) => <BaseBadge>{row.status}</BaseBadge> },
  ]}
  data={staffList}          // T[]
  onRowClick={(row) => ...} // (record: T, index: number) => void?
  emptyText="Không có dữ liệu"  // string?
/>
```

#### `BaseTabs`
Tab navigation.
```tsx
<BaseTabs
  tabs={[
    { key: "info", label: "Thông tin" },
    { key: "contract", label: "Hợp đồng" },
  ]}
  activeTab={tab}
  onTabChange={setTab}
/>
```

#### `BasePagination`
Phân trang với hiển thị range.
```tsx
<BasePagination
  currentPage={page}        // number (1-based)
  totalItems={total}        // number
  itemsPerPage={10}         // number
  onPageChange={setPage}    // (page: number) => void
/>
```

#### `BaseTimeline`
Timeline danh sách sự kiện.
```tsx
<BaseTimeline
  items={[
    { date: "2024-01", title: "Ký hợp đồng", description: "..." },
  ]}
/>
```

---

### Molecules — Overlay

#### `BaseModal`
Modal chuẩn với header, body, footer.
```tsx
<BaseModal
  isOpen={isOpen}           // boolean
  onClose={handleClose}     // () => void
  title="Thêm nhân viên"   // string
  onConfirm={handleSave}    // () => void? — hiện nút xác nhận
  confirmText="Lưu"         // string?
  cancelText="Hủy"          // string?
  maxWidth="600px"          // string? default "500px"
  isDirty={isDirty}         // boolean? — cảnh báo khi đóng có thay đổi
  isDanger                  // boolean? — nút confirm đỏ
  hideFooter                // boolean?
  footerLeftContent={<>...</>}   // ReactNode?
  footerRightContent={<>...</>}  // ReactNode?
>
  {/* modal body */}
</BaseModal>
```

#### `BaseDropdown`
Dropdown menu tùy chỉnh.
```tsx
<BaseDropdown
  trigger={<BaseButton>Menu</BaseButton>}  // ReactNode
  items={[
    { label: "Sửa", icon: <Edit />, onClick: handler },
    { label: "Xóa", icon: <Trash />, onClick: handler, danger: true },
  ]}
/>
```

#### `BaseToast`
Toast notification.
```tsx
// Dùng qua context ToastProvider — không render trực tiếp
// Gọi: showToast({ message: "Lưu thành công", type: "success" })
```

#### `MediaViewerModal`
Modal xem ảnh hoặc PDF.
```tsx
<MediaViewerModal
  isOpen={isOpen}
  onClose={handleClose}
  url={fileUrl}           // string | null
  type="auto"             // "pdf"|"image"|"auto"?
  title="Xem hợp đồng"   // string?
/>
```

---

### Molecules — Interactive

#### `EditableSelect<T>`
Dropdown kết hợp quản lý danh sách tùy chỉnh (thêm/sửa/xóa option).
```tsx
<EditableSelect
  title="Phụ cấp"
  options={options}                 // T[] extends { id, text }
  onOptionsChange={setOptions}      // (opts: T[]) => void
  value={selectedId}                // string | string[]
  onChange={setSelectedId}          // (val: any) => void
  isMulti                           // boolean?
  renderOptionContent={(opt) => <span>{opt.text}</span>}
  renderEditForm={(opt, onSave, onCancel) => <EditForm ... />}
  renderAddForm={(onAdd) => <AddForm ... />}
  hideSettingsIcon                  // boolean?
  hideSelectBox                     // boolean?
/>
```

#### `FileAttachment`
Upload file kết hợp nhập URL.
```tsx
<FileAttachment
  label="Ảnh hồ sơ"
  value={url}
  uploadId="avatar-upload"   // unique ID per instance
  accept="image/*"           // string?
  uploadLabel="Tải ảnh"      // string?
  onUrlChange={setUrl}
  onFileSelect={setUrl}
  onPreview={openViewer}     // () => void? — hiện nút "Xem"
/>
```

---

### Utility Components

#### `MermaidViewer`
Render sơ đồ Mermaid từ chuỗi.
```tsx
<MermaidViewer chart={mermaidString} />
```

---

## 🪝 Hooks

#### `useFormModal<T>`
Quản lý state modal form: open/close, dirty tracking, commit/reset.
```ts
const {
  isOpen,        // boolean
  isDirty,       // boolean — có thay đổi chưa lưu
  localData,     // T — bản nháp đang chỉnh sửa
  committedData, // T — bản đã lưu
  setLocalData,  // (data: T) => void
  openModal,     // () => void
  closeModal,    // () => void — reset về committedData
  saveData,      // () => void — commit localData
  markDirty,     // () => void
  updateItem,    // <Item>(idx, key, value) => void — cho array T
} = useFormModal(initialData);
```

#### `useActivityLog`
Ghi log hành vi người dùng.
```ts
const { log } = useActivityLog({ module: "staff" });

log("open_modal", "Mở modal tạo nhân viên");
log("save", "Lưu nhân viên mới", { staffId: "NV001" });
log("delete", "Xóa nhân viên NV003", { staffId: "NV003" });
```

---

## 🛠️ Utils

#### `formatCurrency(amount: number): string`
Format tiền VND đầy đủ.
```ts
formatCurrency(1500000) // "1.500.000 ₫"
```

#### `formatCurrencyShort(amount: number): string`
Format tiền VND gọn (triệu/tỷ).
```ts
formatCurrencyShort(1500000)    // "1.5 triệu"
formatCurrencyShort(2000000000) // "2 tỷ"
```

#### `getInitials(name: string): string`
Lấy chữ viết tắt từ tên (tối đa 4 ký tự).
```ts
getInitials("Nguyễn Văn An") // "NVA"
getInitials("Trần Thị Thu")  // "TTT"
```

#### `logActivity(entry)` — xem `useActivityLog` hook ở trên

---

## 📋 Quy tắc cập nhật catalog này

Mỗi khi **thêm** component/hook/util mới vào `src/shared`:
1. Thêm export vào `src/shared/index.ts`
2. Thêm mục vào file này với props signature và ví dụ ngắn
3. Chạy `node audit_shared.cjs` để kiểm tra

Mỗi khi **xóa/rename**:
1. Xóa khỏi `index.ts` trước
2. Search toàn project để cập nhật import
3. Cập nhật mục trong file này
