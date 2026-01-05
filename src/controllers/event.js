import mongoose from "mongoose";
import eventModal from "../models/event.js"
import registrationModal from "../models/registration.js";
import { handleException } from "../utilities/handleException.js";

export const getEvents = async (req, res) => {
    try {
        const events = await eventModal.find();
        return res.status(200).send(events);
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}

export const getEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await eventModal.findById(id);
        return res.status(200).send({ event });
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}

export const registerForEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const eventId = req.params.id;

        // 1️⃣ Fetch event
        const event = await eventModal.findById(eventId);
        if (!event) {
            return res.status(404).send({ errorMessage: "Event not found" });
        }

        // 2️⃣ Check registration deadline (if exists)
        if (event.registrationDeadline) {
            const today = new Date();
            const deadline = new Date(event.registrationDeadline);

            if (today > deadline) {
                return res.status(400).send({
                    errorMessage: "Registration closed for this event"
                });
            }
        }

        // 3️⃣ Check existing registration
        const existing = await registrationModal.findOne({
            userId,
            eventId: new mongoose.Types.ObjectId(eventId)
        });

        // 4️⃣ Toggle logic
        if (existing) {
            await registrationModal.deleteOne({ _id: existing._id });
            return res.status(200).send({ message: "Registration Cancelled" });
        } else {
            const registration = new registrationModal({
                userId,
                eventId: new mongoose.Types.ObjectId(eventId)
            });
            await registration.save();
            return res.status(200).send({ message: "Registration Successful" });
        }

    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status === 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        } else {
            return res.status(status).send({ errorMessage });
        }
    }
};


export const getRegistrations = async (req, res) => {
    try {
        const userId = req.user._id;
        const registrations = await registrationModal
            .find({ userId })
            .populate("eventId");

        const events = registrations.map(reg => reg.eventId);

        res.status(200).send({ events });
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}
