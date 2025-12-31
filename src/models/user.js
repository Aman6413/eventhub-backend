import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String },
    provider: {
        type: String,
        default: "local", // local | google
    },
    avatar: String,
})

const userModal = mongoose.model("User", userSchema);

export default userModal;
