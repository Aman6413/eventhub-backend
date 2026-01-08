import jwt from "jsonwebtoken";
import userModal from "../models/user.js";
import { handleException } from "../utilities/handleException.js";

const JWT_KEY = process.env.JWT_KEY || "";

const validateToken = async (req, res, next) => {
    try {
        //Fetch token
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).send({ errorMessage: "Unauthorized" });

        // quick sanity: JWT must be three dot-separated parts
        if (typeof token !== 'string' || token.split('.').length !== 3) {
            return res.status(401).send({ errorMessage: "Unauthorized" });
        }
        else {
            //Decode token
            const decodedToken = jwt.verify(token, JWT_KEY)
            //Find User
            const user = await userModal.findOne({ _id: decodedToken.id })

            if (!user) return res.status(401).send("Unauthorized");
            else {
                //Add user to request
                req.user = user;
            }
            //Invoke next middleware
            next();
        }
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        console.error("validateToken error:", error);
        if (status === 500) {
            return res.status(500).send({ errorMessage: "Internal Server Error" });
        }
        return res.status(status).send({ errorMessage: errorMessage || "Unauthorized" });
    }
}

export default validateToken;