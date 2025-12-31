import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/user.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_KEY = process.env.JWT_KEY;

export const googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;

    // 1️⃣ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await userModel.findOne({ email });

    // 2️⃣ Existing user → normal login
    if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_KEY,
        { expiresIn: "7d" }
      );

      return res.json({
        status: "LOGIN",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // 3️⃣ New user but role NOT chosen yet
    if (!role) {
      return res.json({
        status: "ROLE_REQUIRED",
        tempUser: {
          email,
          name,
          picture,
        },
      });
    }

    // 4️⃣ Create user after role selection
    user = await userModel.create({
      name,
      email,
      role,               // student OR admin
      provider: "google",
      password: null,
      avatar: picture,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_KEY,
      { expiresIn: "7d" }
    );

    return res.json({
      status: "LOGIN",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Google Auth Error:", err.message);
    res.status(401).json({ error: "Google authentication failed" });
  }
};
