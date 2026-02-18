import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const isSoldOut = event.availableSeats === 0;

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className={`card flex flex-col cursor-pointer transition-all duration-200 ${
        isSoldOut ? "opacity-60" : "hover:border-indigo-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-gray-900 leading-snug">
          {event.name}
        </h3>
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

      <div className="mt-4 space-y-2.5 text-sm text-gray-600 leading-relaxed">
        <p className="text-gray-800">
          {new Date(event.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-gray-500 truncate">{event.location}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {isSoldOut ? "Fully booked" : "Seats available"}
        </span>
        <span className="text-xs text-indigo-600 font-semibold">View details</span>
      </div>
    </div>
  );
};

export default EventCard;
