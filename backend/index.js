import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Chat_model } from "./model/Model.js";
import { GoogleGenAI } from "@google/genai";
import Connectdb from "./Config/mongodb_config.js";
import mongoose from "mongoose";


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
app.use(express.json({ limit: "10mb" }));

Connectdb();

//import Api and saving in variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


//Api
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, userId, conversationId, file } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!prompt && !file) return res.status(400).json({ error: "Prompt or file is required" });

    const contents = [];
    if (file?.base64 && file?.type) {
      contents.push({ inlineData: { mimeType: file.type, data: file.base64 } });
    }
    contents.push({ text: prompt || "Describe this image." });

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: "user", parts: contents }],
    });
    const text = response.text;

    const convId = conversationId || new mongoose.Types.ObjectId().toString();
    const title = prompt?.length > 40 ? prompt.slice(0, 40) + "…" : (prompt || file?.name || "New chat");

    const saved = await Chat_model.create({
      userId,
      conversationId: convId,
      title,
      prompt: prompt || "(image)",
      response: text,
    });

    res.json({ text, conversationId: convId, messageId: saved._id });
  } catch (error) {
    console.error("Gemini error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Something went wrong" });
  }
});

app.post("/api/user-data", async (req, res) => {
  try {
    const { userId } = req.body;
    const chats = await Chat_model.find({ userId }).sort({ createdAt: 1 });

    const map = new Map();
    for (const chat of chats) {
      const id = chat.conversationId;
      if (!map.has(id)) {
        map.set(id, {
          id,
          title: chat.title || chat.prompt.slice(0, 40),
          time: chat.createdAt,
          messages: [],
        });
      }
      const conv = map.get(id);
      conv.messages.push({ id: `${chat._id}-u`, role: "user", text: chat.prompt });
      conv.messages.push({
        id: `${chat._id}-a`,
        role: "assistant",
        text: chat.response,
        feedback: chat.feedback || null,
      });
      conv.time = chat.createdAt; // keep pushing forward to latest message time
    }

    const conversations = Array.from(map.values()).sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/chat/feedback", async (req, res) => {
  try {
    const { messageId, userId, feedback } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!messageId) return res.status(400).json({ error: "messageId is required" });
    if (feedback !== "up" && feedback !== "down" && feedback !== null) {
      return res.status(400).json({ error: "feedback must be 'up', 'down', or null" });
    }

    const docId = messageId.replace(/-a$/, "");

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({ error: "Invalid messageId" });
    }

    const updated = await Chat_model.findOneAndUpdate(
      { _id: docId, userId },
      { feedback },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Message not found" });

    res.json({ success: true, messageId, feedback: updated.feedback });
  } catch (error) {
    console.error("Feedback error:", error?.message || error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Deletes an entire conversation (every message document that shares its
// conversationId) for the requesting user. Since each chat "turn" is stored
// as its own Chat_model document grouped by conversationId, deleting a
// conversation means deleteMany on that conversationId — scoped to userId
// so one user can't delete another user's chat.
app.delete("/api/chat/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!conversationId) return res.status(400).json({ error: "conversationId is required" });

    const result = await Chat_model.deleteMany({ conversationId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ success: true, conversationId, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Delete conversation error:", error?.message || error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});