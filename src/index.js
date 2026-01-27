import dotenv from "dotenv";
dotenv.config();
import "./db/mongoose.js";
import express from "express";
import router from "./routes/routes.js";
import cors from "cors";

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
    console.log(`${req.method}, ${req.url}`);
    next();
})

app.use("/api", router);

app.listen(parseInt(port), () => {
    console.log("Server running on port: ", port);
})
