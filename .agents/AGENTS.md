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

