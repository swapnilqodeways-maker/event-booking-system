import { useNavigate } from "react-router-dom";
import { Event } from "../types";

const EventCard = ({ event }: { event: Event }) => {
  const navigate = useNavigate();
  const isSoldOut = event.availableSeats === 0;

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className={`bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow ${
        isSoldOut ? "opacity-60" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-gray-900 leading-snug">{event.name}</h3>
        {isSoldOut && (
          <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full shrink-0 ml-2">
            Fully Booked
          </span>
        )}
      </div>

      <div className="space-y-1 text-sm text-gray-500">
        <p>
          <span className="font-medium text-gray-700">Date: </span>
          {new Date(event.date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p>
          <span className="font-medium text-gray-700">Location: </span>
          {event.location}
        </p>
        <p>
          <span className="font-medium text-gray-700">Available Seats: </span>
          <span className={isSoldOut ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
            {isSoldOut ? "0 (Sold Out)" : event.availableSeats}
          </span>
        </p>
      </div>
    </div>
  );
};

export default EventCard;
