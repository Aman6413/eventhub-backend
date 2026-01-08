import express from "express";
import { loginUser, registerUser, forgotPassword, verifyOtp, resetPassword, getProfile, changePassword } from "../controllers/auth.js";
import validateToken from "../middlewares/validateToken.js";
import { createEvent, deleteEvent, getEventRegistrations, updateEvent } from "../controllers/admin.js";
import { getEvent, getEvents, getRegistrations, registerForEvent } from "../controllers/event.js";
import adminOnly from "../middlewares/adminOnly.js";
import { getAdminAnalytics } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/verify-otp", verifyOtp);
router.post("/auth/reset-password", resetPassword);
router.get("/users/me", validateToken, getProfile);
router.put("/users/change-password", validateToken, changePassword);
router.post("/admin/events", validateToken, adminOnly, createEvent);
router.put("/admin/events/:id", validateToken, adminOnly, updateEvent);
router.delete("/admin/events/:id", validateToken, adminOnly, deleteEvent);
router.get(
  "/admin/events/:id/registrations",
  validateToken,
  adminOnly,
  getEventRegistrations
);
router.get("/events", validateToken, getEvents);
router.get("/events/:id", validateToken, getEvent);
router.post("/events/:id/register", validateToken, registerForEvent);
router.get("/users/me/registrations", validateToken, getRegistrations);
router.get("/admin/analytics", validateToken, adminOnly, getAdminAnalytics);

export default router;