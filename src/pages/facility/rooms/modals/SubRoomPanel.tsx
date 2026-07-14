import React from "react";
import { Plus } from "lucide-react";
import { BaseButton } from "../../../../shared/components/BaseButton";
import type { SubRoomCatalog } from "../../../../mock/facility";
import { formatCurrencyShort } from "../../../../shared/utils/format";;
import { MonogramSelect } from "./MonogramSelect";
import { CatalogRow } from "./CatalogRow";

interface SelectedSr { catalogId: string; quantity: number; }

interface SubRoomPanelProps {
  availableSr: SubRoomCatalog[];
  subRoomCatalog: SubRoomCatalog[];
  selections: SelectedSr[];
  selectedId: string;
  onSelectChange: (id: string) => void;
  onAdd: () => void;
  onQtyChange: (catalogId: string, qty: number) => void;
  onRemove: (catalogId: string) => void;
  selectPlaceholder: string;
  emptyText: string;
}

export const SubRoomPanel: React.FC<SubRoomPanelProps> = ({
  availableSr, subRoomCatalog, selections,
  selectedId, onSelectChange, onAdd,
  onQtyChange, onRemove, selectPlaceholder, emptyText,
}) => (
  <>
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexShrink: 0 }}>
      <div style={{ flex: 1 }}>
        <MonogramSelect
          options={availableSr.map((c) => ({ id: c.id, name: c.name, billingPrice: c.billingPrice, images: c.images }))}
          value={selectedId}
          onChange={onSelectChange}
          placeholder={selectPlaceholder}
          accent="#d97706"
        />
      </div>
      <BaseButton variant="primary" size="md" onClick={onAdd} style={{ flexShrink: 0 }}>
        <Plus size={15} /> Thêm
      </BaseButton>
    </div>

    <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
      {selections.length === 0 ? (
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic", margin: "0.25rem 0" }}>
          {emptyText}
        </p>
      ) : selections.map((sel) => {
        const cat = subRoomCatalog.find((c) => c.id === sel.catalogId);
        if (!cat) return null;
        return (
          <CatalogRow
            key={sel.catalogId}
            name={cat.name}
            sub={`Tính tiền: ${formatCurrencyShort(cat.billingPrice)}/phòng · Đơn giá TK: ${formatCurrencyShort(cat.unitPrice)}`}
            qty={sel.quantity}
            subtotal={cat.billingPrice * sel.quantity}
            accent="#d97706"
            image={cat.images?.[0]}
            onQtyChange={(q) => onQtyChange(sel.catalogId, q)}
            onDel={() => onRemove(sel.catalogId)}
          />
        );
      })}
    </div>
  </>
);
