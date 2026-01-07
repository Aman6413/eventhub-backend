import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String },          // Event date
    time: { type: String },
    location: { type: String },
    imageUrl: { type: String },
    contactNumber: { type: String },
    type: { type: String },          // Technical / Cultural / Sports

    // 🔥 NEW FIELD
    registrationDeadline: {
        type: String,               // YYYY-MM-DD
        required: true
    }
    ,
    // Maximum number of allowed registrations for this event
    maxRegistrations: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const eventModel = mongoose.model("Event", eventSchema);

export default eventModel;
