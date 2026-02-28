/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/SettingsPage';
import TrackingPage from './pages/TrackingPage';
import PaymentSettingsPage from './pages/PaymentSettingsPage';
import CheckoutPage from './pages/CheckoutPage';
import DownloadPage from './pages/DownloadPage';
import LegalPage from './pages/LegalPage';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/download" element={<DownloadPage />} />
        
        <Route path="/privacy" element={<LegalPage title="Privacy Policy" content="Your privacy is important to us. It is PLRYO's policy to respect your privacy regarding any information we may collect from you across our website.\n\nWe only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.\n\nWe only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification." />} />
        <Route path="/terms" element={<LegalPage title="Terms of Service" content="By accessing our website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.\n\nIf you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law." />} />
        <Route path="/refund" element={<LegalPage title="Refund Policy" content="Due to the digital nature of our products (Little Genius Spark bundle), all sales are final. Once you have gained access to the digital materials, we cannot offer a refund.\n\nHowever, we are committed to your satisfaction. If you encounter any issues with your download or the files themselves, please contact our support team and we will do our best to resolve the issue immediately." />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reports" element={<div className="p-10 text-center text-slate-500">Reports Module Coming Soon</div>} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="payments" element={<PaymentSettingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}
