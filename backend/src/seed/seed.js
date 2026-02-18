import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

dotenv.config({ path: "../../.env" });
dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Event.deleteMany({});
  await Booking.deleteMany({});
  console.log("Cleared existing data");

  const users = [
    { name: "Swapnil Patil", email: "swapnil@gmail.com", password: await bcrypt.hash("password123", 10) },
    { name: "Vishal Sharma", email: "vishal@gmail.com", password: await bcrypt.hash("password456", 10) },
  ];

  await User.insertMany(users);
  console.log("Users seeded");

  const events = [
    {
      name: "Tech Summit 2026",
      description: "Annual gathering of technology professionals and innovators from across the globe.",
      date: new Date("2026-03-15T09:00:00.000Z"),
      location: "Lagos, Nigeria",
      totalSeats: 100,
      bookedSeats: 0,
    },
    {
      name: "Creative Arts Expo",
      description: "A vibrant showcase of emerging artists spanning painting, sculpture, and digital art.",
      date: new Date("2026-04-10T10:00:00.000Z"),
      location: "Abuja, Nigeria",
      totalSeats: 50,
      bookedSeats: 0,
    },
    {
      name: "Startup Pitch Night",
      description: "Founders pitch their ideas live to a panel of top investors in a competitive format.",
      date: new Date("2026-05-05T18:00:00.000Z"),
      location: "Port Harcourt, Nigeria",
      totalSeats: 80,
      bookedSeats: 0,
    },
    {
      name: "Health and Wellness Fair",
      description: "Interactive health screenings, expert talks, and wellness product demonstrations.",
      date: new Date("2026-06-20T08:00:00.000Z"),
      location: "Ibadan, Nigeria",
      totalSeats: 200,
      bookedSeats: 0,
    },
    {
      name: "Music Festival Lagos",
      description: "A one-day outdoor music festival featuring the top Nigerian artists of the year.",
      date: new Date("2026-07-12T14:00:00.000Z"),
      location: "Lagos, Nigeria",
      totalSeats: 500,
      bookedSeats: 0,
    },
  ];

  await Event.insertMany(events);
  console.log("Events seeded");

  console.log("\nSeed complete.");
  console.log("  swapnil@gmail.com / password123");
  console.log("  vishal@gmail.com  / password456");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
