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
      name: "India Tech Summit 2026",
      description: "Premier gathering of technology leaders, developers, and innovators from across India.",
      date: new Date("2026-03-15T09:00:00.000Z"),
      location: "Bengaluru, Karnataka",
      totalSeats: 100,
      bookedSeats: 0,
    },
    {
      name: "Startup Pitch Night Mumbai",
      description: "Founders pitch their ideas live to a panel of top Indian investors in a competitive format.",
      date: new Date("2026-04-10T18:00:00.000Z"),
      location: "Mumbai, Maharashtra",
      totalSeats: 80,
      bookedSeats: 0,
    },
    {
      name: "Sunburn Music Festival",
      description: "India's biggest electronic music festival featuring top DJs and artists from around the world.",
      date: new Date("2026-05-05T14:00:00.000Z"),
      location: "Pune, Maharashtra",
      totalSeats: 500,
      bookedSeats: 0,
    },
    {
      name: "Yoga and Wellness Retreat",
      description: "A three-day wellness retreat with yoga sessions, Ayurveda workshops, and meditation classes.",
      date: new Date("2026-06-21T06:00:00.000Z"),
      location: "Rishikesh, Uttarakhand",
      totalSeats: 60,
      bookedSeats: 0,
    },
    {
      name: "Jaipur Literature Festival",
      description: "Annual celebration of literature, ideas, and culture bringing together authors and thinkers.",
      date: new Date("2026-07-18T10:00:00.000Z"),
      location: "Jaipur, Rajasthan",
      totalSeats: 200,
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
