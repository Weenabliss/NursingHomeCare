import React from "react";
import type { SubRoomCatalog } from "../../../../mock/facility";
import { CatalogCard } from "./CatalogCard";

interface Props {
  subRoomCatalog: SubRoomCatalog[];
  onEdit: (item: SubRoomCatalog) => void;
}

export const SubRoomCatalogTab: React.FC<Props> = ({ subRoomCatalog, onEdit }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gridAutoRows: "1fr", gap: "var(--spacing-md)" }}>
    {subRoomCatalog.map((item) => (
      <CatalogCard
        key={item.id}
        id={item.id}
        name={item.name}
        images={item.images}
        description={item.description}
        accent="#d97706"
        billingPrice={item.billingPrice}
        billingLabel="Tính tiền/tháng"
        referencePrice={item.unitPrice}
        referenceLabel="Chi phí XD"
        badge={item.id}
        onClick={() => onEdit(item)}
      />
    ))}
  </div>
);
