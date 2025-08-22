import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import DashboardAdmin from "./components/DashboardAdmin";
import LiveBusTracking from "./components/LiveBusTracking";
import FeeManagement from "./components/FeeManagement";
import SignInAdmin from "./components/SignInAdmin";
import ManageAdmins from "./components/ManageAdmins";
import ManageStudents from "./components/ManageStudents";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signinAdmin" element={<SignInAdmin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
      <Route path="/live-bus-tracking" element={<LiveBusTracking />} />
      <Route path="/fee-management" element={<FeeManagement />} />
      <Route path="/manage-students" element={<ManageStudents />} />
      <Route path="/manage-admins" element={<ManageAdmins />} />
    </Routes>
  );
};

export default App;
