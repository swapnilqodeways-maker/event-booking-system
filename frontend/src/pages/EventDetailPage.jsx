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
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 mb-8 transition-colors"
      >
        ← Back to Events
      </button>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-indigo-700 px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-extrabold text-white">{event.name}</h1>
            {isSoldOut ? (
              <span className="shrink-0 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Sold Out
              </span>
            ) : (
              <span className="shrink-0 bg-green-400 text-green-900 text-xs font-bold px-3 py-1.5 rounded-full">
                Available
              </span>
            )}
          </div>
          <p className="text-indigo-200 mt-3 text-sm leading-relaxed">{event.description}</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">📅 Date</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">📍 Location</p>
              <p className="text-sm font-semibold text-gray-800">{event.location}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">Seat Availability</p>
              <p className="text-sm text-gray-500">
                <span className={`font-bold ${isSoldOut ? "text-red-500" : "text-indigo-600"}`}>
                  {event.availableSeats}
                </span>
                {" "}of {event.totalSeats} remaining
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${isSoldOut ? "bg-red-400" : "bg-indigo-500"}`}
                style={{ width: `${bookedPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{bookedPercent}% booked</p>
          </div>

          <div className={`bg-slate-50 rounded-2xl border border-slate-100 p-6 ${isSoldOut ? "opacity-50 pointer-events-none" : ""}`}>
            <h2 className="text-base font-bold text-gray-900 mb-4">Book Your Seats</h2>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-600">Seats:</label>
                <input
                  type="number"
                  min={1}
                  max={event.availableSeats}
                  value={seats}
                  onChange={(e) => setSeats(Math.max(1, Number(e.target.value)))}
                  disabled={isSoldOut}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-center bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleBook}
                disabled={isSoldOut || booking || seats < 1}
                className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                {booking ? "Booking..." : "Book Now"}
              </button>
            </div>

            {!token && !isSoldOut && (
              <p className="text-xs text-gray-400 mt-4 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                You need to{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 font-semibold underline"
                >
                  log in
                </button>{" "}
                to book seats.
              </p>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EventDetailPage;
