export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
}

export interface Booking {
  _id: string;
  event: Pick<Event, "_id" | "name" | "date" | "location">;
  seats: number;
  createdAt: string;
}
