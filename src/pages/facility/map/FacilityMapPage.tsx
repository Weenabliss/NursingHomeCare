import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../../shared/components/PageHeader";
import { FacilityMapTab } from "../rooms/components/FacilityMapTab";
import {
  buildingsMockData, floorsMockData, roomsMockData, bedsMockData, slotsMockData, roomTypesMockData
} from "../../../mock/facility";
import type { Building, Floor, Room, Bed, Slot, RoomType } from "../../../mock/facility";

const FacilityMapPage: React.FC = () => {
  const { t } = useTranslation();

  const [buildings] = useState<Building[]>(buildingsMockData);
  const [floors] = useState<Floor[]>(floorsMockData);
  const [rooms] = useState<Room[]>(roomsMockData);
  const [beds] = useState<Bed[]>(bedsMockData);
  const [slots] = useState<Slot[]>(slotsMockData);
  const [roomTypes] = useState<RoomType[]>(roomTypesMockData);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flexShrink: 0 }}>
        <PageHeader
          title={t("facility.map")}
          subtitle="Quản lý và bố trí sơ đồ không gian thực tế"
        />
      </div>

      <div style={{ flex: 1, overflow: "hidden", background: "var(--background-alt)", padding: "var(--spacing-lg)" }}>
        <FacilityMapTab
          buildings={buildings}
          floors={floors}
          rooms={rooms}
          beds={beds}
          slots={slots}
          roomTypes={roomTypes}
        />
      </div>
    </div>
  );
};

export default FacilityMapPage;
