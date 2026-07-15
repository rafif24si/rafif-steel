import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  let user = null;

  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }

  // Jika belum login, redirect ke halaman login yang sesuai
  if (!user) {
    // Kalau mau akses member-dashboard arahkan ke login-member
    if (location.pathname.includes('member-dashboard') || location.pathname.includes('booking')) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Default arahkan ke login admin
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek apakah role user ada di allowedRoles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika tidak memiliki akses
    if (user.role === 'customer') {
      return <Navigate to="/member-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
