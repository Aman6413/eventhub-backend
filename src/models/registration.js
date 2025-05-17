import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    userId: { type: String },
    eventId: { type: String }
})

const registrationModal = mongoose.model("Registration", registrationSchema);

export default registrationModal;