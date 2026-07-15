import React from "react";

// ---------------------------------------------------------------------------
// THEME
// ---------------------------------------------------------------------------
export function ThemeVars() {
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

export default ThemeVars;
