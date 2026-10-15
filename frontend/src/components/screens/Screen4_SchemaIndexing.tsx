"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Screen4SchemaIndexingProps {
  onComplete: () => void;
  databaseName?: string;
}

export const Screen4_SchemaIndexing: React.FC<Screen4SchemaIndexingProps> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState(80);

  // Allow automatic smooth progression towards 100%
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(100);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [progress]);

  const steps = [
    {
      id: 1,
      title: "Connecting to database",
      description: "Successfully connected",
      isCompleted: true,
    },
    {
      id: 2,
      title: "Extracting schema",
      description: "Found 12 tables, 45 columns",
      isCompleted: true,
    },
    {
      id: 3,
      title: "Processing relationships",
      description: "Detected 8 foreign keys",
      isCompleted: true,
    },
    {
      id: 4,
      title: "Creating embeddings",
      description: "Generating vector representations",
      isCompleted: progress >= 80,
    },
    {
      id: 5,
      title: "Storing in ChromaDB",
      description: progress >= 100 ? "Schema metadata saved" : "Saving schema metadata",
      isCompleted: progress >= 100,
      inProgress: progress < 100,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">
          Setting up Your Database
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          We are extracting schema and creating vector index. This may take a few minutes.
        </p>
      </div>

      {/* Indexing Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-subtle p-6 md:p-8 space-y-7">
        {/* Step list */}
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.id} className="flex items-start gap-4">
              {s.isCompleted ? (
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
                </div>
              ) : s.inProgress ? (
                <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">
                  {s.id}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-[#0F172A] leading-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-1">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar container */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#334155] mb-2">
            <span>Overall Indexing Progress</span>
            <span className="text-[#2563EB] font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2563EB] h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Info callout banner */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
            i
          </div>
          <div className="text-xs text-[#475569] leading-relaxed">
            <span className="font-semibold text-[#0F172A]">
              Please keep this page open.
            </span>{" "}
            This process may take a few minutes depending on database size.
          </div>
        </div>

        {/* Proceed Button */}
        <div className="pt-2 flex justify-end">
          <Button
            onClick={onComplete}
            className="w-full sm:w-auto h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Go to AI Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
