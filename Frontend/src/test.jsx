import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Compass,
  BookOpen,
  History,
  Bookmark,
  Search,
  Share,
  Moon,
  Sun,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Globe,
  Sparkles,
  ArrowUp,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  SquarePen,
  Square,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Chat", icon: MessageSquare, active: true },
  { label: "Explore", icon: Compass },
  { label: "Prompt Library", icon: BookOpen },
  { label: "History", icon: History },
  { label: "Bookmarks", icon: Bookmark },
];

// ---------------------------------------------------------------------------
// THEME
// ---------------------------------------------------------------------------
function ThemeVars() {
  return (
    <style>{`
      .theme-dark {
        --bg-page: #212121;
        --bg-sidebar: #171717;
        --surface-1: #2a2a2a;
        --surface-2: #2f2f2f;
        --border: rgba(255,255,255,0.10);
        --border-strong: rgba(255,255,255,0.15);
        --text-heading: #f3f4f6;
        --text-body: #f3f4f6;
        --text-muted: #9ca3af;
        --text-faint: #6b7280;
        --avatar-ring: #9ca3af;
        --avatar-text: #d1d5db;
        --send-bg: #ffffff;
        --send-text: #000000;
        --error: #f87171;
      }
      .theme-light {
        --bg-page: #ffffff;
        --bg-sidebar: #f9f9f9;
        --surface-1: #ececec;
        --surface-2: #f2f2f2;
        --border: rgba(0,0,0,0.10);
        --border-strong: rgba(0,0,0,0.15);
        --text-heading: #0d0d0d;
        --text-body: #0d0d0d;
        --text-muted: #6e6e80;
        --text-faint: #8e8ea0;
        --avatar-ring: #6e6e80;
        --avatar-text: #353740;
        --send-bg: #111111;
        --send-text: #ffffff;
        --error: #dc2626;
      }
      @keyframes nexora-blink {
        0%, 100% { opacity: 0.15; }
        50% { opacity: 1; }
      }
      .nexora-caret {
        display: inline-block;
        width: 6px;
        height: 15px;
        margin-left: 2px;
        background: var(--text-faint);
        animation: nexora-blink 1s steps(1) infinite;
        vertical-align: text-bottom;
        border-radius: 1px;
      }
      @keyframes nexora-dot {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
        40% { transform: scale(1); opacity: 1; }
      }
      .nexora-dot { animation: nexora-dot 1.1s ease-in-out infinite; }
    `}</style>
  );
}

const LOGO_HEIGHT = "h-8";

function LogoMark({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#12141f" stroke="url(#logo-grad)" strokeWidth="2" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="16"
        fill="url(#logo-grad)"
      >
        N
      </text>
    </svg>
  );
}

function SidebarLogo() {
  return (
    <div className={`${LOGO_HEIGHT} flex items-center gap-2`}>
      <LogoMark className={`${LOGO_HEIGHT} w-8`} />
      <span className="text-[var(--text-heading)] font-semibold text-[17px] tracking-tight">Nexora</span>
    </div>
  );
}

