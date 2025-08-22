import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import LiveBusTracking from "./components/LiveBusTracking";
import FeeManagement from "./components/FeeManagement";
import SignInAdmin from "./components/SignInAdmin";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signinAdmin" element={<SignInAdmin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/live-bus-tracking" element={<LiveBusTracking />} />
      <Route path="/fee-management" element={<FeeManagement />} />
    </Routes>
  );
};

export default App;
