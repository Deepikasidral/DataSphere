"use client";

import React from "react";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  Clock,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types";

export type NavItemKey =
  | "dashboard"
  | "databases"
  | "assistant"
  | "history"
  | "users"
  | "settings";

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  user: UserProfile;
  onLogout?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  className,
}) => {
  const navItems = [
    {
      key: "dashboard" as NavItemKey,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "databases" as NavItemKey,
      label: "Databases",
      icon: Database,
    },
    {
      key: "assistant" as NavItemKey,
      label: "AI Assistant",
      icon: Sparkles,
    },
    {
      key: "history" as NavItemKey,
      label: "Query History",
      icon: Clock,
    },
    {
      key: "users" as NavItemKey,
      label: "Users",
      icon: Users,
    },
    {
      key: "settings" as NavItemKey,
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        "w-64 bg-[#142238] text-white flex flex-col justify-between flex-shrink-0 min-h-screen select-none border-r border-[#1e293b]/40",
        className
      )}
    >
      {/* Top Header / Brand Logo */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-[#1E314F]/50">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center shadow-md shadow-blue-500/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-wide text-white leading-tight">
              NL2SQL
            </div>
            <div className="text-[11px] text-[#94A3B8] font-normal tracking-tight">
              AI Database Assistant
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                  isActive
                    ? "bg-[#2563EB] text-white shadow-sm shadow-blue-600/30 font-semibold"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#1E314F]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : "text-[#94A3B8]"
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-[#1E314F]/60">
        <div
          onClick={() => onSelectTab("settings")}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1E314F] cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#3B82F6] text-white font-semibold flex items-center justify-center text-sm ring-2 ring-white/10 shrink-0">
              {user.initials || "J"}
            </div>
            <div className="truncate text-left">
              <div className="text-sm font-medium text-white truncate leading-tight group-hover:text-blue-300 transition-colors">
                {user.name}
              </div>
              <div className="text-xs text-[#94A3B8] truncate leading-tight mt-0.5">
                {user.role}
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              title="Sign Out"
              className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-white/5 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
