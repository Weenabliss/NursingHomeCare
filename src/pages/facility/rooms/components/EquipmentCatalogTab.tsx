import React from "react";
import type { EquipmentCatalog } from "../../../../mock/facility";
import { CatalogCard } from "./CatalogCard";

interface Props {
  equipmentCatalog: EquipmentCatalog[];
  onEdit: (item: EquipmentCatalog) => void;
}

export const EquipmentCatalogTab: React.FC<Props> = ({ equipmentCatalog, onEdit }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gridAutoRows: "1fr", gap: "var(--spacing-md)" }}>
    {equipmentCatalog.map((item) => (
      <CatalogCard
        key={item.id}
        id={item.id}
        name={item.name}
        images={item.images}
        description={item.description}
        accent="#16a34a"
        billingPrice={item.billingPrice}
        billingLabel="Tính tiền/tháng"
        referencePrice={item.unitPrice}
        referenceLabel="Đơn giá TK"
        badge={item.unit ? `/${item.unit}` : undefined}
        onClick={() => onEdit(item)}
      />
    ))}
  </div>
);
