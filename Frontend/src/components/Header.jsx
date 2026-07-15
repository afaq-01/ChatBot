import React from "react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { Share, Moon, Sun, ChevronDown, Menu } from "lucide-react";
import { NavbarLogo } from "./Logo";

// ---------------------------------------------------------------------------
// HEADER
// ---------------------------------------------------------------------------
export function Header({ sidebarOpen, onToggleSidebar, theme, onToggleTheme }) {
  const { openSignIn, signOut } = useClerk();
  const { user, isLoaded } = useUser();
  return (
    <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4">
      <div className="flex items-center gap-2 min-w-0 ">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            aria-label="Show sidebar"
            className="cursor-pointer w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)] transition-colors"
          >
            <Menu size={18} strokeWidth={1.75} />
          </button>
        )}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex items-center h-8 shrink-0">
            <NavbarLogo />
          </div>
          <button className="cursor-pointer flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-heading)] px-1.5 py-1 rounded-md hover:bg-[var(--surface-1)] transition-colors">
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
          className="cursor-pointer flex w-9 h-9 rounded-lg items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--text-heading)] transition-colors"
        >
          {theme === "dark" ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
        </button>
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 ml-1 ">
          {
            user && isLoaded ? <>
              <UserButton />
            </> :
              <h1 className="cursor-pointer" onClick={() => openSignIn()}>Login</h1>

          }
        </div>
      </div>
    </header>
  );
}

export default Header;
