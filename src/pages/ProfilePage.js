import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // For dynamic profile routing

const ProfilePage = () => {
    const { userId } = useParams(); // Get userId from route parameters
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("");
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                // Fetch profile data
                const response = await axios.get(`http://localhost:5000/user/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProfile(response.data);
                setUserRole(response.data.role); // Track logged-in user's role
                setEditable(response.data.role === "admin" || response.data.role === "bigadmin");
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch profile.");
            }
        };

        fetchProfile();
    }, [userId]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/user/profile/${userId}`, profile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update profile.");
        }
    };

    const isFieldEditable = (fieldName) => {
        const adminOnlyFields = ["currentDegree", "passedDate", "raisedDate"];
        if (editable) {
            return !adminOnlyFields.includes(fieldName); // Restrict only admin fields
        }
        return false; // Non-admins can’t edit restricted fields
    };

    if (error) return <div>{error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <h1>{profile.username}'s Profile</h1>
            <form>
                <div className="mb-3">
                    <label>Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={profile.username || ""}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={profile.email || ""}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label>Phone:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={profile.contactInfo?.phone || ""}
                        readOnly={!isFieldEditable("phone")}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                contactInfo: { ...profile.contactInfo, phone: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="mb-3">
                    <label>Address:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={profile.contactInfo?.address || ""}
                        readOnly={!isFieldEditable("address")}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                contactInfo: { ...profile.contactInfo, address: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="mb-3">
                    <label>Masonic Progression:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={profile.progression?.currentDegree || ""}
                        readOnly={!isFieldEditable("currentDegree")}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                progression: { ...profile.progression, currentDegree: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="mb-3">
                    <label>Passed Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={profile.progression?.passedDate || ""}
                        readOnly={!isFieldEditable("passedDate")}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                progression: { ...profile.progression, passedDate: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="mb-3">
                    <label>Raised Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={profile.progression?.raisedDate || ""}
                        readOnly={!isFieldEditable("raisedDate")}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                progression: { ...profile.progression, raisedDate: e.target.value },
                            })
                        }
                    />
                </div>
                <button type="button" className="btn btn-success" onClick={handleSave}>
                    Save
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
