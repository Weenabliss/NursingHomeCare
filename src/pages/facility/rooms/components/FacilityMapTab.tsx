import React from "react";
import { TimelinePanel } from "./TimelinePanel";
import type { Building, Floor, Room, Bed, Slot, RoomType } from "../../../../mock/facility";

interface Props {
  buildings: Building[];
  floors: Floor[];
  rooms: Room[];
  beds: Bed[];
  slots: Slot[];
  roomTypes: RoomType[];
}

export const FacilityMapTab: React.FC<Props> = ({
  buildings, floors, rooms, beds, slots
}) => {
  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
        <TimelinePanel
          buildings={buildings}
          floors={floors}
          rooms={rooms}
          beds={beds}
          slots={slots}
        />
      </div>
    </div>
  );
};
