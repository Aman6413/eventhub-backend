// import ollama from "ollama";
// import eventModel from "../models/event.js";
// import registrationModel from "../models/registration.js";

// let cachedEvents = [];
// let lastFetch = 0;

// export const aiChat = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const userId = req.user?._id; // 👈 FROM TOKEN (IMPORTANT)

//     // 1️⃣ Load events (cached)
//     if (!cachedEvents.length || Date.now() - lastFetch > 60000) {
//       cachedEvents = await eventModel.find({}, "title type date");
//       lastFetch = Date.now();
//     }

//     // 2️⃣ Load user registrations
//     let registeredEvents = [];
//     if (userId) {
//       const regs = await registrationModel
//         .find({ userId })
//         .populate("eventId", "title type date");

//       registeredEvents = regs.map(r => r.eventId);
//     }

//     // 3️⃣ BUILD STRONG FACTUAL CONTEXT
//     const systemPrompt = `
// You are EventHub AI Assistant.
// You ONLY answer using the data below.
// NEVER say you don't have access to data.

// ALL EVENTS:
// ${cachedEvents.map(e =>
//   `- ${e.title} | ${e.type} | ${new Date(e.date).toDateString()}`
// ).join("\n")}

// USER REGISTERED EVENTS:
// ${registeredEvents.length
//   ? registeredEvents.map(e =>
//       `- ${e.title} | ${e.type} | ${new Date(e.date).toDateString()}`
//     ).join("\n")
//   : "NONE"}

// RULES:
// - If user asks "my registered events", answer ONLY from USER REGISTERED EVENTS
// - If user asks "technical events", filter type === Technical
// - Be short, clear, friendly
// - Never mention databases or system access
// `;

//     // 4️⃣ Ollama call
//     const response = await ollama.chat({
//       model: "qwen2.5:0.5b",
//       options: {
//         num_predict: 60,
//         temperature: 0.2
//       },
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: message }
//       ]
//     });

//     res.json({ reply: response.message.content });

//   } catch (err) {
//     console.error("AI ERROR:", err);
//     res.status(500).json({ reply: "AI failed to respond." });
//   }
// };
