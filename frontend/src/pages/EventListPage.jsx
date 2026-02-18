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
    <div>
      <div className="bg-indigo-700 text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-2">
            Upcoming Events
          </p>
          <h1 className="text-4xl font-extrabold mb-3">Find Your Next Experience</h1>
          <p className="text-indigo-200 text-lg max-w-xl">
            Browse our curated selection of events and secure your seat today.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading && <Spinner />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-medium">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 font-medium">No events available at the moment.</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <p className="text-sm text-gray-500 font-medium mb-6">
              {events.length} event{events.length !== 1 ? "s" : ""} available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventListPage;
