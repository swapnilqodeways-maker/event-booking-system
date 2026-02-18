import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Event } from "../types";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBook = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setBooking(true);
    try {
      await api.post("/bookings", { eventId: id, seats });
      setEvent((prev) =>
        prev ? { ...prev, bookedSeats: prev.bookedSeats + seats, availableSeats: prev.availableSeats - seats } : prev
      );
      setToast({ message: `Successfully booked ${seats} seat(s)!`, type: "success" });
      setSeats(1);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Booking failed. Please try again.";
      setToast({ message, type: "error" });
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Spinner />;
  if (!event) return null;

  const isSoldOut = event.availableSeats === 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-indigo-600 hover:underline mb-6 inline-flex items-center gap-1"
      >
        ← Back to Events
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
          {isSoldOut && (
            <span className="text-xs bg-red-100 text-red-600 font-semibold px-3 py-1 rounded-full shrink-0 ml-3">
              Fully Booked
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</p>
            <p className="text-sm font-medium text-gray-800">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Location</p>
            <p className="text-sm font-medium text-gray-800">{event.location}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Seats</p>
            <p className="text-sm font-medium text-gray-800">{event.totalSeats}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Available</p>
            <p className={`text-sm font-semibold ${isSoldOut ? "text-red-600" : "text-green-600"}`}>
              {isSoldOut ? "Sold Out" : event.availableSeats}
            </p>
          </div>
        </div>

        <div className={`border-t border-gray-100 pt-6 ${isSoldOut ? "opacity-50 pointer-events-none" : ""}`}>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Book Seats</h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">Seats:</label>
              <input
                type="number"
                min={1}
                max={event.availableSeats}
                value={seats}
                onChange={(e) => setSeats(Math.max(1, Number(e.target.value)))}
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isSoldOut}
              />
            </div>

            <button
              onClick={handleBook}
              disabled={isSoldOut || booking || seats < 1}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {booking ? "Booking..." : "Book Now"}
            </button>
          </div>

          {!token && !isSoldOut && (
            <p className="text-xs text-gray-400 mt-3">
              You need to{" "}
              <button onClick={() => navigate("/login")} className="text-indigo-600 underline">
                log in
              </button>{" "}
              to book seats.
            </p>
          )}
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default EventDetailPage;
