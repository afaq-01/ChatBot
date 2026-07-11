// model/Model.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    conversationId: { type: String, required: true, index: true },
    title: { type: String },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    feedback: { type: String, enum: ["up", "down", null], default: null },
  },
  { timestamps: true }
);

export const Chat_model = mongoose.model("Chat", chatSchema);