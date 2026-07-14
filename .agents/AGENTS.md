# Custom Workspace Rules for Antigravity

These rules govern the behavior of the agent in the NursingHomeCare workspace.

## Communication & Execution Style: "Learn & Implement"
- **Do not just "vibe code" silently:** The user wants to learn and be actively involved in the technical implementation.
- **Explain Before Doing:** Whenever the user proposes a new feature, a UI change, or a logic update, you MUST first explain the step-by-step approach of how to achieve it. 
- **Explain the "Why":** Break down the technical concepts, file modifications, or CSS properties you will use.
- **Implement After Explanation:** Once you have provided the clear explanation in your response, proceed to implement the code. 
- **Language:** Maintain explanations in Vietnamese, as the user prefers.

## UI Consistency: Universal Card Design Rule
- **Consistent Attributes:** Any element designated as a "Card" (thẻ) MUST share identical structural properties (e.g., `border: 2px solid transparent`). Do not arbitrarily change border colors or opacities that make them look "thinner" or different from the global base (`BaseListCard`).
- **Interaction States (Hover & Active):** All clickable cards must exhibit consistent interaction feedback:
  - **Hover:** Slight `translateY(-2px)`, enhanced `box-shadow: var(--shadow-md)`, background-color change (`#eef2ff`), and border-color change to `var(--primary-light)`.
  - **Hold/Selected (Click):** When a card's modal or detail view is open, it MUST hold a `.selected` state with `border-color: var(--primary)` and `background-color: #e0e7ff` so the user knows which card is currently active.

## UI Contrast & Background Rule
- **Input Fields & Selects:** All input components (like `BaseInput`, `BaseSelect`) MUST use a solid white background (`#ffffff`) so they pop out clearly.
- **Container Contrast:** Any container that holds inputs (e.g., Modal Body, Form Cards) MUST use a slightly contrasting background color like light gray (`#f8fafc` or `var(--background)`) instead of white. This guarantees that white input fields never blend into their containers, maintaining high accessibility and visual hierarchy.

## Code Modularity & Reusability (Tách Component & Tái sử dụng)
- **Tách Component:** Bất cứ khi nào một component trở nên quá dài (khoảng > 150 dòng) hoặc đảm nhiệm quá nhiều chức năng (VD: có chứa các modal, tab độc lập bên trong), bắt buộc phải tách chúng thành các component con và đặt vào thư mục tương ứng (ví dụ: `components/` hoặc `modals/`).
- **Custom Hooks:** Các logic xử lý State phức tạp hoặc lặp đi lặp lại ở nhiều nơi (như quản lý modal đóng/mở, form validation, phân trang, fetch data) phải được trừu tượng hóa (abstract) thành Custom Hooks và đặt trong thư mục `src/hooks/`.
- **Hàm chung (Utils/Helpers):** Các hàm tính toán, xử lý logic thuần túy, định dạng dữ liệu (ngày tháng, tiền tệ, chuỗi...) không gắn với React Component cần được tách biệt và đặt trong thư mục `src/utils/`. Không viết logic tính toán trực tiếp bên trong UI component.
- **Tái sử dụng tối đa (DRY Principle):** Trước khi viết UI, Component hoặc logic mới, luôn phải kiểm tra các thư mục `src/components/atoms`, `src/hooks`, `src/utils` để sử dụng lại các thành phần đã có sẵn (VD: `BaseCard`, `BaseModal`, `InfoField`, `usePagination`). Tuyệt đối tránh việc viết lại mã code giống nhau ở nhiều nơi.

## Internationalization (i18n)
- **Không Hardcode Text:** Tuyệt đối không gõ cứng (hard-code) các chuỗi văn bản tĩnh (Tiếng Việt/Tiếng Anh) trực tiếp vào giao diện UI (JSX/TSX).
- **Sử dụng react-i18next:** Bắt buộc dùng Hook `useTranslation` (ví dụ: `const { t } = useTranslation()`) để render text.
- **Khai báo Locales:** Khi thêm text mới, phải chủ động thêm key/value tương ứng vào đồng thời cả 2 file `src/locales/vi.json` và `src/locales/en.json`.

## Modal Sizing & Overflow Rule (Quy tắc kích thước Modal)
- **Kích thước cố định:** Modal KHÔNG được tự giãn nở theo nội dung bên trong. Body của modal phải dùng `height` hoặc `max-height` cố định kết hợp với `overflow: hidden` để giữ kích thước ổn định.
- **Cuộn cục bộ (Local Scroll):** Nếu có danh sách động (ví dụ: danh sách trợ cấp, danh sách file...) bên trong modal, danh sách đó PHẢI tự cuộn bên trong vùng của nó bằng cách set `overflow-y: auto` và `flex: 1` trên phần tử chứa danh sách – KHÔNG để nội dung đẩy giãn modal ra ngoài.
- **Dropdown thoát khỏi overflow:** Bất kỳ dropdown tùy chỉnh nào (không phải native `<select>`) xuất hiện bên trong modal PHẢI được render ra ngoài bằng `createPortal(dropdown, document.body)` với `position: fixed`. Không dùng `position: absolute` vì sẽ bị clip bởi `overflow: hidden/auto` của modal.
- **maxWidth theo context:** Chỉ truyền `maxWidth` vào `BaseModal` khi modal có layout 2 cột hoặc nội dung rộng. Modal đơn giản (1 cột) dùng giá trị mặc định để đồng nhất.

