import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/templates/Layout";
import { LayoutProvider } from "./contexts/LayoutContext";
import { PayrollProvider } from "./contexts/PayrollContext";
import { ShiftProvider } from "./contexts/ShiftContext";

import { ConfirmProvider } from "./contexts/ConfirmContext";
import { LeaveSwapProvider } from "./contexts/LeaveSwapContext";
import { useTranslation } from "react-i18next";

import Dashboard from "./pages/dashboard/Dashboard";
import { ResidentList } from "./pages/elderly/residents/ResidentList";
import { ResidentDetail } from "./pages/elderly/residents/ResidentDetail";
import StaffList from "./pages/staff/StaffList";
import StaffDetail from "./pages/staff/StaffDetail";
import Departments from "./pages/hr/departments/Departments";
import PageTemplate from "./pages/PageTemplate";
import { Documentation } from "./pages/Documentation";
import Payroll from "./pages/hr/payroll/Payroll";
import RecruitmentPage from "./pages/hr/recruitment/RecruitmentPage";
import Schedule from "./pages/scheduling/Schedule";
import TimekeepingPage from "./pages/scheduling/TimekeepingPage";
import ShiftDefinitions from "./pages/scheduling/shift-definitions/ShiftDefinitions";
import Rooms from "./pages/facility/rooms/Rooms";
import FacilityMapPage from "./pages/facility/map/FacilityMapPage";

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <ConfirmProvider>
      <LeaveSwapProvider>
      <PayrollProvider>
      <ShiftProvider>

      <LayoutProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/common/dashboard" replace />} />
            <Route path="/docs" element={<Documentation />} />

            <Route path="/common/dashboard" element={<Dashboard />} />
            <Route path="/common/reports" element={<PageTemplate title={t("common.reports")} />} />

            <Route path="/elderly/list" element={<ResidentList />} />
            <Route path="/elderly/list/:id" element={<ResidentDetail />} />

            <Route path="/medical/records" element={<PageTemplate title={t("medical.records")} />} />
            <Route path="/medical/prescriptions" element={<PageTemplate title={t("medical.prescriptions")} />} />

            <Route path="/hr/staff" element={<StaffList />} />
            <Route path="/hr/staff/:id" element={<StaffDetail />} />
            <Route path="/hr/departments" element={<Departments />} />
            <Route path="/hr/payroll" element={<Payroll />} />
            <Route path="/hr/recruitment" element={<RecruitmentPage />} />

            <Route path="/scheduling/shifts" element={<Schedule />} />
            <Route path="/scheduling/timekeeping" element={<TimekeepingPage />} />
            <Route path="/scheduling/events" element={<PageTemplate title={t("scheduling.events")} />} />
            <Route path="/scheduling/shift-definitions" element={<ShiftDefinitions />} />

            <Route path="/facility/map" element={<FacilityMapPage />} />
            <Route path="/facility/rooms" element={<Rooms />} />
            <Route path="/facility/beds" element={<PageTemplate title={t("facility.beds")} />} />

            <Route path="/inventory/medicines" element={<PageTemplate title={t("inventory.medicines")} />} />
            <Route path="/inventory/equipment" element={<PageTemplate title={t("inventory.equipment")} />} />

            <Route path="/settings/general" element={<PageTemplate title={t("settings.general")} />} />
            <Route path="/settings/roles" element={<PageTemplate title={t("settings.roles")} />} />

            <Route path="*" element={<Navigate to="/common/dashboard" replace />} />
          </Routes>
        </Layout>
      </LayoutProvider>

      </ShiftProvider>
      </PayrollProvider>
      </LeaveSwapProvider>
      </ConfirmProvider>
    </Router>
  );
}

export default App;
