import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-narrow">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">All events you have booked seats for</p>
      </div>

      {loading && <Spinner />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="card card-spacious text-center">
          <p className="text-gray-700 font-semibold">No bookings yet</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">Book your first event to see it here.</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Browse Events
          </button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-5">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="card card-tight flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {booking.event.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-gray-500">
                    <span>
                      Date: {new Date(booking.event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>Location: {booking.event.location}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Booked on {new Date(booking.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xl font-semibold text-indigo-600">{booking.seats}</p>
                  <p className="text-xs text-gray-400">seat{booking.seats > 1 ? "s" : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingHistoryPage;
