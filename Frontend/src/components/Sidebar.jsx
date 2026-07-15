import React from "react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { Search, PanelLeftClose, PanelLeftOpen, SquarePen, Trash2 } from "lucide-react";
import { NAV_ITEMS } from "../constants";
import { SidebarLogo } from "./Logo";

// ---------------------------------------------------------------------------
// SIDEBAR — driven by real conversation history + "New chat" works.
// ---------------------------------------------------------------------------
function SidebarNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active
        ? "bg-[var(--surface-1)] text-[var(--text-heading)]"
        : "text-[var(--text-muted)] hover:bg-[var(--bg-page)] hover:text-[var(--text-heading)]"
        }`}
    >
      <Icon size={17} strokeWidth={1.75} />
      {label}
    </button>
  );
}

export function Sidebar({ open, onToggle, conversations, activeId, onSelect, onNewChat, onDelete }) {
  const { openSignIn, signOut } = useClerk();
  const { user, isLoaded } = useUser();

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
          <div
            key={c.id}
            className={`group w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${c.id === activeId
              ? "bg-[var(--surface-1)]"
              : "hover:bg-[var(--bg-page)]"
              }`}
          >
            <button
              onClick={() => onSelect(c.id)}
              className="flex-1 min-w-0 flex items-center text-left"
            >
              <span className="flex-1 min-w-0 text-[13px] text-[var(--text-body)] truncate">
                {c.title}
              </span>
            </button>

            <span className="text-[11px] text-[var(--text-faint)] shrink-0 group-hover:hidden">
              {c.time}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
              title="Delete chat"
              className="hidden group-hover:flex shrink-0 w-6 h-6 rounded-md items-center justify-center text-[var(--text-faint)] hover:text-[var(--error)] hover:bg-[var(--surface-1)] transition-colors"
            >
              <Trash2 size={14} strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-2.5 px-1 min-w-[220px] flex justify-center ">
        {
          user && isLoaded ? <>
            <UserButton />
            <h1 className="text-white">{user.fullName}</h1>
          </> :
            <button className="h-[35px] w-[60px] bg-linear-to-br from-blue-600 to-purple-500  rounded-md" onClick={() => openSignIn()}>Login</button>

        }
      </div>
    </aside>
  );
}

export default Sidebar;
