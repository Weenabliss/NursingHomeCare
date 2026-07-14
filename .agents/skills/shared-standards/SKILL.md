---
name: shared-standards
description: >
  Hướng dẫn chuẩn để thêm file mới hoặc refactor code trong src/shared.
  Kích hoạt khi: thêm component/hook/util mới vào shared, refactor shared, audit shared.
---

# Shared Standards — Quy tắc bắt buộc cho `src/shared`

## 1. Cấu trúc thư mục

```
src/shared/
├── components/        # UI atoms dùng lại ở nhiều module
│   ├── BaseXxx.tsx
│   ├── BaseXxx.module.scss
│   └── ...
├── hooks/             # Custom hooks không gắn với domain cụ thể
│   └── useXxx.ts
└── utils/             # Pure functions: format, logger, ...
    └── xxx.ts
```

**Nguyên tắc phân loại:**
- `components/` → UI có JSX, dùng props, render ra DOM
- `hooks/` → logic có state/effect, KHÔNG render, KHÔNG có type domain-specific
- `utils/` → pure functions, không có React dependency, không có side effects (ngoại trừ `activityLogger`)

---

## 2. Checklist khi THÊM Component mới

### Bước 0 — Đọc SHARED_CATALOG.md trước
```
src/shared/SHARED_CATALOG.md — Danh sách toàn bộ component/hook/util đã có
```
**Phải đọc catalog này trước** để:
- Tránh tạo duplicate (component tương tự đã tồn tại)
- Tìm component có thể tái sử dụng thay vì viết mới
- Hiểu pattern import chuẩn: `import { X } from "../../shared"`

### Bước 1 — Kiểm tra đã tồn tại chưa
```bash
# Search trước khi tạo mới để tránh duplicate
grep -r "ComponentName" src/shared/components/
```

### Bước 2 — Tạo cặp file `.tsx` + `.module.scss`
- File TSX: `BaseXxx.tsx` (atoms) hoặc tên mô tả (molecules như `FileAttachment.tsx`)
- File SCSS: `BaseXxx.module.scss` (cùng tên, cùng thư mục)

### Bước 3 — Chuẩn TypeScript
```tsx
// ✅ ĐÚNG
export interface BaseXxxProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;       // Cho phép override class từ ngoài
  style?: React.CSSProperties; // Cho phép override style runtime
}

// ✅ Dùng generics nếu component xử lý nhiều kiểu dữ liệu
export function BaseXxx<T extends BaseOptionType>({ ... }: BaseXxxProps<T>) { ... }
```

### Bước 4 — i18n (BẮT BUỘC)
```tsx
// ✅ ĐÚNG
import { useTranslation } from "react-i18next";
const { t } = useTranslation();
<span>{t("componentName.placeholderKey")}</span>

// ❌ SAI — không hardcode text
<span>Chọn...</span>
<span>No data</span>
```

Đồng thời thêm keys vào ĐỒNG THỜI cả 2 file:
- `src/locales/vi.json`
- `src/locales/en.json`

### Bước 5 — Activity Logging (nếu component có interaction)
```tsx
import { useActivityLog } from "../hooks/useActivityLog";
const { log } = useActivityLog({ module: "MODULE_NAME" });
// Gọi log() tại các điểm tương tác quan trọng
```

---

## 3. Checklist SCSS Module — Bắt buộc dùng Design Tokens

### ❌ KHÔNG ĐƯỢC dùng
```scss
color: #ef4444;           // hardcode hex
font-size: 0.875rem;      // hardcode rem
font-weight: 600;         // hardcode number
padding: 1rem;            // hardcode value
margin-top: 8px;          // hardcode px
border-radius: 12px;      // hardcode px
z-index: 1000;            // hardcode number
```

### ✅ PHẢI dùng CSS Variables từ `_variables.scss`

**Colors:**
```scss
color: var(--primary);           // màu chính
color: var(--danger);            // lỗi, xóa
color: var(--success);           // thành công
color: var(--warning);           // cảnh báo
color: var(--text-main);         // text chính
color: var(--text-muted);        // text phụ
background: var(--surface);      // nền card/input
background: var(--background);   // nền trang
border-color: var(--border);     // viền mặc định
```

**Typography:**
```scss
font-size: var(--text-xs);       // 0.75rem
font-size: var(--text-sm);       // 0.875rem
font-size: var(--text-base);     // 1rem
font-size: var(--text-lg);       // 1.125rem
font-size: var(--text-xl);       // 1.25rem
font-size: var(--text-2xl);      // 1.5rem

font-weight: var(--font-weight-normal);    // 400
font-weight: var(--font-weight-medium);    // 500
font-weight: var(--font-weight-semibold);  // 600
font-weight: var(--font-weight-bold);      // 700
font-weight: var(--font-weight-extrabold); // 800
```

**Spacing:**
```scss
gap: var(--spacing-xs);    // 0.25rem
gap: var(--spacing-sm);    // 0.5rem
gap: var(--spacing-md);    // 1rem
gap: var(--spacing-lg);    // 1.5rem
gap: var(--spacing-xl);    // 2rem
gap: var(--spacing-2xl);   // 3rem
// Rule: padding/margin/gap có cùng token tương ứng
```

**Border Radius:**
```scss
border-radius: var(--radius-sm);   // 6px
border-radius: var(--radius-md);   // 12px
border-radius: var(--radius-lg);   // 16px
border-radius: var(--radius-xl);   // 24px
border-radius: var(--radius-full); // 9999px (pill)
```

