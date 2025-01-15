import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection after login
import { Link } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Initialize navigate

    // Clear token on component mount
    useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", { email, password });
            const { token, role } = response.data;

            localStorage.setItem("token", token);

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "user") {
                navigate("/profile");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Login failed");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            <Link to="/first-time-setup">First-Time Login</Link>
        </div>
    );
};

export default LoginPage;
