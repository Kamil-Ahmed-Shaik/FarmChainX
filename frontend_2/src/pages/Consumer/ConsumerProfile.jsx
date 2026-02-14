import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

export default function ConsumerProfile() {
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState({
        username: "",
        fullName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        mobile: "",
        latitude: "",
        longitude: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await axios.get(`/consumer/${id}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setProfile({
                        ...profile,
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6)
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`/consumer/${id}/profile`, profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <DashboardLayout role="consumer" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">👤 My Profile</h2>
                <p className="dashboard-subtitle">Manage your personal information and delivery preferences</p>
            </header>

            <div className="profile-container">
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-section">
                        <h3>Personal Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" value={profile.username} disabled className="disabled-input" />
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={profile.mobile || ""}
                                    onChange={handleChange}
                                    placeholder="Enter mobile number"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Address Details</h3>
                        <div className="form-group">
                            <label>Address Line</label>
                            <textarea
                                name="address"
                                value={profile.address || ""}
                                onChange={handleChange}
                                placeholder="Enter your street address"
                                rows="2"
                                required
                            ></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={profile.city || ""}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={profile.state || ""}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={profile.pincode || ""}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Location Settings</h3>
                        <p className="section-hint">Precise location helps with accurate delivery tracking.</p>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Latitude</label>
                                <input type="number" name="latitude" value={profile.latitude || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Longitude</label>
                                <input type="number" name="longitude" value={profile.longitude || ""} onChange={handleChange} />
                            </div>
                            <button type="button" className="btn btn-location" onClick={handleLocation}>
                                📍 Get Current Location
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-save" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
