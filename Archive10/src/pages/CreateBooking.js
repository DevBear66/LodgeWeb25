import { useState } from "react";
import axios from "axios";

function CreateBooking({ onBookingAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        eventDate: "",
        attendees: 1,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/bookings", formData);
            alert("Booking created successfully!");
            onBookingAdded(response.data);
            setFormData({ name: "", email: "", eventDate: "", attendees: 1 });
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
                <label htmlFor="name" className="form-label">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="col-md-6">
                <label htmlFor="eventDate" className="form-label">
                    Event Date
                </label>
                <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    className="form-control"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="col-md-6">
                <label htmlFor="attendees" className="form-label">
                    Attendees
                </label>
                <input
                    type="number"
                    id="attendees"
                    name="attendees"
                    className="form-control"
                    placeholder="Number of attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </div>

            <div className="col-12">
                <button type="submit" className="btn btn-primary">
                    Add Booking
                </button>
            </div>
        </form>
    );
}

export default CreateBooking;
