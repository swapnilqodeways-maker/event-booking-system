import { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";
import Spinner from "../components/Spinner";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => setError("Failed to load events. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Upcoming Events</h1>
        <p className="text-gray-500 text-sm mt-1">Browse and book your next experience</p>
      </div>

      {loading && <Spinner />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="card card-spacious text-center text-gray-500">
          <p className="font-semibold text-gray-700">No events available</p>
          <p className="text-sm mt-1">Please check back later.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <>
          <p className="text-xs text-gray-400 font-medium mb-5 uppercase tracking-wide">
            {events.length} event{events.length !== 1 ? "s" : ""} available
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventListPage;
