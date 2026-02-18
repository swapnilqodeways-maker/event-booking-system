import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState(null);

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
      setEvent((prev) => ({
        ...prev,
        bookedSeats: prev.bookedSeats + seats,
        availableSeats: prev.availableSeats - seats,
      }));
      setToast({ message: `Successfully booked ${seats} seat(s)!`, type: "success" });
      setSeats(1);
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Booking failed.", type: "error" });
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Spinner />;
  if (!event) return null;

  const isSoldOut = event.availableSeats === 0;
  const bookedPercent = Math.round((event.bookedSeats / event.totalSeats) * 100);

  return (
    <div className="page-narrow">
      <button
        onClick={() => navigate("/")}
        className="btn-link text-sm mb-6 flex items-center gap-1"
      >
        Back to Events
      </button>

      <div className="card overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold text-gray-900">{event.name}</h1>
            {isSoldOut ? (
              <span className="chip shrink-0 bg-red-50 text-red-600 border-red-100">
                Sold Out
              </span>
            ) : (
              <span className="chip shrink-0 bg-green-50 text-green-600 border-green-100">
                Available
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{event.description}</p>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Date</p>
            <p className="text-sm font-semibold text-gray-800">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Location</p>
            <p className="text-sm font-semibold text-gray-800">{event.location}</p>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Seat Availability</p>
            <p className="text-sm text-gray-600">
              <span className={`font-semibold ${isSoldOut ? "text-red-600" : "text-indigo-600"}`}>
                {event.availableSeats}
              </span>
              {" "}/ {event.totalSeats} remaining
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isSoldOut ? "bg-red-400" : "bg-indigo-500"}`}
              style={{ width: `${bookedPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{bookedPercent}% booked</p>
        </div>

        <div className={`px-6 py-6 ${isSoldOut ? "opacity-50 pointer-events-none" : ""}`}>
          <p className="text-sm font-semibold text-gray-800 mb-4">Book Seats</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Number of seats</label>
              <input
                type="number"
                min={1}
                max={event.availableSeats}
                value={seats}
                onChange={(e) => setSeats(Math.max(1, Number(e.target.value)))}
                disabled={isSoldOut}
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleBook}
              disabled={isSoldOut || booking || seats < 1}
              className="btn-primary"
            >
              {booking ? "Booking..." : "Book Now"}
            </button>
          </div>

          {!token && !isSoldOut && (
            <p className="text-xs text-gray-500 mt-3">
              Please{" "}
              <button onClick={() => navigate("/login")} className="btn-link underline">
                log in
              </button>{" "}
              to book seats.
            </p>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EventDetailPage;
