"use client";

import React, { useState } from "react";
import {
  Database,
  MessageSquareText,
  Users,
  Plus,
  MoreVertical,
  Bell,
  Sparkles,
  TableProperties,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatabaseConnection, QueryRecord, UserProfile } from "@/types";

interface Screen2DashboardProps {
  user: UserProfile;
  databases: DatabaseConnection[];
  queries: QueryRecord[];
  onOpenAssistant: (dbName?: string) => void;
  onConnectDatabase: () => void;
  onViewAllQueries: () => void;
  onSelectQuery?: (query: QueryRecord) => void;
}

export const Screen2_Dashboard: React.FC<Screen2DashboardProps> = ({
  user,
  databases,
  queries,
  onOpenAssistant,
  onConnectDatabase,
  onViewAllQueries,
  onSelectQuery,
}) => {
  const [activeMenuDb, setActiveMenuDb] = useState<string | null>(null);

  // Take top 3 recent queries for dashboard matching reference
  const recentQueries = queries.slice(0, 3);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] flex items-center gap-2">
            Welcome back, {user.name.split(" ")[0]}! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Let&apos;s explore your data with AI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            title="Notifications"
            className="relative p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all shadow-subtle"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#2563EB] rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Stat 1 */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-subtle flex items-center gap-4 transition-all hover:shadow-card">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A]">{databases.length}</div>
            <div className="text-xs text-[#64748B] font-medium mt-0.5">Databases</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-subtle flex items-center gap-4 transition-all hover:shadow-card">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A]">25</div>
            <div className="text-xs text-[#64748B] font-medium mt-0.5">Queries this month</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-subtle flex items-center gap-4 transition-all hover:shadow-card">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#0284C7] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A]">5</div>
            <div className="text-xs text-[#64748B] font-medium mt-0.5">Active users</div>
          </div>
        </div>
      </div>

      {/* Section: Your Databases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">Your Databases</h2>
          <Button
            onClick={onConnectDatabase}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold h-9 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Database</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {databases.map((db) => (
            <div
              key={db.id}
              className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-blue-200 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Database Card Top Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#0F172A]">
                          {db.name}
                        </h3>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {db.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span className="text-xs text-[#059669] font-medium">
                          {db.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuDb(activeMenuDb === db.id ? null : db.id)
                      }
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuDb === db.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-dropdown border border-[#E2E8F0] py-1 z-20 text-xs">
                        <button
                          onClick={() => {
                            setActiveMenuDb(null);
                            onOpenAssistant(db.name);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-[#1E293B]"
                        >
                          Query Assistant
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuDb(null);
                            alert(`Schema: ${db.tablesCount} tables, ${db.columnsCount || 40} columns detected.`);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-[#1E293B]"
                        >
                          View Schema Details
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={() => {
                            setActiveMenuDb(null);
                            alert(`Re-syncing ${db.name}...`);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-blue-600"
                        >
                          Re-index Schema
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Database Metadata */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <TableProperties className="w-3.5 h-3.5 text-slate-400" />
                    <span>{db.tablesCount} Tables</span>
                  </div>
                  <div>
                    Last updated:{" "}
                    <span className="text-[#334155] font-medium">
                      {db.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2">
                <Button
                  onClick={() => onOpenAssistant(db.name)}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold h-9 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Assistant</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Recent Queries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">Recent Queries</h2>
          <button
            onClick={onViewAllQueries}
            className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View all</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-subtle overflow-hidden divide-y divide-slate-100">
          {recentQueries.map((q, idx) => {
            const iconBg =
              idx === 0
                ? "bg-emerald-50 text-emerald-600"
                : idx === 1
                ? "bg-amber-50 text-amber-600"
                : "bg-blue-50 text-[#2563EB]";

            return (
              <div
                key={q.id}
                onClick={() => onSelectQuery ? onSelectQuery(q) : onOpenAssistant(q.database)}
                className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                    <MessageSquareText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semibold text-[#0F172A] truncate">
                      {q.question}
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5">
                      {q.database} • {q.relativeTime || q.time}
                    </div>
                  </div>
                </div>

                <Badge
                  variant={q.status === "Success" ? "success" : "blocked"}
                  className="shrink-0 font-medium"
                >
                  {q.status}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
