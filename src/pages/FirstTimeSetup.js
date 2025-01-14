import React, { useState } from "react";
import axios from "axios";

const FirstTimeSetup = () => {
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSetup = async () => {
        try {
            const response = await axios.post("http://localhost:5000/setup-password", { code, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Failed to set up password.");
        }
    };

    return (
        <div>
            <h1>First-Time Setup</h1>
            <input
                type="text"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <input
                type="password"
                placeholder="Set your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSetup}>Set Password</button>
            <p>{message}</p>
        </div>
    );
};

export default FirstTimeSetup;
