import eventModal from "../models/event.js"
import registrationModal from "../models/registration.js";
import userModal from "../models/user.js";
import { ERROR_CODES } from "../utilities/constants.js";
import { handleException } from "../utilities/handleException.js";
import mongoose from "mongoose";

export const createEvent = async (req, res) => {
    try {
        //title, desc, date, time, location, imageUrl
        const { title, description, date, time, location, imageUrl, contactNumber, type } = req.body
        //Save event
        const event = new eventModal({ title, description, date, time, location, imageUrl, contactNumber, type })
        const response = await event.save();
        //response
        res.status(200).send({ id: response._id })
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}

export const updateEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, date, time, location, imageUrl, contactNumber, type } = req.body
        const updateFields = {}
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (date) updateFields.date = date;
        if (time) updateFields.time = time;
        if (location) updateFields.location = location;
        if (imageUrl) updateFields.imageUrl = imageUrl;
        if (contactNumber) updateFields.contactNumber = contactNumber;
        if (type) updateFields.type = type;
        const updatedEvent = await eventModal.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
        res.status(200).send(updatedEvent);
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}

export const deleteEvent = async (req, res) => {
    const id = req.params.id;
    const response = await eventModal.deleteOne({ _id: id });
    res.status(200).send(id);
}

export const getEventRegistrations = async (req, res) => {
    try {
      const eventId = req.params.id;
  
      const registrations = await registrationModal
        .find({ eventId: new mongoose.Types.ObjectId(eventId) })
        .populate("userId", "name email");
  
      if (!registrations.length) {
        return res.status(200).send([]);
      }
  
      // Extract populated users
      const users = registrations.map(reg => reg.userId);
  
      return res.status(200).send(users);
  
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
  