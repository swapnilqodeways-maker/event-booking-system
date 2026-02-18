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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="text-gray-500 text-sm mt-1">Browse and book your next experience</p>
      </div>

      {loading && <Spinner />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">No events available at the moment.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <>
          <p className="text-xs text-gray-400 font-medium mb-5 uppercase tracking-wide">
            {events.length} event{events.length !== 1 ? "s" : ""} available
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
