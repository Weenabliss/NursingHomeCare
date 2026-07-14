// ============================================================
// Shared Library — Barrel Export
// Import từ "@/shared" thay vì đường dẫn cụ thể
//
// Usage:
//   import { BaseModal, BaseButton, useFormModal } from "../../shared";
// ============================================================

// ─── Components ─────────────────────────────────────────────

// Atoms — Form & Input
export { BaseInput } from "./components/BaseInput";

export { BaseSelect } from "./components/BaseSelect";

export { BaseCheckbox } from "./components/BaseCheckbox";

export { BaseRadio } from "./components/BaseRadio";

export { BaseDatePicker } from "./components/BaseDatePicker";

// Atoms — Display
export { BaseBadge } from "./components/BaseBadge";
export type { BadgeVariant } from "./components/BaseBadge";

export { BaseButton } from "./components/BaseButton";

export { BaseLoader } from "./components/BaseLoader";

export { CatalogAvatar } from "./components/CatalogAvatar";
export type { CatalogAvatarProps } from "./components/CatalogAvatar";

export { InfoField } from "./components/InfoField";

// Atoms — Layout
export { BaseCard } from "./components/BaseCard";

export { FormRow } from "./components/FormRow";

export { PageHeader } from "./components/PageHeader";

export { Toolbar } from "./components/Toolbar";

// Molecules — Data Display
export { BaseTable } from "./components/BaseTable";
export type { ColumnDef, BaseTableProps } from "./components/BaseTable";

export { BaseTabs } from "./components/BaseTabs";

export { BasePagination } from "./components/BasePagination";

export { BaseTimeline } from "./components/BaseTimeline";

// Molecules — Overlay
export { BaseModal } from "./components/BaseModal";

export { BaseDropdown } from "./components/BaseDropdown";

export { ToastProvider, useToast } from "./components/BaseToast";
export type { ToastType, ToastProps } from "./components/BaseToast";

export { MediaViewerModal } from "./components/MediaViewerModal";

// Molecules — Interactive
export { EditableSelect } from "./components/EditableSelect";
export type {
  EditableSelectProps,
  EditableOptionBase,
} from "./components/EditableSelect";

export { FileAttachment } from "./components/FileAttachment";

// Utility Components
export { MermaidViewer } from "./components/MermaidViewer";

// ─── Hooks ──────────────────────────────────────────────────

export { useFormModal } from "./hooks/useFormModal";

export { useActivityLog } from "./hooks/useActivityLog";

// ─── Utils ──────────────────────────────────────────────────

export {
  formatCurrency,
  formatCurrencyShort,
  getInitials,
} from "./utils/format";

export {
  logActivity,
  readLogs,
  clearLogs,
} from "./utils/activityLogger";
export type {
  ActivityLog,
  ActivityAction,
  ActivityModule,
} from "./utils/activityLogger";