## Spacing & Gap Synchronization Rule (Đồng bộ khoảng cách)
- **Spacing tokens:** Ưu tiên dùng CSS variables `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-md)`, `var(--spacing-lg)` thay vì giá trị số tùy tiện (`0.5rem`, `1rem`...) để toàn bộ UI đồng nhất khoảng cách.
- **Gap đồng bộ theo cấp độ:**
  - Giữa các **section lớn** (ví dụ: giữa 2 card trong tab): `gap: var(--spacing-lg)` (~1.5rem)
  - Giữa các **form field** trong cùng một section: `gap: var(--spacing-md)` (~1rem)
  - Giữa **label và input**, hoặc các item nhỏ trong một row: `gap: var(--spacing-sm)` (~0.5rem)
- **Grid vs Flex:** Dùng `display: grid` với `gap` khi các cột có kích thước rõ ràng. Dùng `display: flex` với `gap` khi các item có kích thước động. Không mix cả hai kiểu trên cùng một container.
- **Padding Modal Body:** Modal body luôn dùng `padding: var(--spacing-lg)` (~1.5rem). Không tự ý thêm `paddingBottom` lớn (như `6rem`) chỉ để "tạo chỗ cho dropdown" – thay vào đó hãy dùng Portal như quy tắc ở trên.

## User Behavior Logging Rule (Quy tắc Ghi Log Hành vi)

Mọi tính năng mới PHẢI tích hợp ghi log hành vi người dùng bằng hệ thống Activity Logger đã được thiết lập.

### Kiến trúc Logging
- **Core utility:** `src/utils/activityLogger.ts` — hàm `logActivity()`, đọc/ghi log vào `localStorage`, gửi lên server (khi có endpoint thực).
- **React Hook:** `src/hooks/useActivityLog.ts` — `useActivityLog({ module })` trả về hàm `log(action, label, details?)` để dùng trong component.

### Các hành động BẮT BUỘC phải log
Khi triển khai tính năng mới, tối thiểu phải log các hành động sau:

| Loại hành động | `action` value | Ví dụ `label` |
|---|---|---|
| Mở modal | `open_modal` | `"Mở modal tạo nhân viên"` |
| Lưu form / Tạo mới | `create` hoặc `save` | `"Lưu thông tin nhân viên mới"` |
| Cập nhật dữ liệu | `update` | `"Cập nhật hồ sơ NV001"` |
| Xóa dữ liệu | `delete` | `"Xóa nhân viên NV003"` |
| Chuyển tab / chế độ xem | `switch_view_mode` | `"Chuyển sang chế độ xem: month"` |
| Tìm kiếm / Lọc | `search` hoặc `filter` | `"Tìm kiếm nhân sự: Nguyễn Văn A"` |
| Huỷ thao tác | `cancel` | `"Huỷ tạo hợp đồng"` |

### Cách sử dụng chuẩn trong component
```tsx
// 1. Khai báo hook với đúng module name
const { log } = useActivityLog({ module: "scheduling" });

// 2. Gọi log tại điểm cần thiết
const handleSave = () => {
  log("save", "Lưu kết quả phân ca", { staffCount: roster.length });
  // ... logic save
};
```

### Quy tắc đặt tên `module`
Mỗi page/module có tên cố định:
- Scheduling: `"scheduling"`
- Nhân sự: `"staff"`
- HR/Payroll: `"hr"`
- Dashboard: `"dashboard"`
- Bệnh nhân/Cư dân: `"residents"`
- Cài đặt: `"settings"`

### Lưu ý quan trọng
- **KHÔNG** để lỗi logging làm crash UI. Hàm `logActivity` đã có try-catch bảo vệ.
- **KHÔNG** log thông tin nhạy cảm (mật khẩu, số CCCD đầy đủ...) vào `details`.
- Log phải đủ **ngữ nghĩa** để đọc hiểu được sau này mà không cần nhìn code.
- Trong môi trường `DEV`, log sẽ được in ra Console với màu tím nổi bật.

## Safe Refactoring Rule (Quy tắc Refactor An toàn)

