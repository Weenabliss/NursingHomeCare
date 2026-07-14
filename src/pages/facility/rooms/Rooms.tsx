import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, LayoutGrid, Package, LayoutDashboard } from "lucide-react";
import { BaseButton } from "../../../shared/components/BaseButton";
import { PageHeader } from "../../../shared/components/PageHeader";
import { BaseTabs } from "../../../shared/components/BaseTabs";

import { RoomTypesTab } from "./components/RoomTypesTab";
import { EquipmentCatalogTab } from "./components/EquipmentCatalogTab";
import { SubRoomCatalogTab } from "./components/SubRoomCatalogTab";

import { RoomTypeModal } from "./modals/RoomTypeModal";
import { EquipmentCatalogModal } from "./modals/EquipmentCatalogModal";
import { SubRoomCatalogModal } from "./modals/SubRoomCatalogModal";

import {
  roomTypesMockData,
  equipmentCatalogMockData,
  subRoomCatalogMockData,
} from "../../../mock/facility";
import type { RoomType, EquipmentCatalog, SubRoomCatalog } from "../../../mock/facility";

const Rooms: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("roomTypes");

  // ─── Data State ──────────────────────────────────────────────────────
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(roomTypesMockData);
  const [equipmentCatalog, setEquipmentCatalog] = useState<EquipmentCatalog[]>(equipmentCatalogMockData);
  const [subRoomCatalog, setSubRoomCatalog] = useState<SubRoomCatalog[]>(subRoomCatalogMockData);

  // ─── Modal State ─────────────────────────────────────────────────────
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<RoomType | null>(null);

  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [editingEq, setEditingEq] = useState<EquipmentCatalog | null>(null);

  const [isSrModalOpen, setIsSrModalOpen] = useState(false);
  const [editingSr, setEditingSr] = useState<SubRoomCatalog | null>(null);

  // ─── RoomType handlers ───────────────────────────────────────────────
  const openTypeModal = (type?: RoomType) => { setEditingType(type || null); setIsTypeModalOpen(true); };
  const saveType = (saved: RoomType) => {
    setRoomTypes((prev) => saved.id && prev.some((r) => r.id === saved.id)
      ? prev.map((r) => r.id === saved.id ? saved : r)
      : [...prev, { ...saved, id: `RT${Date.now()}` }]);
    setIsTypeModalOpen(false);
  };
  const deleteType = (id: string) => { setRoomTypes((prev) => prev.filter((r) => r.id !== id)); setIsTypeModalOpen(false); };

  // ─── Equipment catalog handlers ───────────────────────────────────────
  const openEqModal = (item?: EquipmentCatalog) => { setEditingEq(item || null); setIsEqModalOpen(true); };
  const saveEq = (saved: EquipmentCatalog) => {
    setEquipmentCatalog((prev) => prev.some((e) => e.id === saved.id)
      ? prev.map((e) => e.id === saved.id ? saved : e)
      : [...prev, saved]);
    setIsEqModalOpen(false);
  };
  const deleteEq = (id: string) => { setEquipmentCatalog((prev) => prev.filter((e) => e.id !== id)); setIsEqModalOpen(false); };

  // ─── Sub-room catalog handlers ────────────────────────────────────────
  const openSrModal = (item?: SubRoomCatalog) => { setEditingSr(item || null); setIsSrModalOpen(true); };
  const saveSr = (saved: SubRoomCatalog) => {
    setSubRoomCatalog((prev) => prev.some((s) => s.id === saved.id)
      ? prev.map((s) => s.id === saved.id ? saved : s)
      : [...prev, saved]);
    setIsSrModalOpen(false);
  };
  const deleteSr = (id: string) => { setSubRoomCatalog((prev) => prev.filter((s) => s.id !== id)); setIsSrModalOpen(false); };

  // ─── Dynamic action button per tab ───────────────────────────────────
  const headerAction = () => {
    if (activeTab === "roomTypes") return (
      <BaseButton onClick={() => openTypeModal()}>
        <Plus size={18} /> {t("facility.addRoomType")}
      </BaseButton>
    );
    if (activeTab === "equipmentCatalog") return (
      <BaseButton onClick={() => openEqModal()}>
        <Plus size={18} /> {t("facility.addEquipmentCatalog")}
      </BaseButton>
    );
    return (
      <BaseButton onClick={() => openSrModal()}>
        <Plus size={18} /> {t("facility.addSubRoomCatalog")}
      </BaseButton>
    );
  };

  const tabSubtitle: Record<string, string> = {
    roomTypes: t("facility.roomTypes"),
    equipmentCatalog: t("facility.equipmentCatalog"),
    subRoomCatalog: t("facility.subRoomCatalog"),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flexShrink: 0 }}>
        <PageHeader
          title={t("facility.rooms")}
          subtitle={tabSubtitle[activeTab]}
          actions={headerAction()}
        />

        <BaseTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "roomTypes",        label: t("facility.roomTypes"),        icon: LayoutGrid },
            { value: "equipmentCatalog", label: t("facility.equipmentCatalog"), icon: Package },
            { value: "subRoomCatalog",   label: t("facility.subRoomCatalog"),   icon: LayoutDashboard },
          ]}
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.5rem 1rem 0.5rem" }}>
        {activeTab === "roomTypes" && (
          <RoomTypesTab
            roomTypes={roomTypes}
            equipmentCatalog={equipmentCatalog}
            subRoomCatalog={subRoomCatalog}
            onEdit={openTypeModal}
          />
        )}
        {activeTab === "equipmentCatalog" && (
          <EquipmentCatalogTab equipmentCatalog={equipmentCatalog} onEdit={openEqModal} />
        )}
        {activeTab === "subRoomCatalog" && (
          <SubRoomCatalogTab subRoomCatalog={subRoomCatalog} onEdit={openSrModal} />
        )}
      </div>

      {/* Modals */}
      <RoomTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSave={saveType}
        onDelete={deleteType}
        editingType={editingType}
        equipmentCatalog={equipmentCatalog}
        subRoomCatalog={subRoomCatalog}
        roomTypes={roomTypes}
      />
      <EquipmentCatalogModal
        isOpen={isEqModalOpen}
        onClose={() => setIsEqModalOpen(false)}
        onSave={saveEq}
        onDelete={deleteEq}
        editingItem={editingEq}
      />
      <SubRoomCatalogModal
        isOpen={isSrModalOpen}
        onClose={() => setIsSrModalOpen(false)}
        onSave={saveSr}
        onDelete={deleteSr}
        editingItem={editingSr}
      />
    </div>
  );
};

export default Rooms;
