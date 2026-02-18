import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const isSoldOut = event.availableSeats === 0;

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className={`bg-white rounded-xl border border-gray-200 p-5 flex flex-col cursor-pointer transition-all duration-200 ${
        isSoldOut ? "opacity-60" : "hover:border-indigo-300 hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <h3 className="text-sm font-bold text-gray-900 leading-snug">{event.name}</h3>
        {isSoldOut ? (
          <span className="shrink-0 text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded border border-red-100">
            Sold Out
          </span>
        ) : (
          <span className="shrink-0 text-xs bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded border border-green-100">
            Open
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-sm text-gray-500 flex-1">
        <p>
          📅{" "}
          {new Date(event.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p>📍 {event.location}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Available seats</p>
          <p className={`text-lg font-extrabold ${isSoldOut ? "text-red-500" : "text-indigo-600"}`}>
            {isSoldOut ? "0" : event.availableSeats}
            <span className="text-xs font-normal text-gray-400 ml-1">/ {event.totalSeats}</span>
          </p>
        </div>
        <span className="text-xs text-indigo-600 font-semibold">View →</span>
      </div>
    </div>
  );
};

export default EventCard;
