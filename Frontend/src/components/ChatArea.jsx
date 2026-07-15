import React, { useState } from "react";
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";

// ---------------------------------------------------------------------------
// CHAT AREA
// ---------------------------------------------------------------------------
export function BotAvatar() {
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

export function BotBubble({ children }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 max-w-full">
      <BotAvatar />
      <div className="min-w-0 flex-1 pt-1">{children}</div>
    </div>
  );
}

export function UserBubble({ text, imagePreview }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] sm:max-w-[70%] bg-[var(--surface-2)] rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3 text-[var(--text-body)]">
        {imagePreview && (
          <img src={imagePreview} alt="attachment" className="rounded-xl mb-2 max-h-48 object-cover" />
        )}
        {text && <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">{text}</p>}
      </div>
    </div>
  );
}

export function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="w-2 h-2 rounded-full bg-[var(--text-faint)] nexora-dot" style={{ animationDelay: "0s" }} />
      <span className="w-2 h-2 rounded-full bg-[var(--text-faint)] nexora-dot" style={{ animationDelay: "0.15s" }} />
      <span className="w-2 h-2 rounded-full bg-[var(--text-faint)] nexora-dot" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}

// Minimal markdown-ish renderer: paragraphs + fenced code blocks + inline code.
export function MessageContent({ text }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
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
                  onClick={() => {
                    if (navigator.clipboard) navigator.clipboard.writeText(code);
                    setCopiedIndex(i);
                    setTimeout(() => setCopiedIndex(null), 1500);
                  }}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-100 transition-colors"
                >
                  {copiedIndex === i ? (
                    <>
                      <Check size={13} className="text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
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

// ---------------------------------------------------------------------------
// MESSAGE ACTIONS — copy + working like/dislike.
// `feedback` is the persisted value on the message ("up" | "down" | null),
// lifted up so it survives re-renders and can be hydrated from history.
// `onFeedback(value)` is called with the NEW value the user wants; the
// parent is responsible for the optimistic update + API call + rollback.
// ---------------------------------------------------------------------------
export function MessageActions({ text, feedback, onFeedback }) {
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);

  const handleFeedback = async (value) => {
    if (pending || !onFeedback) return;
    const next = feedback === value ? null : value; // clicking the active one again clears it
    setPending(true);
    try {
      await onFeedback(next);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-1 pt-1 -ml-1.5">
      <button
        onClick={() => {
          if (navigator.clipboard) navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        title={copied ? "Copied!" : "Copy"}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-faint)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)] transition-colors"
      >
        {copied ? (
          <Check size={15} strokeWidth={1.75} className="text-green-500" />
        ) : (
          <Copy size={15} strokeWidth={1.75} />
        )}
      </button>
      <button
        onClick={() => handleFeedback("up")}
        disabled={pending}
        title="Good response"
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${feedback === "up"
          ? "text-[var(--text-heading)] bg-[var(--surface-1)]"
          : "text-[var(--text-faint)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)]"
          }`}
      >
        <ThumbsUp size={15} strokeWidth={1.75} fill={feedback === "up" ? "currentColor" : "none"} />
      </button>
      <button
        onClick={() => handleFeedback("down")}
        disabled={pending}
        title="Bad response"
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${feedback === "down"
          ? "text-[var(--text-heading)] bg-[var(--surface-1)]"
          : "text-[var(--text-faint)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)]"
          }`}
      >
        <ThumbsDown size={15} strokeWidth={1.75} fill={feedback === "down" ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

export function ChatArea({ messages, isStreaming, error, endRef, onFeedback }) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 w-12 h-12">
            <BotAvatar />
          </div>
          <h2 className="text-[var(--text-heading)] text-xl font-semibold mb-1">How can I help you today?</h2>
          <p className="text-[var(--text-faint)] text-sm">Ask me anything — I'm connected to the backend.</p>
          <p className="text-[var(--text-faint)] text-sm">Build BY : Afaq Ahmad</p>

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
            return <UserBubble key={m.id} text={m.text} imagePreview={m.imagePreview} />;
          }
          return (
            <BotBubble key={m.id}>
              {m.text.length === 0 && isLast && isStreaming ? (
                <TypingDots />
              ) : (
                <>
                  <MessageContent text={m.text} />
                  {m.text && (
                    <MessageActions
                      text={m.text}
                      feedback={m.feedback ?? null}
                      onFeedback={(value) => onFeedback(m.id, value)}
                    />
                  )}
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

export default ChatArea;
