import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Configuration 
dotenv.config();
const app = express();


// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://chat-bot-tau-sand.vercel.app"
    ],
    credentials: true
  })
);
app.use(express.json());

//import Api and saving in variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


//Api
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      text: response.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});