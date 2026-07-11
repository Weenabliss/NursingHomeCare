import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/templates/Layout";
import { LayoutProvider } from "./contexts/LayoutContext";
import { PayrollProvider } from "./contexts/PayrollContext";
import { ShiftProvider } from "./contexts/ShiftContext";
import { StaffProvider } from "./contexts/StaffContext";
import { ConfirmProvider } from "./contexts/ConfirmContext";
import { LeaveSwapProvider } from "./contexts/LeaveSwapContext";
import { useTranslation } from "react-i18next";

// Base schema pages
import Dashboard from "./pages/dashboard/Dashboard";
import Residents from "./pages/Residents";
import StaffList from "./pages/staff/StaffList";
import StaffDetail from "./pages/staff/StaffDetail";
import Departments from "./pages/hr/departments/Departments";
import PageTemplate from "./pages/PageTemplate";
import { Documentation } from "./pages/Documentation";
import Payroll from "./pages/hr/payroll/Payroll";
import Schedule from "./pages/scheduling/Schedule";
import TimekeepingPage from "./pages/scheduling/TimekeepingPage";
import ShiftDefinitions from "./pages/scheduling/shift-definitions/ShiftDefinitions";

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <ConfirmProvider>
      <LeaveSwapProvider>
      <PayrollProvider>
      <ShiftProvider>
      <StaffProvider>
      <LayoutProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/common/dashboard" replace />} />
            <Route path="/docs" element={<Documentation />} />

            <Route path="/common/dashboard" element={<Dashboard />} />
            <Route path="/common/reports" element={<PageTemplate title={t("common.reports")} />} />

            <Route path="/elderly/list" element={<Residents />} />
            <Route path="/elderly/relatives" element={<PageTemplate title={t("elderly.relatives")} />} />

            <Route path="/medical/records" element={<PageTemplate title={t("medical.records")} />} />
            <Route path="/medical/prescriptions" element={<PageTemplate title={t("medical.prescriptions")} />} />

            <Route path="/hr/staff" element={<StaffList />} />
            <Route path="/hr/staff/:id" element={<StaffDetail />} />
            <Route path="/hr/departments" element={<Departments />} />
            <Route path="/hr/payroll" element={<Payroll />} />

            <Route path="/scheduling/shifts" element={<Schedule />} />
            <Route path="/scheduling/timekeeping" element={<TimekeepingPage />} />
            <Route path="/scheduling/events" element={<PageTemplate title={t("scheduling.events")} />} />
            <Route path="/scheduling/shift-definitions" element={<ShiftDefinitions />} />

            <Route path="/facility/rooms" element={<PageTemplate title={t("facility.rooms")} />} />
            <Route path="/facility/beds" element={<PageTemplate title={t("facility.beds")} />} />

            <Route path="/inventory/medicines" element={<PageTemplate title={t("inventory.medicines")} />} />
            <Route path="/inventory/equipment" element={<PageTemplate title={t("inventory.equipment")} />} />

            <Route path="/settings/general" element={<PageTemplate title={t("settings.general")} />} />
            <Route path="/settings/roles" element={<PageTemplate title={t("settings.roles")} />} />

            <Route path="*" element={<Navigate to="/common/dashboard" replace />} />
          </Routes>
        </Layout>
      </LayoutProvider>
      </StaffProvider>
      </ShiftProvider>
      </PayrollProvider>
      </LeaveSwapProvider>
      </ConfirmProvider>
    </Router>
  );
}

export default App;
