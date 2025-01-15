import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigation hook

const AdminDashboard = () => {
    const [message, setMessage] = useState(""); // Message from the backend
    const [users, setUsers] = useState([]); // List of users
    const [formVisible, setFormVisible] = useState(false); // Toggle form visibility
    const [newUser, setNewUser] = useState({ username: "", email: "", role: "user" }); // New user data
    const [error, setError] = useState(""); // Error handling
    const navigate = useNavigate(); // Initialize navigation

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
    };

    // Fetch Admin Dashboard message and list of users
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/admin/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage(response.data.message);

                // Fetch all users
                const userResponse = await axios.get("http://localhost:5000/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(userResponse.data); // Set users list
            } catch (error) {
                setMessage(error.response?.data?.error || "Access denied");
            }
        };

        fetchData();
    }, []);

    // Create a new user
    const handleCreateUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/admin/users", newUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert(`User created! First-Time Code: ${response.data.user.code}`); // Display the code
            setFormVisible(false); // Hide the form
            setNewUser({ username: "", email: "", role: "user" }); // Reset the form
            fetchUsers(); // Refresh the users list
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create user.");
        }
    };

    // Delete a user
    const handleDeleteUser = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchUsers(); // Refresh the users list
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete user.");
        }
    };

    // Edit a profile
    const handleEditProfile = (userId) => {
        navigate(`/profile/${userId}`); // Navigate to the user's profile page
    };

    // Fetch users list
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data); // Update users list
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch users.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Admin Dashboard</h1>
            <p>{message}</p>
            <button onClick={handleLogout} className="btn btn-danger mb-4">
                Logout
            </button>

            <button
                onClick={() => setFormVisible(!formVisible)}
                className="btn btn-primary mb-3"
            >
                {formVisible ? "Close Form" : "Add User"}
            </button>

            {formVisible && (
                <div className="card card-body mb-4">
                    <h3>Create User</h3>
                    <div className="mb-3">
                        <label>Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) =>
                                setNewUser({ ...newUser, username: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-3">
                        <label>Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) =>
                                setNewUser({ ...newUser, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-3">
                        <label>Role:</label>
                        <select
                            className="form-control"
                            value={newUser.role}
                            onChange={(e) =>
                                setNewUser({ ...newUser, role: e.target.value })
                            }
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button onClick={handleCreateUser} className="btn btn-success">
                        Create
                    </button>
                    {error && <div className="text-danger mt-2">{error}</div>}
                </div>
            )}

            <h3>All Users</h3>
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>First-Time Code</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            {user.code ? (
                                <span className="badge bg-warning">{user.code}</span> // Show code if available
                            ) : (
                                <span className="text-muted">Used</span> // Mark as used
                            )}
                        </td>
                        <td>
                            <button
                                onClick={() => handleEditProfile(user._id)}
                                className="btn btn-primary btn-sm"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="btn btn-danger btn-sm"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
