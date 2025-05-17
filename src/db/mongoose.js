import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL || "")
    .then(() => {
        console.log("Connected to database");
    })
    .catch((exception) => {
        console.log(`Exception while connecting to database: ${exception}`);
    })