import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

import { ThemeVars } from "./components/ThemeVars";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ChatArea } from "./components/ChatArea";
import { Composer } from "./components/Composer";
import { sendChatMessage, sendFeedback, sendDeleteConversation } from "./api/chatApi";

// ---------------------------------------------------------------------------
export default function Home_Page() {
  // FIX: useUser() must be called at the top level of the component,
  // not inside handleSend (that caused "Invalid hook call").
  const { user, isLoaded } = useUser();
  const userId = user ? user.id : null;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // conversations: { id, title, time, messages: [{id, role, text, feedback?}] }
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const endRef = useRef(null);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;
  const messages = activeConversation ? activeConversation.messages : [];

  const getting_data = async () => {
    try {
      if (user && isLoaded) {
        const response = await axios.post("http://localhost:5000/api/user-data", { userId });
        console.log("RAW response.data:", response.data);
        const chats = response.data || [];
        const formatted = chats.map((c) => ({
          ...c,
          time: new Date(c.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        }));
        setConversations(formatted); // NOT [chats] — that was wrapping the whole array
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getting_data();
  }, [user, isLoaded]);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const updateConversation = (id, updater) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  };

  const handleNewChat = () => {
    setActiveId(null);
    setError(null);
  };

  const handleSelect = (id) => {
    setActiveId(id);
    setError(null);
  };

  const handleSend = async (text, file) => {
    setError(null);

    // FIX: guard on user/isLoaded from the top-level hook instead of
    // calling useUser() here (which is not allowed inside a callback).
    if (!isLoaded || !user) {
      setError("Please sign in to chat.");
      return;
    }

    let convId = activeId;

    if (!convId) {
      convId = `conv-${Date.now()}`;
      const title = text
        ? (text.length > 40 ? text.slice(0, 40) + "…" : text)
        : (file?.name || "New chat");
      const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setConversations((prev) => [{ id: convId, title, time, messages: [] }, ...prev]);
      setActiveId(convId);
    }

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text || "",
      imagePreview: file ? `data:${file.type};base64,${file.base64}` : null,
    };
    const botMsgId = `a-${Date.now()}`;
    const botMsg = { id: botMsgId, role: "assistant", text: "", feedback: null };

    updateConversation(convId, (c) => ({ ...c, messages: [...c.messages, userMsg, botMsg] }));

    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const replyData = await sendChatMessage({
        prompt: text || "Describe this image.",
        userId: user.id,
        conversationId: convId,
        file,
        signal: controller.signal,
      });

      updateConversation(convId, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === botMsgId
            ? { ...m, id: `${replyData.messageId}-a`, text: replyData.text }
            : m
        ),
      }));
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Something went wrong reaching the server. Please try again.");
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortRef.current) abortRef.current.abort();
  };

  // Wires up the thumbs up/down buttons on each assistant message to the
  // backend feedback endpoint, with an optimistic UI update + rollback on error.
  const handleFeedback = async (messageId, value) => {
    if (!activeId || !user) return;

    const prevConversation = conversations.find((c) => c.id === activeId);
    const prevMessage = prevConversation?.messages.find((m) => m.id === messageId);
    const prevValue = prevMessage ? prevMessage.feedback ?? null : null;

    // optimistic update
    updateConversation(activeId, (c) => ({
      ...c,
      messages: c.messages.map((m) => (m.id === messageId ? { ...m, feedback: value } : m)),
    }));

    try {
      await sendFeedback({ messageId, userId: user.id, feedback: value });
    } catch (err) {
      // rollback on failure
      updateConversation(activeId, (c) => ({
        ...c,
        messages: c.messages.map((m) => (m.id === messageId ? { ...m, feedback: prevValue } : m)),
      }));
    }
  };

  // Deletes a chat from the Recent list. Optimistically removes it (and
  // clears it as the active conversation if needed), then calls the
  // backend; restores it at its original position on failure.
  const handleDeleteConversation = async (conversationId) => {
    if (!user) return;

    const index = conversations.findIndex((c) => c.id === conversationId);
    if (index === -1) return;
    const removed = conversations[index];

    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (activeId === conversationId) {
      setActiveId(null);
      setError(null);
    }

    try {
      await sendDeleteConversation({ conversationId, userId: user.id });
    } catch (err) {
      // rollback on failure — put it back where it was
      setConversations((prev) => {
        const next = [...prev];
        next.splice(index, 0, removed);
        return next;
      });
      setError("Couldn't delete that chat. Please try again.");
    }
  };

  return (
    <div
      className={`w-full h-screen ${theme === "dark" ? "theme-dark" : "theme-light"} bg-[var(--bg-page)] text-[var(--text-body)] flex font-sans overflow-hidden relative transition-colors duration-300`}
    >
      <ThemeVars />
      <Sidebar
        open={sidebarOpen}
        onToggle={toggleSidebar}
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
      />

      <div
        onClick={toggleSidebar}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ease-in-out ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <ChatArea
          messages={messages}
          isStreaming={isStreaming}
          error={error}
          endRef={endRef}
          onFeedback={handleFeedback}
        />
        <Composer
          onSend={handleSend}
          disabled={isStreaming}
          isStreaming={isStreaming}
          onStop={handleStop}
        />
      </main>
    </div>
  );
}
