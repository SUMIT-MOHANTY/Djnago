import React from 'react';
import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const Routes = () => (
  <ReactRoutes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </ReactRoutes>
);

export default Routes;

import LedgerPage from './pages/ledger';

const updatedRoutes = [
  ...routes,
  {
    path: '/ledger',
    element: <LedgerPage />,
    protected: true
  }
];

export default updatedRoutes;