Mọi lần refactor (tái cấu trúc code) PHẢI tuân thủ các nguyên tắc sau để đảm bảo UI và logic cũ không bị ảnh hưởng.

### 1. Luôn chạy build/type-check TRƯỚC và SAU khi refactor

```bash
npm run build
# Đọc toàn bộ lỗi TypeScript — không bỏ qua bất kỳ lỗi nào
```

- **TRƯỚC** refactor: ghi nhận số lỗi ban đầu.
- **SAU** refactor: build phải PASS hoàn toàn (0 lỗi TypeScript, 0 lỗi Vite).
- Không chấp nhận tình trạng "nhiều lỗi cũ → ít lỗi hơn nhưng vẫn còn lỗi".

### 2. Kiểm tra Interface/Type trước khi xóa field

Khi xóa một field khỏi interface (VD: `isBuiltIn`, `isCustom`):
1. Dùng **grep/search toàn project** để tìm mọi nơi dùng field đó.
2. Xóa hoặc cập nhật ĐỒNG THỜI tất cả các vị trí liên quan — cả mock data, component, context.
3. Nếu field có thể vẫn cần trong tương lai nhưng không bắt buộc → đổi sang `optional` (`field?: Type`) thay vì xóa hẳn.

```typescript
// ❌ Sai: Xóa field bắt buộc khiến mock data cũ bị lỗi
export interface StaffAllowance { id: string; name: string; amount: number; }

// ✅ Đúng: Đổi thành optional để tương thích ngược (backward compatible)
export interface StaffAllowance { id: string; name: string; amount: number; isCustom?: boolean; }
```

### 3. Quy tắc xóa unused imports — chỉ xóa, không phá cấu trúc

Khi dọn dẹp unused imports/variables:
- **Chỉ xóa** phần khai báo import, KHÔNG tự ý xóa các component/logic đang dùng ngầm ở nơi khác.
- Nếu một import bị đánh dấu unused nhưng là component/hook quan trọng → kiểm tra kỹ bằng search trước khi xóa.
- Các **config objects** (VD: `healthConfig`, `mobilityConfig`) được index bằng string động cần phải thêm `as const` hoặc cast kiểu đúng, KHÔNG xóa.

### 4. Bảo toàn Data Flow khi tách component

Khi tách một component lớn thành nhiều component nhỏ (VD: chuyển logic quản lý trợ cấp từ `IncomeModal` sang `AllowanceSelect`):

1. **Xác định rõ nguồn dữ liệu (source of truth):** Ai giữ state? `useState` local hay Context global?
2. **Đảm bảo props được truyền đủ:** Component mới nhận đủ data để render đúng trạng thái ban đầu (initial state).
3. **Kiểm tra tính nhất quán giữa mock data và Context:** IDs trong mock data PHẢI khớp với IDs trong Context/Constants.
   ```typescript
   // ❌ Sai: ID trong mock không có trong ALLOWANCE_OPTIONS
   { id: `CUSTOM-${i}`, name: "Phụ cấp tùy chỉnh", amount: 1500000 }

   // ✅ Đúng: Dùng ID có trong catalog chính thức
   { id: "DOC_HAI", name: "Phụ cấp độc hại", amount: 1000000 }
   ```
4. **Test luồng dữ liệu 2 chiều:** Đảm bảo thay đổi từ component con lan lên đúng parent/context.

### 5. Giữ nguyên contract của shared components

Khi refactor component dùng chung (VD: `EditableSelect`, `BaseModal`, `BaseInput`):
- **KHÔNG thay đổi props interface** (tên props, kiểu dữ liệu) nếu component đó đang được dùng ở nhiều nơi.
- Nếu cần thay đổi interface → thêm props mới với giá trị **default** để không phá code cũ.
- Dùng **grep toàn project** để kiểm tra tất cả nơi import component trước khi sửa.

```typescript
// ❌ Sai: Đổi tên prop 'value' → 'selectedId' làm vỡ tất cả nơi đang dùng
<EditableSelect selectedId={...} />

// ✅ Đúng: Thêm prop mới, giữ prop cũ
<EditableSelect value={...} selectedId={value} /> // backward compat
```

### 6. Checklist Refactor (bắt buộc thực hiện theo thứ tự)

```
□ 1. Chạy build → ghi nhận danh sách lỗi hiện tại
□ 2. Search toàn project tìm tất cả nơi dùng file/component/interface sắp sửa
□ 3. Xác định "scope of change" — cái gì thay đổi, cái gì giữ nguyên
□ 4. Thực hiện thay đổi theo thứ tự: Interface → Mock Data → Context → Component
□ 5. Chạy build lại → xử lý từng lỗi TypeScript, không skip
□ 6. Kiểm tra shared logic: IDs khớp, props đủ, data flow 2 chiều đúng
□ 7. Build phải PASS 100% trước khi báo cáo hoàn thành
```
