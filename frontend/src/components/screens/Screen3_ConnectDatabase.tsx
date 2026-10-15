"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { databaseService } from "@/lib/api-client";
import { DatabaseConnection, DatabaseType } from "@/types";

const connectDbSchema = z.object({
  type: z.string().min(1, "Database type is required"),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().min(1, "Port is required"),
  databaseName: z.string().min(1, "Database name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
});

type ConnectDbFormData = z.infer<typeof connectDbSchema>;

interface Screen3ConnectDatabaseProps {
  onSuccessConnect: (newDb: DatabaseConnection) => void;
  onCancel?: () => void;
}

export const Screen3_ConnectDatabase: React.FC<Screen3ConnectDatabaseProps> = ({
  onSuccessConnect,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>({
    success: true,
    message: "Connection successful! Database is reachable and credentials are valid.",
  });
  const [connecting, setConnecting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConnectDbFormData>({
    resolver: zodResolver(connectDbSchema),
    defaultValues: {
      type: "MySQL",
      host: "localhost",
      port: 3306,
      databaseName: "company_db",
      username: "readonly_user",
      password: "SuperSecretPassword123",
    },
  });

  const selectedType = watch("type");

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await databaseService.testConnection({
        type: selectedType,
        host: watch("host"),
        port: watch("port"),
        databaseName: watch("databaseName"),
        username: watch("username"),
        password: watch("password"),
      });
      setTestResult(res);
    } catch {
      setTestResult({
        success: false,
        message: "Failed to connect. Please verify host, port, and credentials.",
      });
    } finally {
      setTesting(false);
    }
  };

  const onSubmit = async (data: ConnectDbFormData) => {
    setConnecting(true);
    try {
      const newDb = await databaseService.connect({
        type: data.type as DatabaseType,
        host: data.host,
        port: data.port,
        databaseName: data.databaseName,
        username: data.username,
        password: data.password,
      });
      onSuccessConnect(newDb);
    } catch {
      alert("Error saving database connection.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">
          Connect New Database
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Enter your database connection details
        </p>
      </div>

      {/* Main Connection Form Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-subtle p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Database Type */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-2">
              Database Type
            </label>
            <div className="relative">
              <select
                {...register("type")}
                className="w-full h-11 px-3.5 pr-10 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#1E293B] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent cursor-pointer font-medium"
              >
                <option value="MySQL">🐬 MySQL</option>
                <option value="PostgreSQL">🐘 PostgreSQL</option>
                <option value="SQLite">🗄️ SQLite</option>
                <option value="Snowflake">❄️ Snowflake</option>
                <option value="MariaDB">🦭 MariaDB</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Host & Port */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                Host
              </label>
              <Input
                placeholder="localhost"
                {...register("host")}
                className={errors.host ? "border-red-500" : ""}
              />
              {errors.host && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.host.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                Port
              </label>
              <Input
                type="number"
                placeholder="3306"
                {...register("port")}
                className={errors.port ? "border-red-500" : ""}
              />
              {errors.port && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.port.message}
                </p>
              )}
            </div>
          </div>

          {/* Database Name */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Database Name
            </label>
            <Input
              placeholder="company_db"
              {...register("databaseName")}
              className={errors.databaseName ? "border-red-500" : ""}
            />
            {errors.databaseName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.databaseName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Username
            </label>
            <Input
              placeholder="readonly_user"
              {...register("username")}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Buttons: Test Connection & Connect & Save */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={testing}
              onClick={handleTestConnection}
              className="w-full sm:w-auto h-11 px-6 border-[#CBD5E1] text-[#334155] font-semibold text-xs"
            >
              {testing ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Testing...
                </span>
              ) : (
                "Test Connection"
              )}
            </Button>

            <Button
              type="submit"
              disabled={connecting}
              className="w-full sm:flex-1 h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-lg shadow-sm"
            >
              {connecting ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Connecting & Saving...
                </span>
              ) : (
                "Connect & Save"
              )}
            </Button>
          </div>

          {/* Connection Status Banner matching screenshot */}
          {testResult && (
            <div
              className={`mt-4 p-4 rounded-xl border flex items-start gap-3 transition-all ${
                testResult.success
                  ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                  : "bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <div className="font-bold">
                  {testResult.success
                    ? "Connection successful!"
                    : "Connection Failed"}
                </div>
                <div className="mt-0.5 opacity-90">{testResult.message}</div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
