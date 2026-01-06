import mongoose from "mongoose";
import eventModal from "../models/event.js"
import registrationModal from "../models/registration.js";
import { handleException } from "../utilities/handleException.js";

export const getEvents = async (req, res) => {
  try {
    const events = await eventModal.find().lean();

    const eventIds = events.map(e => e._id);

    const registrations = await registrationModal.aggregate([
      {
        $match: {
          eventId: { $in: eventIds }
        }
      },
      {
        $group: {
          _id: "$eventId",
          count: { $sum: 1 }
        }
      }
    ]);

    const countMap = {};
    registrations.forEach(r => {
      countMap[r._id.toString()] = r.count;
    });

    const eventsWithCount = events.map(event => ({
      ...event,
      registrationCount: countMap[event._id.toString()] || 0
    }));

    res.status(200).send(eventsWithCount);

  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export const getEvent = async (req, res) => {
  try {
    const id = req.params.id;

    const event = await eventModal.findById(id).lean();
    if (!event) {
      return res.status(404).send({ errorMessage: "Event not found" });
    }

    // 🔥 Count registrations for this event
    const registrationCount = await registrationModal.countDocuments({
      eventId: new mongoose.Types.ObjectId(id),
    });

    return res.status(200).send({
      event: {
        ...event,
        registrationCount,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

export const registerForEvent = async (req, res) => {
    try {
      const userId = req.user._id;
      const eventId = req.params.id;
  
      // 1️⃣ Fetch event
      const event = await eventModal.findById(eventId);
      if (!event) {
        return res.status(404).send({ message: "Event not found" });
      }
  
      // 2️⃣ Check registration deadline (DAY-LEVEL check)
      if (event.registrationDeadline) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 🔥 normalize
  
        const deadline = new Date(event.registrationDeadline);
        deadline.setHours(23, 59, 59, 999); // 🔥 allow whole day
  
        if (today > deadline) {
          return res.status(400).send({
            message: "Registration Closed"
          });
        }
      }
  
      // 3️⃣ Check existing registration
      const existing = await registrationModal.findOne({
        userId,
        eventId: new mongoose.Types.ObjectId(eventId),
      });
  
      // 4️⃣ Toggle registration
      if (existing) {
        await registrationModal.deleteOne({ _id: existing._id });
        return res.status(200).send({
          message: "Registration Cancelled",
        });
      }
  
      const registration = new registrationModal({
        userId,
        eventId: new mongoose.Types.ObjectId(eventId),
      });
  
      await registration.save();
      return res.status(200).send({
        message: "Registration Successful",
      });
  
    } catch (error) {
      console.error("Register Event Error:", error);
      return res.status(500).send({
        message: "Something went wrong",
      });
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
