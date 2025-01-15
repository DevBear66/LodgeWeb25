import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
    const { userId } = useParams(); // Get userId from route parameters
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState(""); // To track the logged-in user's role
    const [loading, setLoading] = useState(true); // Track loading state

    // Fetch profile and user role
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    setLoading(false);
                    return;
                }

                // Fetch user profile
                const profileResponse = await axios.get(
                    userId
                        ? `http://localhost:5000/user/profile/${userId}`
                        : "http://localhost:5000/user/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Fetch logged-in user's role
                const roleResponse = await axios.get("http://localhost:5000/user/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfile(profileResponse.data);
                setUserRole(roleResponse.data.role);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch profile.");
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/admin/users/${profile._id}`, profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update profile.");
        }
    };

    const isFieldEditable = (fieldName) => {
        const userEditableFields = ["phone", "address"];
        const adminOnlyFields = ["currentDegree", "passedDate", "raisedDate"];

        // Admin can edit all fields
        if (userRole === "admin") {
            return true;
        }

        // Regular user can edit only specific fields
        return userRole === "user" && userEditableFields.includes(fieldName);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
