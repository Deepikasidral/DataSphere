"use client";

import React, { useState } from "react";
import {
  Database,
  Plus,
  MoreVertical,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatabaseConnection } from "@/types";

interface DatabasesListProps {
  databases: DatabaseConnection[];
  onConnectNew: () => void;
  onOpenAssistant: (dbName: string) => void;
  onTriggerIndexing: (dbName: string) => void;
}

export const Screen_DatabasesList: React.FC<DatabasesListProps> = ({
  databases,
  onConnectNew,
  onOpenAssistant,
  onTriggerIndexing,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Connected Databases</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Manage your synchronized database schemas and vector indexes
          </p>
        </div>

        <Button
          onClick={onConnectNew}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold h-9 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Database</span>
        </Button>
      </div>

      {/* Grid of connected databases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {databases.map((db) => (
          <div
            key={db.id}
            className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-blue-200 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#0F172A]">{db.name}</h3>
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
                    onClick={() => setActiveMenuId(activeMenuId === db.id ? null : db.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === db.id && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-dropdown border border-[#E2E8F0] py-1 z-20 text-xs">
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onOpenAssistant(db.name);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-[#1E293B]"
                      >
                        Open Assistant
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onTriggerIndexing(db.name);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-blue-600"
                      >
                        Re-index Schema
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Host and Connection Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Host:</span>
                  <span className="font-mono text-slate-700">{db.host}:{db.port}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Schema:</span>
                  <span className="font-medium text-slate-700">{db.databaseName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Tables / Columns:</span>
                  <span className="font-semibold text-slate-800">
                    {db.tablesCount} Tables ({db.columnsCount || 40} columns)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Vector Index:</span>
                  <span className="text-emerald-700 font-medium">Synchronized in ChromaDB</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
              <Button
                onClick={() => onOpenAssistant(db.name)}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold h-9 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Assistant</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onTriggerIndexing(db.name)}
                className="h-9 px-3 text-xs border-slate-200 text-slate-600 hover:text-blue-600"
                title="Re-index schema"
              >
                <Layers className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
