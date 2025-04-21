import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider, createTheme } from '@mantine/core';

import './styles/App.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminSettingsPage from './pages/Admin/AdminSettingsPage';
import UniDashboardPage from './pages/Uni/UniDashboardPage';
import UniEventsPage from './pages/Uni/UniEventsPage';
import UniSettingsPage from './pages/Uni/UniSettingsPage';
import RSODashboardPage from './pages/RSO/RSODashboardPage';
import RSOCreateEventPage from './pages/RSO/RSOCreateEventPage';
import RSOEventsPage from './pages/RSO/RSOEventsPage';
import RSOSettingsPage from './pages/RSO/RSOSettingsPage';
import StdDashboardPage from './pages/Std/StdDashboardPage';
import StdEventsPage from './pages/Std/StdEventsPage';
import StdSettingsPage from './pages/Std/StdSettingsPage';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/AdminDashboard" element={<AdminDashboardPage />} />
          <Route path="/AdminSettings" element={<AdminSettingsPage />} />
          <Route path="/UniDashboard" element={<UniDashboardPage />} />
          <Route path="/UniEvents" element={<UniEventsPage />} />
          <Route path="/UniSettings" element={<UniSettingsPage />} />
          <Route path="/RSODashboard" element={<RSODashboardPage />} />
          <Route path="/RSOCreateEvent" element={<RSOCreateEventPage />} />
          <Route path="/RSOEvents" element={<RSOEventsPage />} />
          <Route path="/RSOSettings" element={<RSOSettingsPage />} />
          <Route path="/StudentDashboard" element={<StdDashboardPage />} />
          <Route path="/StudentEvents" element={<StdEventsPage />} />
          <Route path="/StudentSettings" element={<StdSettingsPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
