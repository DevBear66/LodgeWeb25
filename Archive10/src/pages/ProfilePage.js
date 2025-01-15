import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const ProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("");
    const [editable, setEditable] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    // Fetch profile and user role
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/user/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
                setUserRole(response.data.role);
                setEditable(response.data.role === "admin");
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch profile.");
            }
        };

        fetchProfile();
    }, [userId]);

    // Handle profile save
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const endpoint = editable
                ? `http://localhost:5000/admin/users/${profile._id}`
                : `http://localhost:5000/user/profile/${profile._id}`;
            await axios.put(endpoint, profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update profile.");
        }
    };

    // Determine if a field is editable
    const isFieldEditable = (fieldName) => {
        const adminOnlyFields = ["currentDegree", "passedDate", "raisedDate"];
        if (userRole === "admin") {
            return true; // Admin can edit all fields
        }
        // Users can only edit specific fields
        const userEditableFields = ["contactInfo.phone", "contactInfo.address"];
        return userEditableFields.includes(fieldName);
    };

    if (error) return <div>{error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
                Back
            </button>
            <h1>{profile.username}'s Profile</h1>
            <form>
                {/* Username */}
                <div className="mb-3">
                    <label>Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={profile.username || ""}
                        readOnly
                    />
                </div>
                {/* Email */}
                <div className="mb-3">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={profile.email || ""}
                        readOnly
                    />
                </div>
                {/* Phone */}
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
                {/* Address */}
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
                {/* Current Degree */}
                <div className="mb-3">
                    <label>Current Degree:</label>
                    <select
                        className="form-control"
                        value={profile.progression?.currentDegree || ""}
                        disabled={!isFieldEditable("currentDegree")}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                progression: { ...profile.progression, currentDegree: e.target.value },
                            })
                        }
                    >
                        <option value="">Select Degree</option>
                        <option value="Entered Apprentice">Entered Apprentice</option>
                        <option value="Fellowcraft">Fellowcraft</option>
                        <option value="Master Mason">Master Mason</option>
                    </select>
                </div>
                {/* Passed Date */}
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
                {/* Raised Date */}
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
                {/* Save Button */}
                <button type="button" className="btn btn-success" onClick={handleSave}>
                    Save
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
