import React, { useState } from "react";
import { Building2, Layers, DoorOpen, Plus, ChevronRight, ChevronDown } from "lucide-react";
import type { Building, Floor, Room, RoomType } from "../../../../mock/facility";
import { BaseButton } from "../../../../components/atoms/BaseButton";

interface Props {
  buildings: Building[];
  floors: Floor[];
  rooms: Room[];
  roomTypes: RoomType[];
  selectedNode: { type: "building" | "floor" | "room"; id: string } | null;
  onSelectNode: (type: "building" | "floor" | "room", id: string) => void;
}

export const FacilityTree: React.FC<Props> = ({
  buildings, floors, rooms, roomTypes, selectedNode, onSelectNode
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isSelected = (type: string, id: string) => selectedNode?.type === type && selectedNode?.id === id;

  const renderNode = (
    id: string, type: "building" | "floor" | "room",
    label: string, icon: React.ReactNode,
    children?: React.ReactNode, badge?: string, color?: string
  ) => {
    const active = isSelected(type, id);
    const hasChildren = !!children;
    const isExpanded = !!expanded[id];

    return (
      <div key={id}>
        <div
          onClick={() => onSelectNode(type, id)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "0.45rem 0.75rem",
            cursor: "pointer", borderRadius: "var(--radius-md)", marginBottom: 2,
            background: active ? "var(--primary-light, #eef2ff)" : "transparent",
            border: active ? "1px solid var(--primary)" : "1px solid transparent",
            color: active ? "var(--primary-dark)" : "var(--text-main)",
            transition: "all .15s"
          }}
          onMouseEnter={(e) => {
            if (!active) e.currentTarget.style.background = "var(--background-alt)";
          }}
          onMouseLeave={(e) => {
            if (!active) e.currentTarget.style.background = "transparent";
          }}
        >
          <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", cursor: hasChildren ? "pointer" : "default" }} onClick={(e) => hasChildren ? toggle(id, e) : null}>
            {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
          </div>
          
          <div style={{ color: color || (active ? "var(--primary)" : "var(--text-muted)") }}>
            {icon}
          </div>
          
          <span style={{ fontSize: "0.85rem", fontWeight: active ? 600 : 500, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {label}
          </span>
          
          {badge && (
            <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", borderRadius: "var(--radius-full)", background: color ? `${color}22` : "var(--surface)", color: color || "var(--text-muted)", fontWeight: 600 }}>
              {badge}
            </span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div style={{ marginLeft: 22, paddingLeft: 8, borderLeft: "1px dashed var(--border)", display: "flex", flexDirection: "column" }}>
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", paddingRight: 4 }}>
      {buildings.map(b => (
        renderNode(b.id, "building", b.name, <Building2 size={16} />, 
          floors.filter(f => f.buildingId === b.id).map(f => (
            renderNode(f.id, "floor", f.name, <Layers size={15} />,
              rooms.filter(r => r.floorId === f.id).map(r => {
                const rType = roomTypes.find(t => t.id === r.roomTypeId);
                return renderNode(r.id, "room", r.name, <DoorOpen size={14} />, undefined, rType?.name, rType?.color);
              })
            )
          ))
        )
      ))}
    </div>
  );
};
