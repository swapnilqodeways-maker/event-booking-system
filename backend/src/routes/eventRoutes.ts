import { Router } from "express";
import { getEvents, getEventById } from "../controllers/eventController";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);

export default router;
