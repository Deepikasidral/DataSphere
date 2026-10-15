"use client";

import React, { useState } from "react";
import {
  Eye,
  Search,
  ChevronDown,
  X,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QueryRecord } from "@/types";

interface Screen6QueryHistoryProps {
  queries: QueryRecord[];
  onOpenInAssistant?: (query: QueryRecord) => void;
}

export const Screen6_QueryHistory: React.FC<Screen6QueryHistoryProps> = ({
  queries,
  onOpenInAssistant,
}) => {
  const [selectedDbFilter, setSelectedDbFilter] = useState("All Databases");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalQuery, setActiveModalQuery] = useState<QueryRecord | null>(null);
  const [copiedModal, setCopiedModal] = useState(false);

  const filteredQueries = queries.filter((q) => {
    const matchesDb =
      selectedDbFilter === "All Databases" ||
      q.database.toLowerCase() === selectedDbFilter.toLowerCase();
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.sql.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDb && matchesSearch;
  });

  const handleCopySql = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedModal(true);
    setTimeout(() => setCopiedModal(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Query History</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            View all your past queries, SQL, and results
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search past queries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white rounded-lg border border-[#CBD5E1] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Database filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#64748B] whitespace-nowrap">
              Filter by database:
            </span>
            <div className="relative">
              <select
                value={selectedDbFilter}
                onChange={(e) => setSelectedDbFilter(e.target.value)}
                className="h-9 pl-3 pr-8 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#1E293B] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer shadow-subtle"
              >
                <option value="All Databases">All Databases</option>
                <option value="Company DB">Company DB</option>
                <option value="HR Database">HR Database</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Query History Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5">Question</th>
                <th className="px-4 py-3.5">Database</th>
                <th className="px-4 py-3.5">Time</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#1E293B]">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No matching queries found.
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q, idx) => (
                  <tr
                    key={q.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#0F172A] max-w-md">
                      {q.question}
                    </td>
                    <td className="px-4 py-3.5 text-[#475569] font-medium whitespace-nowrap">
                      {q.database}
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] whitespace-nowrap">
                      {q.time}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <Badge
                        variant={q.status === "Success" ? "success" : "blocked"}
                      >
                        {q.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setActiveModalQuery(q)}
                        title="View details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Query Detail Modal */}
      {activeModalQuery && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">
                  Query Details
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-0.5">
                  {activeModalQuery.question}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1">
                  <span>Database: {activeModalQuery.database}</span>
                  <span>•</span>
                  <span>Executed: {activeModalQuery.time}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalQuery(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SQL Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#334155]">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Synthesized SQL</span>
                </div>
                <button
                  onClick={() => handleCopySql(activeModalQuery.sql)}
                  className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
                >
                  {copiedModal ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#0F172A] overflow-x-auto leading-relaxed">
                <code>{activeModalQuery.sql}</code>
              </pre>
            </div>

            {/* Results Snapshot */}
            {activeModalQuery.status === "Blocked" ? (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                <div className="font-bold">Security Safeguard Triggered</div>
                <div className="mt-0.5">{activeModalQuery.errorMessage}</div>
              </div>
            ) : (
              activeModalQuery.rows && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#334155]">
                    Returned Data ({activeModalQuery.rowCount || activeModalQuery.rows.length} rows in {activeModalQuery.executionTime || "0.23s"})
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAFC] text-[#475569] font-semibold border-b border-slate-200">
                        <tr>
                          {activeModalQuery.columns?.map((c) => (
                            <th key={c} className="px-3 py-2 capitalize">
                              {c.replace(/_/g, " ")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                        {activeModalQuery.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {activeModalQuery.columns?.map((c) => (
                              <td key={c} className="px-3 py-2 font-medium">
                                {String(row[c])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Status:{" "}
                <strong
                  className={
                    activeModalQuery.status === "Success"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }
                >
                  {activeModalQuery.status}
                </strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModalQuery(null)}
                >
                  Close
                </Button>
                {onOpenInAssistant && (
                  <Button
                    size="sm"
                    className="bg-[#2563EB] hover:bg-[#1D4ED8]"
                    onClick={() => {
                      const q = activeModalQuery;
                      setActiveModalQuery(null);
                      onOpenInAssistant(q);
                    }}
                  >
                    Open in Assistant
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
