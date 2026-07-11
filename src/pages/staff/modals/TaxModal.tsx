import React from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";

interface TaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDirty: boolean;
  markDirty: () => void;
}

export const TaxModal: React.FC<TaxModalProps> = ({ isOpen, onClose, isDirty, markDirty }) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thuế & Bảo hiểm"
      confirmText={t("common.save")}
      onConfirm={onClose}
      isDirty={isDirty}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <BaseInput label="Mã số thuế (TNCN)" type="text" defaultValue="830xxxxxxx" onChange={markDirty} />
        <BaseInput label="Mã số sổ BHXH" type="text" defaultValue="011xxxxxxx" onChange={markDirty} />
        <BaseInput label="Mã số BHYT" type="text" defaultValue="DN4011xxxxxxx" onChange={markDirty} />
      </div>
    </BaseModal>
  );
};
