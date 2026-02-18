import { Router } from "express";
import { createBooking, getMyBookings } from "../controllers/bookingController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);

export default router;
