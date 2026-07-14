import React from "react";
import { Plus } from "lucide-react";
import { BaseButton } from "../../../../shared/components/BaseButton";
import type { EquipmentCatalog } from "../../../../mock/facility";
import { formatCurrencyShort } from "../../../../shared/utils/format";;
import { MonogramSelect } from "./MonogramSelect";
import { CatalogRow } from "./CatalogRow";

interface SelectedEq { catalogId: string; quantity: number; }

interface EquipmentPanelProps {
  /** Danh mục chưa được chọn (dùng cho dropdown) */
  availableEq: EquipmentCatalog[];
  /** Toàn bộ catalog (dùng để tra cứu chi tiết khi render row) */
  equipmentCatalog: EquipmentCatalog[];
  /** Danh sách thiết bị đã chọn */
  selections: SelectedEq[];
  selectedId: string;
  onSelectChange: (id: string) => void;
  onAdd: () => void;
  onQtyChange: (catalogId: string, qty: number) => void;
  onRemove: (catalogId: string) => void;
  selectPlaceholder: string;
  emptyText: string;
}

export const EquipmentPanel: React.FC<EquipmentPanelProps> = ({
  availableEq, equipmentCatalog, selections,
  selectedId, onSelectChange, onAdd,
  onQtyChange, onRemove, selectPlaceholder, emptyText,
}) => (
  <>
    {/* Select + Thêm */}
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexShrink: 0 }}>
      <div style={{ flex: 1 }}>
        <MonogramSelect
          options={availableEq.map((c) => ({ id: c.id, name: c.name, billingPrice: c.billingPrice, unit: c.unit, images: c.images }))}
          value={selectedId}
          onChange={onSelectChange}
          placeholder={selectPlaceholder}
          accent="#16a34a"
        />
      </div>
      <BaseButton variant="primary" size="md" onClick={onAdd} style={{ flexShrink: 0 }}>
        <Plus size={15} /> Thêm
      </BaseButton>
    </div>

    {/* Scrollable list */}
    <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
      {selections.length === 0 ? (
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic", margin: "0.25rem 0" }}>
          {emptyText}
        </p>
      ) : selections.map((sel) => {
        const cat = equipmentCatalog.find((c) => c.id === sel.catalogId);
        if (!cat) return null;
        return (
          <CatalogRow
            key={sel.catalogId}
            name={cat.name}
            sub={`Tính tiền: ${formatCurrencyShort(cat.billingPrice)}/${cat.unit} · Đơn giá TK: ${formatCurrencyShort(cat.unitPrice)}`}
            qty={sel.quantity}
            subtotal={cat.billingPrice * sel.quantity}
            accent="#16a34a"
            image={cat.images?.[0]}
            onQtyChange={(q) => onQtyChange(sel.catalogId, q)}
            onDel={() => onRemove(sel.catalogId)}
          />
        );
      })}
    </div>
  </>
);