function NavbarLogo() {
  return (
    <div className={`${LOGO_HEIGHT} flex items-center gap-2`}>
      <LogoMark className={`${LOGO_HEIGHT} w-8`} />
      <span className="text-[var(--text-heading)] font-semibold text-[17px] tracking-tight">Nexora</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SIDEBAR — driven by real conversation history + "New chat" works.
// ---------------------------------------------------------------------------
function SidebarNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-[var(--surface-1)] text-[var(--text-heading)]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-page)] hover:text-[var(--text-heading)]"
      }`}
    >
      <Icon size={17} strokeWidth={1.75} />
      {label}
    </button>
  );
}

function Sidebar({ open, onToggle, conversations, activeId, onSelect, onNewChat }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 h-full w-[260px] sm:w-[280px] lg:w-[300px] shrink-0 bg-[var(--bg-sidebar)] flex flex-col py-4 px-3
      transform transition-transform duration-300 ease-in-out will-change-transform
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between mb-5 px-1 min-w-[220px]">
        <div className="flex items-center h-8">
          <SidebarLogo />
        </div>
        <button
          onClick={onToggle}
          aria-label={open ? "Hide sidebar" : "Show sidebar"}
          className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-page)] hover:text-[var(--text-heading)] transition-colors"
        >
          {open ? <PanelLeftClose size={17} strokeWidth={1.75} /> : <PanelLeftOpen size={17} strokeWidth={1.75} />}
        </button>
      </div>

      <button
        onClick={onNewChat}
        className="w-full mb-4 min-w-[220px] rounded-lg border border-[var(--border-strong)] text-[var(--text-heading)] text-sm font-medium py-2.5 px-3 flex items-center gap-2.5 hover:bg-[var(--bg-page)] transition-colors"
      >
        <SquarePen size={17} strokeWidth={1.75} />
        New chat
      </button>

      <nav className="flex flex-col gap-1 mb-5 min-w-[220px]">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="h-px bg-[var(--border)] mb-4 min-w-[220px]" />

      <div className="flex items-center justify-between mb-2 px-1 min-w-[220px]">
        <span className="text-[var(--text-faint)] font-medium text-xs uppercase tracking-wide">Recent</span>
        <Search size={14} className="text-[var(--text-faint)]" />
      </div>
      <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 -mx-1 px-1 min-w-[220px]">
        {conversations.length === 0 && (
          <p className="text-[13px] text-[var(--text-faint)] px-3 py-2">No conversations yet</p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              c.id === activeId ? "bg-[var(--surface-1)]" : "hover:bg-[var(--bg-page)]"
            }`}
          >
            <span className="flex-1 min-w-0 text-[13px] text-[var(--text-body)] truncate">
              {c.title}
            </span>
            <span className="text-[11px] text-[var(--text-faint)] shrink-0">{c.time}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-2.5 px-1 min-w-[220px]">
        <img
          src="https://i.pravatar.cc/64?img=13"
          alt="Aman Verma"
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="text-[var(--text-heading)] text-sm font-medium truncate">Aman Verma</div>
          <div className="text-[var(--text-faint)] text-xs truncate">aman.verma@example.com</div>
        </div>
        <ChevronDown size={15} className="text-[var(--text-faint)] shrink-0" />
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// HEADER
// ---------------------------------------------------------------------------
function Header({ sidebarOpen, onToggleSidebar, theme, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4">
      <div className="flex items-center gap-2 min-w-0">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            aria-label="Show sidebar"
            className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)] transition-colors"
          >
            <Menu size={18} strokeWidth={1.75} />
          </button>
        )}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex items-center h-8 shrink-0">
            <NavbarLogo />
          </div>
          <button className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-heading)] px-1.5 py-1 rounded-md hover:bg-[var(--surface-1)] transition-colors">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)] transition-colors">
          <Share size={17} strokeWidth={1.75} />
        </button>
        <button
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex w-9 h-9 rounded-lg items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)] transition-colors"
        >
          {theme === "dark" ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
        </button>
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 ml-1">
          <img
            src="https://i.pravatar.cc/64?img=13"
            className="w-full h-full rounded-full object-cover"
            alt="avatar"
          />
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// CHAT AREA
// ---------------------------------------------------------------------------
function BotAvatar() {
  return (
    <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-6 h-6">
        <circle cx="20" cy="20" r="18" fill="none" stroke="var(--avatar-ring)" strokeWidth="2.5" />
        <text
          x="20"
          y="27"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fontSize="17"
          fill="var(--avatar-text)"
        >
          N
        </text>
      </svg>
    </div>
  );
}

function BotBubble({ children }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 max-w-full">
      <BotAvatar />
      <div className="min-w-0 flex-1 pt-1">{children}</div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] sm:max-w-[70%] bg-[var(--surface-2)] rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3 text-[var(--text-body)]">
        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="w-2 h-2 rounded-full bg-[var(--text-faint)] nexora-dot" style={{ animationDelay: "0s" }} />
      <span className="w-2 h-2 rounded-full bg-[var(--text-faint)] nexora-dot" style={{ animationDelay: "0.15s" }} />
      <span className="w-2 h-2 rounded-full bg-[var(--text-faint)] nexora-dot" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}

