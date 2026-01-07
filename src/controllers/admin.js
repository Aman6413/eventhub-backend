import eventModal from "../models/event.js"
import registrationModal from "../models/registration.js";
import userModal from "../models/user.js";
import { sendEmail } from "../utilities/email.js";
import templates from "../utilities/emailTemplates.js";
import { ERROR_CODES } from "../utilities/constants.js";
import { handleException } from "../utilities/handleException.js";
import mongoose from "mongoose";

export const createEvent = async (req, res) => {
  try {
      const {
          title,
          description,
          date,
          time,
          location,
          imageUrl,
          contactNumber,
          type,
          registrationDeadline   // 🔥 NEW
          ,
          maxRegistrations
      } = req.body;

      // Basic validation
        if (!registrationDeadline) {
          return res.status(400).send({
              errorMessage: "Registration deadline is required"
          });
      }

        if (maxRegistrations === undefined || maxRegistrations === null) {
          return res.status(400).send({
            errorMessage: "Max registrations is required"
          });
        }

      const event = new eventModal({
          title,
          description,
          date,
          time,
          location,
          imageUrl,
          contactNumber,
          type,
          registrationDeadline
          ,
          maxRegistrations
      });

      const response = await event.save();

          // Notify all students about the new event (async, non-blocking)
          (async () => {
            try {
              const students = await userModal.find({ role: "student" }).lean();
              const html = templates.newEventTemplate(response);
              students.forEach((s) => {
                if (s.email) sendEmail(s.email, `New event: ${response.title}`, html).catch(console.error);
              });
            } catch (e) {
              console.error("Error notifying students about new event", e);
            }
          })();
      res.status(200).send({ id: response._id });

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


export const updateEvent = async (req, res) => {
  try {
      const id = req.params.id;

      const {
          title,
          description,
          date,
          time,
          location,
          imageUrl,
          contactNumber,
          type,
          registrationDeadline   // 🔥 NEW
          ,
          maxRegistrations
      } = req.body;

      const updateFields = {};

      if (title) updateFields.title = title;
      if (description) updateFields.description = description;
      if (date) updateFields.date = date;
      if (time) updateFields.time = time;
      if (location) updateFields.location = location;
      if (imageUrl) updateFields.imageUrl = imageUrl;
      if (contactNumber) updateFields.contactNumber = contactNumber;
      if (type) updateFields.type = type;
      if (registrationDeadline)
          updateFields.registrationDeadline = registrationDeadline;
        if (maxRegistrations !== undefined && maxRegistrations !== null)
          updateFields.maxRegistrations = maxRegistrations;

      const updatedEvent = await eventModal.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
      );

        // Notify registered users about the update (async)
        (async () => {
          try {
            const registrations = await registrationModal.find({ eventId: id }).populate("userId", "email name");
            const html = templates.updatedEventTemplate(updatedEvent);
            registrations.forEach((reg) => {
              const u = reg.userId;
              if (u?.email) sendEmail(u.email, `Event updated: ${updatedEvent.title}`, html).catch(console.error);
            });
          } catch (e) {
            console.error("Error notifying registered users about event update", e);
          }
        })();

        res.status(200).send(updatedEvent);

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


export const deleteEvent = async (req, res) => {
    const id = req.params.id;

    try {
      // Notify registered users about cancellation
      const registrations = await registrationModal.find({ eventId: id }).populate("userId", "email name");
      const event = await eventModal.findById(id).lean();
      const html = templates.cancelledEventTemplate(event || {});
      registrations.forEach((reg) => {
        const u = reg.userId;
        if (u?.email) sendEmail(u.email, `Event cancelled: ${event.title}`, html).catch(console.error);
      });
    } catch (e) {
      console.error("Error notifying registered users about cancellation", e);
    }

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
  