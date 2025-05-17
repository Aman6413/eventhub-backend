import express from "express";
import { loginUser, registerUser } from "../controllers/auth.js";
import validateToken from "../middlewares/validateToken.js";
import { createEvent, deleteEvent, getEventRegistrations, updateEvent } from "../controllers/admin.js";
import { getEvent, getEvents, getRegistrations, registerForEvent } from "../controllers/event.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/admin/events", validateToken, createEvent);
router.put("/admin/events/:id", validateToken, updateEvent);
router.delete("/admin/events/:id", validateToken, deleteEvent);
router.get("/admin/events/:id/registrations", validateToken, getEventRegistrations);
router.get("/events", validateToken, getEvents);
router.get("/events/:id", validateToken, getEvent);
router.post("/events/:id/register", validateToken, registerForEvent);
router.get("/users/me/registrations", validateToken, getRegistrations);

export default router;