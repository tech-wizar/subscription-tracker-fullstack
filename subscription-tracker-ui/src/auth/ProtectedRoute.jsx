import React from 'react';
import { Navigate } from 'react-router-dom';

// This component will wrap any page we want to protect.
const ProtectedRoute = ({ children }) => {
    // Check for the access token in local storage.
    const token = localStorage.getItem('accessToken');

    if (!token) {
        // If there's no token, redirect the user to the login page.
        return <Navigate to="/login" />;
    }

    // If there is a token, render the child components (the protected page).
    return children;
};

export default ProtectedRoute;