import eventModal from "../models/event.js";
import registrationModal from "../models/registration.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalEvents = await eventModal.countDocuments();
    const totalRegistrations = await registrationModal.countDocuments();

    const topEventAgg = await registrationModal.aggregate([
      {
        $group: {
          _id: "$eventId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let topEvent = null;

    if (topEventAgg.length > 0) {
      const event = await eventModal.findById(topEventAgg[0]._id);

      if (event) {
        topEvent = {
          _id: event._id,          // 🔥 REQUIRED
          title: event.title,
          count: topEventAgg[0].count,
        };
      }
    }

    res.status(200).send({
      totalEvents,
      totalRegistrations,
      topEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
