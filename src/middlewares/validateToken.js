import jwt from "jsonwebtoken";
import userModal from "../models/user.js";

const JWT_KEY = process.env.JWT_KEY || "";

const validateToken = async (req, res, next) => {
    try {
        //Fetch token
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).send("Unauthorized");
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
                if (status == 500) {
                    console.log(`Exception: ${error}`);
                    return res.status(500).send();
                }
                else return res.status(status).send({ errorMessage })
    }
}

export default validateToken;