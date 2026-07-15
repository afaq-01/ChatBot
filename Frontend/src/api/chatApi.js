import axios from "axios";

// ---------------------------------------------------------------------------
// API — talks to YOUR Express backend at /api/chat, which itself calls
// Gemini. The backend takes { prompt, userId, conversationId } and returns
// { text, conversationId, messageId } as a single (non-streaming) JSON response.
// ---------------------------------------------------------------------------

export async function sendChatMessage({ prompt, userId, conversationId, file, signal }) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/chat/",
      { prompt, userId, conversationId, file },
      { signal }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error) || error.name === "CanceledError") throw error;
    const status = error.response?.status;
    throw new Error(`Request failed${status ? ` (${status})` : ""}`);
  }
}

// Sends like/dislike feedback for a message to the backend.
// feedback is "up" | "down" | null (null clears any previous feedback).
export async function sendFeedback({ messageId, userId, feedback, signal }) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/chat/feedback",
      { messageId, userId, feedback },
      { signal }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error) || error.name === "CanceledError") {
      throw error;
    }
    const status = error.response?.status;
    throw new Error(`Feedback request failed${status ? ` (${status})` : ""}`);
  }
}

// Deletes a conversation (and its messages) on the backend.
export async function sendDeleteConversation({ conversationId, userId, signal }) {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/chat/${conversationId}`,
      { data: { userId }, signal }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error) || error.name === "CanceledError") {
      throw error;
    }
    const status = error.response?.status;
    throw new Error(`Delete request failed${status ? ` (${status})` : ""}`);
  }
}
