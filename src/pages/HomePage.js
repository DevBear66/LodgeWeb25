import CreateBooking from "./CreateBooking";
import { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/bookings")
            .then((response) => {
                setBookings(response.data);
            })
            .catch((error) => console.error("Error fetching bookings:", error));
    }, []);

    const addBooking = (newBooking) => {
        setBookings((prevBookings) => [...prevBookings, newBooking]);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Lodge Web App - Bookings</h1>

            <div className="card p-3 mb-4 shadow-sm">
                <h2 className="mb-3">Add a New Booking</h2>
                <CreateBooking onBookingAdded={addBooking} />
            </div>

            <h2 className="mb-3">All Bookings</h2>
            <ul className="list-group">
                {bookings.map((booking) => (
                    <li className="list-group-item" key={booking._id}>
                        <strong>{booking.name}</strong> -{" "}
                        {new Date(booking.eventDate).toDateString()} (
                        {booking.attendees} attendees)
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HomePage;
