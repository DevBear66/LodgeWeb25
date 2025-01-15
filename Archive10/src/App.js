import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import FirstTimeSetup from "./pages/FirstTimeSetup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/Archive10/public">Athelstan 9033</a>
                <div>
                    <a className="nav-link" href="/Archive10/public">Home</a>
                    <a className="nav-link" href="/about">About</a>
                    <a className="nav-link" href="/login">Login</a>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/first-time-setup" element={<FirstTimeSetup />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
