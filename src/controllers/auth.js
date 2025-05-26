import userModal from "../models/user.js";
import { ERROR_CODES } from "../utilities/constants.js";
import { handleException } from "../utilities/handleException.js";
import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY || "";

export const registerUser = async (req, res) => {
    try {
        const body = req.body;
        const { name, email, password, role } = body;
        const existingUser = await userModal.findOne({ email });
        if (existingUser) throw new Error(ERROR_CODES.USER_EXISTS);
        const user = new userModal({ name, email, password, role });
        const response = await user.save();
        const token = jwt.sign({ id: response._id }, JWT_KEY, { expiresIn: '7d' });
        return res.status(200).send({ token: token, name: response.name, email: response.email, role: response.role });
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}

export const loginUser = async (req, res) => {
    try {
        //email and password
        const { email, password } = req.body;
        //Check if user exits
        const user = await userModal.findOne({ email, password });
        if (!user) throw new Error(ERROR_CODES.INVALID_CREDENTIALS)
        //Generate token
        const token = jwt.sign({ id: user._id }, JWT_KEY, { expiresIn: "7d" })
        //Send response
        return res.status(200).send({ token, id: user._id, email: user.email, role: user.role, name: user.name })
    } catch (error) {
        const { status, errorMessage } = handleException(error.message);
        if (status == 500) {
            console.log(`Exception: ${error}`);
            return res.status(500).send();
        }
        else return res.status(status).send({ errorMessage })
    }
}