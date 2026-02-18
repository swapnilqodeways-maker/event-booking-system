import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 mt-1 text-sm">All events you have booked</p>
      </div>

      {loading && <Spinner />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No bookings yet</p>
          <p className="text-gray-400 text-sm">Browse events and book your first seat!</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{booking.event.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <p>
                      <span className="font-medium text-gray-700">Date: </span>
                      {new Date(booking.event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Location: </span>
                      {booking.event.location}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Booked on: </span>
                      {new Date(booking.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-sm font-semibold px-3 py-1.5 rounded-lg">
                  {booking.seats} seat{booking.seats > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