// Minimal markdown-ish renderer: paragraphs + fenced code blocks + inline code.
function MessageContent({ text }) {
  const parts = text.split(/```/g);
  return (
    <div className="text-[15px] text-[var(--text-body)] leading-relaxed space-y-3">
      {parts.map((chunk, i) => {
        const isCode = i % 2 === 1;
        if (isCode) {
          const lines = chunk.split("\n");
          const lang = lines[0].trim();
          const code = lines.slice(1).join("\n") || lines[0];
          return (
            <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-[#1a1a1a]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a2a]">
                <span className="text-xs text-gray-400 font-mono">{lang || "code"}</span>
                <button
                  onClick={() => navigator.clipboard && navigator.clipboard.writeText(code)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-100 transition-colors"
                >
                  <Copy size={13} />
                  Copy
                </button>
              </div>
              <pre className="px-4 py-3 text-[13px] leading-6 font-mono overflow-x-auto text-gray-200 whitespace-pre-wrap">
                {code}
              </pre>
            </div>
          );
        }
        return chunk.split("\n\n").filter(Boolean).map((para, j) => (
          <p key={`${i}-${j}`} className="whitespace-pre-wrap break-words">
            {para}
          </p>
        ));
      })}
    </div>
  );
}

function MessageActions({ text }) {
  const [liked, setLiked] = useState(null); // null | 'up' | 'down'
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-1 pt-1 -ml-1.5">
      <button
        onClick={() => {
          if (navigator.clipboard) navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        title={copied ? "Copied!" : "Copy"}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)] transition-colors"
      >
        <Copy size={15} strokeWidth={1.75} />
      </button>
      <button
        onClick={() => setLiked((v) => (v === "up" ? null : "up"))}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          liked === "up" ? "text-[var(--text-heading)] bg-[var(--surface-1)]" : "text-[var(--text-faint)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)]"
        }`}
      >
        <ThumbsUp size={15} strokeWidth={1.75} />
      </button>
      <button
        onClick={() => setLiked((v) => (v === "down" ? null : "down"))}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          liked === "down" ? "text-[var(--text-heading)] bg-[var(--surface-1)]" : "text-[var(--text-faint)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)]"
        }`}
      >
        <ThumbsDown size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}

function ChatArea({ messages, isStreaming, error, endRef }) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 w-12 h-12">
            <BotAvatar />
          </div>
          <h2 className="text-[var(--text-heading)] text-xl font-semibold mb-1">How can I help you today?</h2>
          <p className="text-[var(--text-faint)] text-sm">Ask me anything — I'm connected to the backend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="max-w-3xl mx-auto py-6 sm:py-8 flex flex-col gap-6 sm:gap-7">
        {messages.map((m, idx) => {
          const isLast = idx === messages.length - 1;
          if (m.role === "user") {
            return <UserBubble key={m.id} text={m.text} />;
          }
          return (
            <BotBubble key={m.id}>
              {m.text.length === 0 && isLast && isStreaming ? (
                <TypingDots />
              ) : (
                <>
                  <MessageContent text={m.text} />
                  {m.text && <MessageActions text={m.text} />}
                </>
              )}
            </BotBubble>
          );
        })}
        {error && (
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 shrink-0" />
            <p className="text-[var(--error)] text-[14px] leading-relaxed">{error}</p>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMPOSER
// ---------------------------------------------------------------------------
function Composer({ onSend, disabled, isStreaming, onStop }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  return (
    <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[28px] bg-[var(--surface-2)] px-3 sm:px-4 py-2.5 sm:py-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nexora..."
            className="w-full bg-transparent outline-none resize-none text-[var(--text-body)] placeholder:text-[var(--text-faint)] text-[15px] px-1.5 py-1.5 mb-1"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[var(--text-muted)] text-xs sm:text-sm">
              <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--surface-1)] transition-colors">
                <Paperclip size={17} strokeWidth={1.75} />
              </button>
              <button className="flex items-center gap-1.5 whitespace-nowrap hover:bg-[var(--surface-1)] transition-colors rounded-full px-3 py-2">
                <Globe size={16} strokeWidth={1.75} />
                <span className="hidden xs:inline">Search</span>
              </button>
              <button className="flex items-center gap-1.5 whitespace-nowrap hover:bg-[var(--surface-1)] transition-colors rounded-full px-3 py-2">
                <Sparkles size={16} strokeWidth={1.75} />
                <span className="hidden xs:inline">Enhance</span>
              </button>
            </div>
            {isStreaming ? (
              <button
                onClick={onStop}
                title="Stop generating"
                className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-[var(--send-bg)] text-[var(--send-text)] transition-colors"
              >
                <Square size={14} strokeWidth={2} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!value.trim()}
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                  value.trim()
                    ? "bg-[var(--send-bg)] text-[var(--send-text)]"
                    : "bg-[var(--surface-1)] text-[var(--text-faint)]"
                }`}
              >
                <ArrowUp size={18} strokeWidth={2.25} />
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-[11px] text-[var(--text-faint)] mt-3 px-2">
          Nexora can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// API — talks to YOUR Express backend at /api/chat, which itself calls
// Gemini. The backend takes { prompt } and returns { text } as a single
// (non-streaming) JSON response.
// ---------------------------------------------------------------------------

async function sendChatMessage({ prompt, signal }) {
  const response = await fetch("https://chatbot-production-005c.up.railway.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const data = await response.json();
  return data.text;
}

// ---------------------------------------------------------------------------
export default function NexoraChatUI() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // conversations: { id, title, time, messages: [{id, role, text}] }
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const endRef = useRef(null);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;
  const messages = activeConversation ? activeConversation.messages : [];

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

  const handleSend = async (text) => {
    setError(null);
    let convId = activeId;

    if (!convId) {
      convId = `conv-${Date.now()}`;
      const title = text.length > 40 ? text.slice(0, 40) + "…" : text;
      const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setConversations((prev) => [{ id: convId, title, time, messages: [] }, ...prev]);
      setActiveId(convId);
    }

    const userMsg = { id: `u-${Date.now()}`, role: "user", text };
    const botMsgId = `a-${Date.now()}`;
    const botMsg = { id: botMsgId, role: "assistant", text: "" };

    updateConversation(convId, (c) => ({ ...c, messages: [...c.messages, userMsg, botMsg] }));

    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // NOTE: the backend only accepts a single `prompt` string right now,
      // so only the latest user message is sent (no multi-turn memory yet).
      const replyText = await sendChatMessage({ prompt: text, signal: controller.signal });
      updateConversation(convId, (c) => ({
        ...c,
        messages: c.messages.map((m) => (m.id === botMsgId ? { ...m, text: replyText } : m)),
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
      />

      <div
        onClick={toggleSidebar}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ease-in-out ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <ChatArea messages={messages} isStreaming={isStreaming} error={error} endRef={endRef} />
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