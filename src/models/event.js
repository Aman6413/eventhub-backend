import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    date: { type: String },
    time: { type: String },
    location: { type: String },
    imageUrl: { type: String },
    contactNumber: { type: String }
})

const eventModal = mongoose.model("Event", eventSchema);

export default eventModal;