import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./components/AdminDashboard";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/LoginPage";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/profile/*" element={<ProtectedRoute role="user"><ProfilePage /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

// ProtectedRoute component
const ProtectedRoute = ({ children, role }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        // Redirect to login if role doesn't match
        return <Navigate to="/login" />;
    }

    return children;
};

export default App;
