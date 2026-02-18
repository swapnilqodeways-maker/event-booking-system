import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  const { eventId, seats } = req.body;

  if (!eventId || !seats || seats < 1) {
    return res.status(400).json({ message: "Event ID and a valid seat count are required" });
  }

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const availableSeats = event.totalSeats - event.bookedSeats;

  if (seats > availableSeats) {
    return res.status(400).json({ message: `Only ${availableSeats} seat(s) available` });
  }

  const booking = await Booking.create({ user: req.userId, event: eventId, seats });

  await Event.findByIdAndUpdate(eventId, { $inc: { bookedSeats: seats } });

  res.status(201).json(booking);
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.userId })
    .populate("event", "name date location")
    .sort({ createdAt: -1 });

  res.json(bookings);
};
