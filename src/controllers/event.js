import eventModal from "../models/event.js"
import registrationModal from "../models/registration.js";
import { handleException } from "../utilities/handleException.js";

export const getEvents = async (req, res) => {
    try {
        const events = await eventModal.find();

        return res.status(200).send({ events });
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
        const registration = new registrationModal({ userId, eventId });
        const response = await registration.save();
        res.status(200).send({ message: "Registration Successfull" });
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}

export const getRegistrations = async (req, res) => {
    try {
        const userId = req.user._id;
        const registrations = await registrationModal.find({ userId });
        res.status(200).send({ registrations });
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}