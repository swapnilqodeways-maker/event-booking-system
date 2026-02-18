import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    totalSeats: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