**Shadow:**
```scss
box-shadow: var(--shadow-sm);
box-shadow: var(--shadow-md);
box-shadow: var(--shadow-lg);
```

**Z-Index:**
```scss
z-index: var(--z-base);      // 1
z-index: var(--z-sticky);    // 100
z-index: var(--z-dropdown);  // 200
z-index: var(--z-modal);     // 1000
z-index: var(--z-tooltip);   // 2000
z-index: var(--z-toast);     // 9999
```

**Transition:**
```scss
transition: all var(--transition-fast);    // 0.15s ease-in-out
transition: all var(--transition-normal);  // 0.25s ease-in-out
```

### Inline style trong TSX — Khi nào hợp lệ?

```tsx
// ✅ HỢP LỆ — dynamic/runtime value từ prop
<div style={{ width: size, height: size }}>        // prop số
<div style={{ background: accentColor }}>          // prop màu
<div style={{ maxWidth }}>                          // prop chuỗi
<div style={{ top: rect.bottom + 4 }}>             // tính toán JS

// ✅ HỢP LỆ — pass-through prop
<div style={style}>                                 // nhận từ props

// ❌ KHÔNG HỢP LỆ — hardcode trong TSX
<div style={{ color: "#ef4444", padding: "1rem" }}>
```

---

## 4. Checklist Hook mới

```ts
// ✅ ĐÚNG — hook thuần túy, generic, không có type nghiệp vụ
export function useXxx<T>(param: T) {
  // chỉ dùng React primitives: useState, useEffect, useCallback, useRef
  // KHÔNG import từ src/modules/**, src/contexts/**, src/mock/**
}

// ❌ SAI — hook phụ thuộc domain
export function useFormModal() {
  const { staffList } = useStaffContext(); // ← vi phạm
}
```

**Đặt đúng chỗ:**
- Logic có state, không gắn domain → `src/shared/hooks/`
- Logic gắn với 1 module cụ thể → `src/modules/<module>/hooks/`

---

## 5. Checklist Util mới

```ts
// ✅ ĐÚNG — pure function
export const formatCurrency = (amount: number): string => { ... };
export const getInitials = (name: string): string => { ... };

// ❌ SAI — có side effect hoặc gọi API
export const saveStaff = (staff: Staff) => fetch("/api/staff", ...); // ← đây là API util, không phải shared util
```

**Đặt đúng chỗ:**
- Format/transform data thuần túy → `src/shared/utils/format.ts`
- Activity logging → `src/shared/utils/activityLogger.ts`
- Business utils (tính lương, lịch ca...) → `src/utils/` (ngoài shared)

---

## 6. Quy tắc Import

```tsx
// ✅ Thứ tự chuẩn
import React, { useState, useEffect } from "react";          // 1. React
import { createPortal } from "react-dom";                    // 2. React ecosystem
import { Icon } from "lucide-react";                         // 3. Third-party
import { useTranslation } from "react-i18next";              // 4. Third-party
import { OtherComponent } from "./OtherComponent";           // 5. Relative imports (cùng folder)
import { useFormModal } from "../hooks/useFormModal";        // 6. Relative imports (parent)
import { formatCurrency } from "../utils/format";            // 7. Relative utils
import styles from "./Component.module.scss";                 // 8. Styles (CUỐI CÙNG)

// ❌ KHÔNG import mid-file (sau interface, sau function)
interface Props { ... }
import { X } from "lucide-react"; // ← sai vị trí!
```

---

## 7. Checklist Refactor toàn diện

Khi refactor một file trong `src/shared`, thực hiện theo thứ tự:

```
□ 1. Đọc toàn bộ file, lập danh sách vấn đề
□ 2. Kiểm tra imports: đúng thứ tự, không trùng, không thiếu
□ 3. Kiểm tra props interface: có đủ JSDoc? Optional đúng chỗ?
□ 4. SCSS: quét hết hardcode hex, rem, px, số z-index, font-weight
□ 5. TSX: tìm text hardcode → thay bằng t("key")
□ 6. Thêm i18n keys vào vi.json + en.json
□ 7. Kiểm tra inline styles: chỉ giữ dynamic/runtime, xóa hardcode
□ 8. Kiểm tra activity logging nếu có interaction
□ 9. Chạy: npm run build → phải PASS 0 lỗi
□ 10. Xác nhận không phá vỡ contract của component (props interface không đổi)
```

---

## 8. Nếu thêm CSS Variable mới vào `_variables.scss`

1. Thêm vào `src/styles/_variables.scss` trong block `:root { }`
2. Thêm giá trị tương ứng cho dark mode trong `[data-theme="dark"] { }` (nếu cần)
3. Ghi chú comment rõ ràng về mục đích

---

## 9. Không được làm (Anti-patterns)

| ❌ | Thay bằng |
|---|---|
| `font-weight: 600` trong SCSS | `font-weight: var(--font-weight-semibold)` |
| `color: #ef4444` | `color: var(--danger)` |
| Text JSX tiếng Việt trực tiếp | `{t("section.key")}` |
| Import giữa file (sau interface) | Import luôn lên đầu file |
| `z-index: 9999` hardcode | `z-index: var(--z-toast)` |
| Logic nghiệp vụ trong shared hook | Tách ra `src/modules/<module>/hooks/` |
| `formatCurrency` trong `facilityUtils` | `src/shared/utils/format.ts` |
