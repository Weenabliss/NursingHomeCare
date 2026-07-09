import React from "react";
import { useTranslation } from "react-i18next";
import { BaseButton } from "../components/atoms/BaseButton";
import { PageHeader } from "../components/molecules/PageHeader";
import { Toolbar } from "../components/molecules/Toolbar";
import { Plus, UserSquare2, Home, Activity } from "lucide-react";

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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flexShrink: 0 }}>
        <PageHeader
          title={t("elderly.list")}
          actions={
            <BaseButton>
              <Plus size={18} />
              {t("common.add")}
            </BaseButton>
          }
        />
        <Toolbar
          searchPlaceholder={t("common.search")}
          onSearch={() => {}}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-md)",
          flex: 1,
          overflowY: "auto",
          paddingRight: "0.5rem",
          paddingBottom: "1rem",
        }}
      >
        {residents.map((resident) => (
          <div
            key={resident.id}
            className="card-25d"
            style={{
              padding: "var(--spacing-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--spacing-lg)",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-md)",
                flex: "1 1 200px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary-dark)",
                }}
              >
                <UserSquare2 size={24} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    margin: 0,
                  }}
                >
                  {resident.name}
                </h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{resident.age} tuổi</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "var(--spacing-xl)",
                flex: "2 1 200px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Home size={16} color="var(--text-muted)" />
                <span style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>{resident.room}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Activity size={16} color="var(--text-muted)" />
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: resident.status === "attention" ? "#ea580c" : "#16a34a",
                    fontWeight: 500,
                  }}
                >
                  {resident.status === "attention" ? "Cần chú ý" : "Bình thường"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flex: "0 0 auto" }}>
              <BaseButton variant="outline">{t("common.edit")}</BaseButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Residents;
