import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Wrapper component for private routes
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Φόρτωση...</p></div>;
    }

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Το Outlet χρησιμοποιείται αν το PrivateRoute τυλίγει άλλα Routes στο App.js
    return children ? children : <Outlet />;
};

export default PrivateRoute;