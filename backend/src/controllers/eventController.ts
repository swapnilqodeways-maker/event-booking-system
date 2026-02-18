import { Request, Response } from "express";
import Event from "../models/Event";

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const events = await Event.find().sort({ date: 1 });

  const data = events.map((e) => ({
    _id: e._id,
    name: e.name,
    date: e.date,
    location: e.location,
    totalSeats: e.totalSeats,
    bookedSeats: e.bookedSeats,
    availableSeats: e.totalSeats - e.bookedSeats,
  }));

  res.json(data);
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  res.json({
    _id: event._id,
    name: event.name,
    description: event.description,
    date: event.date,
    location: event.location,
    totalSeats: event.totalSeats,
    bookedSeats: event.bookedSeats,
    availableSeats: event.totalSeats - event.bookedSeats,
  });
};
