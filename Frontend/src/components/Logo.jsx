import React from "react";
import { LOGO_HEIGHT } from "../constants";

export function LogoMark({ className = "" }) {
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

export function SidebarLogo() {
  return (
    <div className={`${LOGO_HEIGHT} flex items-center gap-2`}>
      <LogoMark className={`${LOGO_HEIGHT} w-8`} />
      <span className="text-[var(--text-heading)] font-semibold text-[17px] tracking-tight">Nexora</span>
    </div>
  );
}

export function NavbarLogo() {
  return (
    <div className={`${LOGO_HEIGHT} flex items-center gap-2`}>
      <LogoMark className={`${LOGO_HEIGHT} w-8`} />
      <span className="text-[var(--text-heading)] font-semibold text-[17px] tracking-tight">Nexora</span>
    </div>
  );
}
