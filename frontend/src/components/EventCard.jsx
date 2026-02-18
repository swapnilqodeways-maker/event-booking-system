import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const isSoldOut = event.availableSeats === 0;

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className={`card p-5 flex flex-col cursor-pointer transition-all duration-200 ${
        isSoldOut ? "opacity-60" : "hover:border-indigo-300 hover:shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{event.name}</h3>
        {isSoldOut ? (
          <span className="chip shrink-0 bg-red-50 text-red-600 border-red-100">
            Sold Out
          </span>
        ) : (
          <span className="chip shrink-0 bg-green-50 text-green-600 border-green-100">
            Open
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-sm text-gray-500 flex-1 mt-3">
        <p className="flex items-center gap-2">
          <span className="text-gray-400">Date</span>
          <span className="text-gray-700">
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-gray-400">Location</span>
          <span className="text-gray-700">{event.location}</span>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Available seats</p>
          <p className={`text-lg font-semibold ${isSoldOut ? "text-red-600" : "text-indigo-600"}`}>
            {isSoldOut ? "0" : event.availableSeats}
            <span className="text-xs font-normal text-gray-400 ml-1">/ {event.totalSeats}</span>
          </p>
        </div>
        <span className="text-xs text-indigo-600 font-semibold">View details</span>
      </div>
    </div>
  );
};

export default EventCard;
