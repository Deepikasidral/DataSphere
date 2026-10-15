"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Database,
  MessageSquare,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/api-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Screen1LoginProps {
  onLoginSuccess: () => void;
}

export const Screen1_Login: React.FC<Screen1LoginProps> = ({
  onLoginSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "john@company.com",
      password: "password123",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.login(data);
      onLoginSuccess();
    } catch {
      setAuthError("Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setValue("email", "john@company.com");
    setValue("password", "password123");
  };

  return (
    <div className="min-h-[calc(100vh-41px)] bg-[#F4F7FC] flex flex-col justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Hero Value Proposition */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF]/60 to-[#DBEAFE]/40 p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E2E8F0] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-base tracking-wide text-[#0F172A] leading-tight">
                NL2SQL
              </div>
              <div className="text-xs text-[#64748B] font-medium">
                AI Database Assistant
              </div>
            </div>
          </div>

          {/* Center Copy */}
          <div className="my-8 max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-[1.2]">
              Turn Your Data into{" "}
              <span className="text-[#2563EB] block sm:inline">Answers with AI</span>
            </h1>
            <p className="mt-4 text-base text-[#475569] leading-relaxed">
              Ask questions about your database in natural language. No SQL
              knowledge required.
            </p>

            {/* Feature Bullets */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5 bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-white/80 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">
                    Natural Language Queries
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Get answers without writing SQL
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-white/80 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">
                    Secure & Controlled Access
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Role-based permissions & audit safeguards
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-white/80 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">
                    Works with Your Databases
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Connect your existing MySQL, Postgres & more
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Visual Mockup Graphic */}
          <div className="relative pt-2">
            {/* Floating prompt pill matching screenshot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-medium text-[#1E293B] shadow-md border border-blue-100 mb-3 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Show me total employees in each department</span>
            </div>

            {/* Stylized 3D Database & Chart illustration */}
            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-blue-100/60 max-w-sm">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] flex flex-col items-center justify-center shadow-lg shadow-blue-500/30">
                  <div className="w-8 h-2 rounded-full border border-blue-200/50 mb-1 bg-white/20" />
                  <div className="w-8 h-2 rounded-full border border-blue-200/50 mb-1 bg-white/20" />
                  <div className="w-8 h-2 rounded-full border border-blue-200/50 bg-white/20" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#0F172A]">
                    Real-time AI Synthesis
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#2563EB] h-full w-4/5 rounded-full" />
                </div>
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  Processed in 0.23 seconds
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Center Logo on mobile / top of form */}
            <div className="text-center mb-6">
              <div className="inline-flex w-12 h-12 rounded-xl bg-[#2563EB] items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-3">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Welcome Back</h2>
              <p className="text-sm text-[#64748B] mt-1">
                Sign in to continue to NL2SQL
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {authError}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#475569] cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Password reset instructions will be sent to your email.");
                  }}
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-lg text-sm shadow-sm transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#94A3B8] font-medium tracking-wider">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoFill}
              className="w-full h-10 border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] font-medium text-xs flex items-center justify-center gap-2.5"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </Button>

            {/* Bottom Sign up link */}
            <div className="mt-6 text-center text-xs text-[#64748B]">
              Don&apos;t have an account?{" "}
              <a
                href="#signup"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Sign-up is open. You can sign in with the preloaded demo account.");
                }}
                className="text-[#2563EB] hover:underline font-semibold"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
