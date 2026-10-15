"use client";

import React from "react";
import {
  LogIn,
  LayoutDashboard,
  Database,
  Layers,
  Sparkles,
  Clock,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FlowScreen =
  | "1-login"
  | "2-dashboard"
  | "3-connect-database"
  | "4-schema-indexing"
  | "5-ai-assistant"
  | "6-query-history"
  | "7-profile-settings";

interface FlowSwitcherProps {
  currentScreen: FlowScreen;
  onSelectScreen: (screen: FlowScreen) => void;
}

export const FlowSwitcher: React.FC<FlowSwitcherProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const screens = [
    { id: "1-login" as FlowScreen, num: "1", title: "Login Page", icon: LogIn },
    { id: "2-dashboard" as FlowScreen, num: "2", title: "Dashboard", icon: LayoutDashboard },
    { id: "3-connect-database" as FlowScreen, num: "3", title: "Connect Database", icon: Database },
    { id: "4-schema-indexing" as FlowScreen, num: "4", title: "Schema Indexing", icon: Layers },
    { id: "5-ai-assistant" as FlowScreen, num: "5", title: "AI Assistant", icon: Sparkles },
    { id: "6-query-history" as FlowScreen, num: "6", title: "Query History", icon: Clock },
    { id: "7-profile-settings" as FlowScreen, num: "7", title: "Profile / Settings", icon: UserCheck },
  ];

  return (
    <div className="bg-[#0B1524] text-white border-b border-[#1E314F] px-4 py-2 z-50 transition-all select-none print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-400 flex items-center gap-1.5">
            NL2SQL UI Prototype
          </span>
          <span className="hidden md:inline-block text-xs text-slate-400">
            • 7 Reference Screen Flows
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {screens.map((s) => {
            const isCurrent = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScreen(s.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                  isCurrent
                    ? "bg-[#2563EB] text-white shadow-sm ring-1 ring-blue-300/40"
                    : "text-slate-300 hover:text-white hover:bg-[#1E314F]"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold",
                    isCurrent
                      ? "bg-white text-[#2563EB]"
                      : "bg-[#1E314F] text-slate-300"
                  )}
                >
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
