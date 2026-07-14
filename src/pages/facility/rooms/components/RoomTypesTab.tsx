import React from "react";
import type { RoomType, EquipmentCatalog, SubRoomCatalog } from "../../../../mock/facility";
import { calcRoomTypePrice } from "../../../../utils/facilityUtils";
import { formatCurrencyShort } from "../../../../shared/utils/format";;
import { BaseCard } from "../../../../shared/components/BaseCard";
import { Users, Maximize, MonitorSpeaker, LayoutGrid, TrendingUp } from "lucide-react";

interface Props {
  roomTypes: RoomType[];
  equipmentCatalog: EquipmentCatalog[];
  subRoomCatalog: SubRoomCatalog[];
  onEdit: (type: RoomType) => void;
}

export const RoomTypesTab: React.FC<Props> = ({ roomTypes, equipmentCatalog, subRoomCatalog, onEdit }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--spacing-md)" }}>
      {roomTypes.map((type) => {
        const price = calcRoomTypePrice(type, equipmentCatalog, subRoomCatalog);
        return (
          <BaseCard
            key={type.id}
            onClick={() => onEdit(type)}
            style={{ padding: 0, cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            {/* Image */}
            {type.images[0] && (
              <div style={{ height: 140, overflow: "hidden", flexShrink: 0 }}>
                <img src={type.images[0]} alt={type.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            <div style={{ padding: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", flex: 1 }}>
              {/* Title */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {type.color && <div style={{ width: 12, height: 12, borderRadius: "50%", background: type.color, flexShrink: 0 }} title="Màu nhận diện" />}
                  <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>{type.name}</h3>
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>ID: {type.id}</span>
              </div>

              {/* Description */}
              {type.description && (
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {type.description}
                </p>
              )}

              {/* Stats chips */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem 0.5rem" }}>
                <StatChip icon={<Users size={13} />} label={`${type.capacity} người`} />
                <StatChip icon={<Maximize size={13} />} label={`${type.area} m²`} />
                <StatChip icon={<MonitorSpeaker size={13} />} label={`${type.equipments.length} thiết bị`} />
                <StatChip icon={<LayoutGrid size={13} />} label={`${type.subRooms.length} phòng con`} />
              </div>

              {/* Price footer */}
              <div style={{ marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    <TrendingUp size={13} />
                    <span>Tổng đơn giá</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#635bff" }}>
                    {formatCurrencyShort(price.totalPrice)}
                  </span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "right", marginTop: 2 }}>
                  CB {formatCurrencyShort(price.basePrice)} + TB {formatCurrencyShort(price.equipmentTotal)} + PC {formatCurrencyShort(price.subRoomTotal)}
                </div>
              </div>
            </div>
          </BaseCard>
        );
      })}
    </div>
  );
};

const StatChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
    {icon}
    <span>{label}</span>
  </div>
);
