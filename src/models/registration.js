import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    }
});  

const registrationModal = mongoose.model("Registration", registrationSchema);

export default registrationModal;