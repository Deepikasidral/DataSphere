"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Database,
  Send,
  Copy,
  Check,
  Download,
  BarChart2,
  Table as TableIcon,
  ChevronDown,
  RefreshCw,
  Terminal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { QueryRecord, DatabaseConnection } from "@/types";
import { queryService } from "@/lib/api-client";

interface Screen5AIAssistantProps {
  databases: DatabaseConnection[];
  selectedDbName?: string;
  onSelectDatabase?: (name: string) => void;
}

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  timestamp: string;
  question?: string;
  queryRecord?: QueryRecord;
}

export const Screen5_AIAssistant: React.FC<Screen5AIAssistantProps> = ({
  databases,
  selectedDbName = "Company DB",
  onSelectDatabase,
}) => {
  const [currentDb, setCurrentDb] = useState(selectedDbName);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  // Initial conversation matching screenshot
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "msg-1",
      role: "user",
      timestamp: "10:24 AM",
      question: "How many employees are in each department?",
    },
    {
      id: "msg-2",
      role: "assistant",
      timestamp: "10:24 AM",
      queryRecord: {
        id: 1,
        question: "How many employees are in each department?",
        database: "Company DB",
        time: "10:24 AM",
        status: "Success",
        sql: `SELECT department, COUNT(*) as employee_count\nFROM employees\nGROUP BY department\nORDER BY employee_count DESC;`,
        executionTime: "0.23s",
        rowCount: 5,
        columns: ["department", "employee_count"],
        rows: [
          { department: "IT", employee_count: 51 },
          { department: "HR", employee_count: 23 },
          { department: "Finance", employee_count: 17 },
          { department: "Sales", employee_count: 14 },
          { department: "Marketing", employee_count: 12 },
        ],
      },
    },
  ]);

  const handleCopySql = (sql: string, id: number) => {
    navigator.clipboard.writeText(sql);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = (record: QueryRecord) => {
    if (!record.columns || !record.rows) return;
    const header = record.columns.join(",");
    const body = record.rows
      .map((r) => record.columns!.map((c) => JSON.stringify(r[c] ?? "")).join(","))
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `query_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim() || isGenerating) return;

    const userMsgId = "msg-" + Date.now();
    const timeNow = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessages: MessageItem[] = [
      ...messages,
      {
        id: userMsgId,
        role: "user",
        timestamp: timeNow,
        question: q,
      },
    ];

    setMessages(newMessages);
    setInputText("");
    setIsGenerating(true);

    try {
      const record = await queryService.executeQuery(currentDb, q);
      setMessages([
        ...newMessages,
        {
          id: "msg-" + (Date.now() + 1),
          role: "assistant",
          timestamp: timeNow,
          queryRecord: record,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    "How many employees are in each department?",
    "Show top 5 salaries",
    "List students with attendance below 75%",
    "Count of employees joined this year",
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-100px)]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            AI Database Assistant
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Ask questions about your data in natural language
          </p>
        </div>

        {/* Database selector */}
        <div className="relative shrink-0">
          <select
            value={currentDb}
            onChange={(e) => {
              setCurrentDb(e.target.value);
              if (onSelectDatabase) onSelectDatabase(e.target.value);
            }}
            className="h-10 pl-9 pr-9 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#1E293B] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer shadow-subtle"
          >
            {databases.map((db) => (
              <option key={db.id} value={db.name}>
                {db.name} ({db.type})
              </option>
            ))}
          </select>
          <Database className="w-4 h-4 text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Chat Messages Canvas */}
      <div className="flex-1 py-6 space-y-6 overflow-y-auto">
        {messages.map((msg) => {
          if (msg.role === "user") {
            return (
              <div
                key={msg.id}
                className="flex items-start justify-end gap-3 max-w-2xl ml-auto"
              >
                <div className="flex flex-col items-end">
                  <div className="bg-[#2563EB] text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm font-medium shadow-sm">
                    {msg.question}
                  </div>
                  <span className="text-[11px] text-[#94A3B8] mt-1 pr-1 font-medium">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shrink-0 mt-0.5 shadow-xs">
                  J
                </div>
              </div>
            );
          }

          const qRec = msg.queryRecord;
          if (!qRec) return null;

          return (
            <div key={msg.id} className="flex items-start gap-3 max-w-4xl">
              {/* Bot Avatar */}
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>

              {/* Bot Response Content Card */}
              <div className="flex-1 space-y-4">
                {/* Generated SQL Box */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-[#334155]">
                      <Terminal className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Generated SQL</span>
                    </div>
                    <button
                      onClick={() => handleCopySql(qRec.sql, qRec.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-[#2563EB] hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-all font-medium text-xs"
                    >
                      {copiedId === qRec.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-[#0F172A] bg-white overflow-x-auto leading-relaxed">
                    <code>{qRec.sql}</code>
                  </pre>
                </div>

                {/* Results Section */}
                {qRec.status === "Blocked" ? (
                  <div className="bg-[#FFF1F2] border border-[#FECDD3] text-[#9F1239] p-4 rounded-xl text-xs">
                    <div className="font-bold">Execution Blocked</div>
                    <div className="mt-1">{qRec.errorMessage}</div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
                    {/* Results table header */}
                    <div className="px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                      <span className="text-xs font-bold text-[#0F172A]">
                        Results
                      </span>
                      <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#E2E8F0]">
                        <button
                          onClick={() => setViewMode("table")}
                          className={`p-1 rounded text-xs flex items-center gap-1 ${
                            viewMode === "table"
                              ? "bg-[#2563EB] text-white"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                          title="Table View"
                        >
                          <TableIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setViewMode("chart")}
                          className={`p-1 rounded text-xs flex items-center gap-1 ${
                            viewMode === "chart"
                              ? "bg-[#2563EB] text-white"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                          title="Chart View"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* View Mode: Table */}
                    {viewMode === "table" ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#F8FAFC] text-[#475569] font-semibold border-b border-[#E2E8F0]">
                            <tr>
                              {qRec.columns?.map((col) => (
                                <th key={col} className="px-4 py-2.5 capitalize">
                                  {col.replace(/_/g, " ")}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                            {qRec.rows?.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="hover:bg-slate-50/70 transition-colors"
                              >
                                {qRec.columns?.map((col) => (
                                  <td key={col} className="px-4 py-2.5 font-medium">
                                    {String(row[col])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* View Mode: Recharts Visual Chart */
                      <div className="p-4 h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={qRec.rows}
                            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                            <XAxis
                              dataKey={qRec.columns?.[0] || "department"}
                              tick={{ fontSize: 11, fill: "#64748B" }}
                            />
                            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#FFFFFF",
                                borderColor: "#E2E8F0",
                                borderRadius: "8px",
                                fontSize: "12px",
                              }}
                            />
                            <Bar
                              dataKey={qRec.columns?.[1] || "employee_count"}
                              fill="#2563EB"
                              radius={[6, 6, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Footer with execution timing and Download */}
                    <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                      <span>
                        {qRec.rowCount || qRec.rows?.length || 0} rows returned in{" "}
                        {qRec.executionTime || "0.23s"}
                      </span>
                      <button
                        onClick={() => handleExportCsv(qRec)}
                        className="flex items-center gap-1.5 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3 text-xs text-[#64748B] pl-11">
            <RefreshCw className="w-4 h-4 animate-spin text-[#2563EB]" />
            <span>Analyzing schema and synthesizing SQL...</span>
          </div>
        )}
      </div>

      {/* Suggested Query Chips */}
      <div className="pt-2 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
            Suggested:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 text-[11px] text-[#334155] hover:text-[#2563EB] border border-[#CBD5E1] hover:border-blue-300 transition-colors whitespace-nowrap shadow-xs"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Input Form */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-1.5 shadow-subtle flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder="Ask anything about your data..."
          className="flex-1 px-3 py-2 text-sm text-[#1E293B] bg-transparent focus:outline-none placeholder:text-[#94A3B8]"
        />
        <Button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isGenerating}
          className="h-9 w-9 p-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg shrink-0 flex items-center justify-center shadow-xs"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
