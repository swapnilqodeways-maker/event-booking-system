import { useNavigate } from "react-router-dom";

const accentColors = ["bg-indigo-500", "bg-violet-500", "bg-sky-500", "bg-emerald-500", "bg-rose-500"];

const EventCard = ({ event, index }) => {
  const navigate = useNavigate();
  const isSoldOut = event.availableSeats === 0;
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col cursor-pointer transition-all duration-300 ${
        isSoldOut ? "opacity-70" : "hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      <div className={`h-1.5 w-full ${accent}`} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-bold text-gray-900 leading-snug pr-2">{event.name}</h3>
          {isSoldOut ? (
            <span className="shrink-0 text-xs bg-red-100 text-red-600 font-semibold px-2.5 py-1 rounded-full">
              Sold Out
            </span>
          ) : (
            <span className="shrink-0 text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
              Open
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-500 flex-1">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-0.5">
              Seats Left
            </p>
            <p className={`text-xl font-extrabold ${isSoldOut ? "text-red-500" : "text-indigo-600"}`}>
              {isSoldOut ? "0" : event.availableSeats}
              <span className="text-xs font-normal text-gray-400 ml-1">/ {event.totalSeats}</span>
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
            View →
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
