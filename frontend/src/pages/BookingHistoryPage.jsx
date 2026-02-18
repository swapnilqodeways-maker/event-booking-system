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
    <div>
      <div className="bg-indigo-700 text-white py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-1">
            My Account
          </p>
          <h1 className="text-3xl font-extrabold">Booking History</h1>
          <p className="text-indigo-200 mt-1 text-sm">
            All events you have booked seats for
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {loading && <Spinner />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-medium">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-5xl mb-4">🎟️</p>
            <p className="text-gray-700 font-semibold text-lg">No bookings yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              You haven&apos;t booked any events yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              Browse Events
            </button>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <>
            <p className="text-sm text-gray-500 font-medium mb-5">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
            </p>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="flex items-stretch">
                    <div className="bg-indigo-600 w-1.5 shrink-0" />

                    <div className="flex flex-1 items-center justify-between gap-4 p-5">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base truncate">
                          {booking.event.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span>📅</span>
                            {new Date(booking.event.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📍</span>
                            {booking.event.location}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                          Booked on{" "}
                          {new Date(booking.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="text-center shrink-0">
                        <p className="text-2xl font-extrabold text-indigo-600">{booking.seats}</p>
                        <p className="text-xs text-gray-400 font-medium">
                          seat{booking.seats > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
