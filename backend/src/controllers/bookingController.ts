import { Response } from "express";
import Event from "../models/Event";
import Booking from "../models/Booking";
import { AuthRequest } from "../middleware/authMiddleware";

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  const { eventId, seats } = req.body;

  if (!eventId || !seats || seats < 1) {
    res.status(400).json({ message: "Event ID and a valid seat count are required" });
    return;
  }

  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  const availableSeats = event.totalSeats - event.bookedSeats;

  if (seats > availableSeats) {
    res.status(400).json({ message: `Only ${availableSeats} seat(s) available` });
    return;
  }

  const booking = await Booking.create({
    user: req.userId,
    event: eventId,
    seats,
  });

  await Event.findByIdAndUpdate(eventId, { $inc: { bookedSeats: seats } });

  res.status(201).json(booking);
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  const bookings = await Booking.find({ user: req.userId })
    .populate("event", "name date location")
    .sort({ createdAt: -1 });

  res.json(bookings);
};
