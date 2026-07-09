import React from "react";
import { useTranslation } from "react-i18next";
import { BaseButton } from "../components/atoms/BaseButton";
import { PageHeader } from "../components/molecules/PageHeader";
import { Toolbar } from "../components/molecules/Toolbar";
import { Plus, UserSquare2, Home, Activity } from "lucide-react";
import styles from "./Residents.module.scss";

const Residents: React.FC = () => {
  const { t } = useTranslation();

  const residents = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      room: "Phòng 101",
      status: "normal",
      age: 75,
    },
    {
      id: "2",
      name: "Trần Thị B",
      room: "Phòng 102",
      status: "attention",
      age: 82,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <PageHeader
          title={t("elderly.list")}
          actions={
            <BaseButton>
              <Plus size={18} />
              {t("common.add")}
            </BaseButton>
          }
        />
        <Toolbar searchPlaceholder={t("common.search")} onSearch={() => {}} />
      </div>

      <div className={styles.listArea}>
        {residents.map((resident) => (
          <div key={resident.id} className={`card-25d ${styles.card}`}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>
                <UserSquare2 size={24} />
              </div>
              <div>
                <h3 className={styles.name}>{resident.name}</h3>
                <span className={styles.age}>{resident.age} tuổi</span>
              </div>
            </div>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <Home size={16} color="var(--text-muted)" />
                <span className={styles.detailText}>{resident.room}</span>
              </div>
              <div className={styles.detailItem}>
                <Activity size={16} color="var(--text-muted)" />
                <span className={resident.status === "attention" ? styles.statusAttention : styles.statusNormal}>
                  {resident.status === "attention" ? "Cần chú ý" : "Bình thường"}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <BaseButton variant="outline">{t("common.edit")}</BaseButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Residents;
