import userModal from "../models/user.js";
import { ERROR_CODES } from "../utilities/constants.js";
import { handleException } from "../utilities/handleException.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utilities/email.js";
import templates from "../utilities/emailTemplates.js";

const JWT_KEY = process.env.JWT_KEY || "";

export const registerUser = async (req, res) => {
    try {
        const body = req.body;
        const { name, email, password, role } = body;
        const existingUser = await userModal.findOne({ email });
        if (existingUser) throw new Error(ERROR_CODES.USER_EXISTS);
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModal({
            name,
            email,
            password: hashedPassword,
            role,
        });

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
        const user = await userModal.findOne({ email });
        if (!user) throw new Error(ERROR_CODES.INVALID_CREDENTIALS);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error(ERROR_CODES.INVALID_CREDENTIALS);

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

// ------------------ Forgot Password Flow ------------------
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).send({ errorMessage: "Email is required" });

        const user = await userModal.findOne({ email });
        if (!user) return res.status(200).send({ message: "If that email exists, an OTP has been sent." });

        // generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetOtp = otp;
        user.resetOtpExpiry = expiry;
        await user.save();

        // send email async
        (async () => {
            try {
                const html = templates.otpTemplate(otp);
                await sendEmail(user.email, "EventHub Password Reset OTP", html);
            } catch (e) {
                console.error("Error sending OTP email", e);
            }
        })();

        return res.status(200).send({ message: "If that email exists, an OTP has been sent." });
    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).send({ errorMessage: "Email and OTP are required" });

        const user = await userModal.findOne({ email });
        if (!user) return res.status(400).send({ errorMessage: "Invalid OTP or email" });

        if (!user.resetOtp || !user.resetOtpExpiry) return res.status(400).send({ errorMessage: "No OTP requested" });
        if (new Date() > new Date(user.resetOtpExpiry)) return res.status(400).send({ errorMessage: "OTP expired" });
        if (user.resetOtp !== otp) return res.status(400).send({ errorMessage: "Invalid OTP" });

        // OTP valid — clear it and return a short-lived token to allow password reset
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        // create a reset token (not JWT secret-sensitive) - short lived
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_KEY || "", { expiresIn: '15m' });
        return res.status(200).send({ resetToken });
    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) return res.status(400).send({ errorMessage: "Invalid request" });

        let payload;
        try {
            payload = jwt.verify(resetToken, process.env.JWT_KEY || "");
        } catch (e) {
            return res.status(400).send({ errorMessage: "Invalid or expired token" });
        }

        const user = await userModal.findById(payload.id);
        if (!user) return res.status(400).send({ errorMessage: "User not found" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        (async () => {
            try {
                const html = templates.passwordResetSuccessTemplate();
                await sendEmail(user.email, "Password Reset Successful", html);
            } catch (e) {
                console.error("Error sending reset success email", e);
            }
        })();

        return res.status(200).send({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).send({ errorMessage: "Unauthorized" });

        // omit sensitive fields
        const { password, resetOtp, resetOtpExpiry, ...safe } = user.toObject ? user.toObject() : user;
        return res.status(200).send({ user: safe });
    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
};

export const changePassword = async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) return res.status(400).send({ errorMessage: "Old and new passwords are required" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).send({ errorMessage: "Old password is incorrect" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        return res.status(200).send({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
};
