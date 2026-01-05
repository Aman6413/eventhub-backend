// export const googleAuth = async (req, res) => {
//   try {
//     const { credential, role } = req.body;

//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { email, name, picture } = ticket.getPayload();

//     let user = await userModel.findOne({ email });

//     // Existing user
//     if (user) {
//       const token = jwt.sign(
//         { id: user._id, role: user.role },
//         JWT_KEY,
//         { expiresIn: "7d" }
//       );

//       return res.json({
//         token,
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       });
//     }

//     // New user → ask role
//     if (!role) {
//       return res.json({
//         roleRequired: true,
//         tempUser: { email, name, picture },
//       });
//     }

//     // Create new user
//     user = await userModel.create({
//       name,
//       email,
//       role,
//       provider: "google",
//       avatar: picture,
//     });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       JWT_KEY,
//       { expiresIn: "7d" }
//     );

//     return res.json({
//       token,
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });

//   } catch (err) {
//     console.error("Google Auth Error:", err);
//     res.status(401).json({ error: "Google authentication failed" });
//   }
// };
