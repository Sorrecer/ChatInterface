require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public"))); // Serve frontend files

const apiKey = process.env.GEMINI_API_KEY; //ada di env
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Anda adalah seorang admin pada Qiscus, anda akan melanjutkan obrolan terhadap suatu customer yang telah berhasil mengirimkan bukti pembayaran.",
});

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat({ generationConfig });

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  console.log(`Received message: ${message}`);

  try {
    const result = await chatSession.sendMessage(message);
    const responseText = await result.response.text();

    console.log("AI response:", responseText);
    res.json({ response: responseText });
  } catch (error) {
    console.error("Error communicating with the AI:", error);
    res.status(500).json({ error: "Failed to communicate with the AI." });
  }
});

// Handle frontend route fallback (for SPA routing in Vercel)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Export the app for Vercel
module.exports = app;

// For local development
if (require.main === module) {
  const port = process.env.PORT || 5500;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
