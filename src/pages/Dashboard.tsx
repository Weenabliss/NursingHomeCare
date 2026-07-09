import React from "react";
import { Users, AlertCircle, BedDouble, CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="mb-4" style={{ fontSize: "1.5rem", color: "var(--primary-dark)" }}>
        {t("dashboard.title")}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--spacing-lg)",
          marginBottom: "var(--spacing-2xl)",
        }}
      >
        <div
          className="card-25d"
          style={{
            padding: "var(--spacing-lg)",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(15, 76, 92, 0.1)",
              padding: "12px",
              borderRadius: "50%",
            }}
          >
            <Users size={24} color="var(--primary)" />
          </div>
          <div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                marginBottom: "4px",
              }}
            >
              {t("dashboard.totalElderly")}
            </p>
            <h3 style={{ fontSize: "1.5rem" }}>124</h3>
          </div>
        </div>
        <div
          className="card-25d"
          style={{
            padding: "var(--spacing-lg)",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(227, 178, 60, 0.1)",
              padding: "12px",
              borderRadius: "50%",
            }}
          >
            <BedDouble size={24} color="var(--secondary-dark)" />
          </div>
          <div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                marginBottom: "4px",
              }}
            >
              {t("dashboard.availableRooms")}
            </p>
            <h3 style={{ fontSize: "1.5rem" }}>12 / 60</h3>
          </div>
        </div>
        <div
          className="card-25d"
          style={{
            padding: "var(--spacing-lg)",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              padding: "12px",
              borderRadius: "50%",
            }}
          >
            <AlertCircle size={24} color="#ef4444" />
          </div>
          <div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                marginBottom: "4px",
              }}
            >
              {t("dashboard.healthAlerts")}
            </p>
            <h3 style={{ fontSize: "1.5rem" }}>3</h3>
          </div>
        </div>
        <div
          className="card-25d"
          style={{
            padding: "var(--spacing-lg)",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              padding: "12px",
              borderRadius: "50%",
            }}
          >
            <CalendarCheck size={24} color="#22c55e" />
          </div>
          <div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                marginBottom: "4px",
              }}
            >
              {t("dashboard.shiftsToday")}
            </p>
            <h3 style={{ fontSize: "1.5rem" }}>28</h3>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "var(--spacing-lg)",
        }}
      >
        <div className="card-25d" style={{ padding: "var(--spacing-lg)" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              marginBottom: "var(--spacing-lg)",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "var(--spacing-sm)",
            }}
          >
            {t("dashboard.upcomingMedication")}
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "var(--spacing-2xl) 0",
            }}
          >
            {t("dashboard.noData")}
          </p>
        </div>
        <div className="card-25d" style={{ padding: "var(--spacing-lg)" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              marginBottom: "var(--spacing-lg)",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "var(--spacing-sm)",
            }}
          >
            {t("dashboard.notifications")}
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li
              style={{
                padding: "var(--spacing-sm) 0",
                borderBottom: "1px solid var(--surface-alt)",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  display: "block",
                }}
              >
                09:00 - {t("dashboard.today")}
              </span>
              {t("dashboard.meeting")}
            </li>
            <li style={{ padding: "var(--spacing-sm) 0" }}>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  display: "block",
                }}
              >
                14:30 - {t("dashboard.tomorrow")}
              </span>
              {t("dashboard.checkup")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
