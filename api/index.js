require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public"))); // Serve frontend files

const apiKey = process.env.GEMINI_API_KEY; // Ensure GEMINI_API_KEY is set in .env
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Anda adalah seorang admin pada Qiscus, anda akan melanjutkan obrolan terhadap suatu customer yang telah berhasil mengirimkan bukti pembayaran.",
});

// Chat history yang ingin ditambahkan
const chatHistory = [
  {
    id: 885512,
    type: "text",
    message: "Selamat malam",
    sender: "customer@mail.com",
  },
  { id: 885513, type: "text", message: "Malam", sender: "agent@mail.com" },
  {
    id: 885514,
    type: "text",
    message: "Ada yang bisa saya bantu?",
    sender: "agent@mail.com",
  },
  {
    id: 885515,
    type: "text",
    message:
      "Saya ingin mengirimkan bukti pembayaran, karena diaplikasi selalu gagal",
    sender: "customer@mail.com",
  },
  {
    id: 885516,
    type: "text",
    message: "Baik, silahkan kirimkan lampiran bukti pembayarannya",
    sender: "agent@mail.com",
  },
  {
    id: 885517,
    type: "image",
    url: "https://picsum.photos/200/300",
    message: "Bukti pembayaran",
    sender: "customer@mail.com",
  },
  {
    id: 885518,
    type: "video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://picsum.photos/200/100",
    message: "Video penjelasan produk",
    sender: "agent@mail.com",
  },
  {
    id: 885519,
    type: "pdf",
    url: "https://example.com/document.pdf",
    file_name: "Invoice_12456.pdf",
    sender: "customer@mail.com",
  },
  {
    id: 885520,
    type: "text",
    message: "Terima kasih, sudah saya terima.",
    sender: "agent@mail.com",
  },
];

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Menyertakan history chat ke dalam session chat
const chatSession = model.startChat({ generationConfig, history: chatHistory });

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

// For local development, start the server
if (require.main === module) {
  const port = process.env.PORT || 5500;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
