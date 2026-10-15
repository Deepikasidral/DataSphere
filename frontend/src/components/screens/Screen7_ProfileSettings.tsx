"use client";

import React, { useState } from "react";
import {
  User,
  KeyRound,
  Sliders,
  Shield,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile, ApiKeyItem } from "@/types";
import { mockApiKeys } from "@/lib/mock-data";
import { profileService } from "@/lib/api-client";

type SettingsTab = "profile" | "password" | "preferences" | "apikeys";

interface Screen7ProfileSettingsProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const Screen7_ProfileSettings: React.FC<Screen7ProfileSettingsProps> = ({
  user,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form state
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Password tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(mockApiKeys);
  const [newKeyModal, setNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Preferences state
  const [defaultDb, setDefaultDb] = useState("Company DB");
  const [autoRun, setAutoRun] = useState(true);
  const [maxRows, setMaxRows] = useState("100");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setShowSuccessToast(false);
    try {
      const updated = await profileService.update({
        name: fullName,
        email,
        role,
        initials: fullName.charAt(0).toUpperCase() || "J",
      });
      onUpdateUser(updated);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch {
      alert("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKeyItem = {
      id: "k-" + Date.now(),
      name: newKeyName,
      keyMasked: "nl2sql_live_" + Math.random().toString(36).substring(2, 6) + "••••••••••••••" + Math.random().toString(36).substring(2, 4),
      createdAt: "Today",
      lastUsed: "Never",
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setNewKeyModal(false);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const handleCopyKey = (keyMasked: string, id: string) => {
    navigator.clipboard.writeText(keyMasked);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Profile Settings</h1>
        <p className="text-sm text-[#64748B] mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Sub-navigation Tabs */}
        <div className="md:col-span-4 bg-white rounded-xl border border-[#E2E8F0] shadow-subtle p-2 space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
              activeTab === "profile"
                ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
              activeTab === "password"
                ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
              activeTab === "preferences"
                ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab("apikeys")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
              activeTab === "apikeys"
                ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>API Keys</span>
          </button>
        </div>

        {/* Right Tab Content Card */}
        <div className="md:col-span-8 bg-white rounded-xl border border-[#E2E8F0] shadow-subtle p-6 md:p-8">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Profile Information
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Update your account details and role designation
                </p>
              </div>

              {/* Avatar block matching screenshot */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="w-14 h-14 rounded-full bg-[#3B82F6] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm ring-4 ring-blue-50">
                  {user.initials || "J"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">{user.name}</h4>
                  <p className="text-xs text-[#64748B]">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Full Name
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                {showSuccessToast && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Profile updated successfully!</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full sm:w-auto h-10 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-lg shadow-sm"
                  >
                    {isUpdating ? "Saving..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Change Password
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Ensure your account uses a secure credentials combination
                </p>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {passwordSaved && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Password updated successfully.</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="h-10 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-lg shadow-sm"
                  >
                    Save Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  System Preferences
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Configure default assistant behaviors and query defaults
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Default Database for Querying
                  </label>
                  <select
                    value={defaultDb}
                    onChange={(e) => setDefaultDb(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-xs font-medium text-[#1E293B]"
                  >
                    <option value="Company DB">Company DB (MySQL)</option>
                    <option value="HR Database">HR Database (MySQL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Maximum Query Results Limit
                  </label>
                  <select
                    value={maxRows}
                    onChange={(e) => setMaxRows(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-xs font-medium text-[#1E293B]"
                  >
                    <option value="50">50 Rows</option>
                    <option value="100">100 Rows</option>
                    <option value="500">500 Rows</option>
                    <option value="1000">1000 Rows</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h5 className="text-xs font-semibold text-[#0F172A]">
                      Auto-execute synthesized SQL
                    </h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Immediately execute valid SELECT statements against the active database
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRun}
                    onChange={(e) => setAutoRun(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563EB]"
                  />
                </div>

                <Button
                  onClick={() => alert("Preferences saved!")}
                  className="h-10 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* TAB 4: API KEYS */}
          {activeTab === "apikeys" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    API Keys
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Connect NL2SQL engine to Slack, webhooks, or internal services
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setNewKeyModal(true)}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate Key</span>
                </Button>
              </div>

              {/* API Keys Table */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#475569] font-semibold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-4 py-3">Key Name</th>
                      <th className="px-4 py-3">Token</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                    {apiKeys.map((k) => (
                      <tr key={k.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-[#0F172A]">
                          {k.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {k.keyMasked}
                        </td>
                        <td className="px-4 py-3 text-[#64748B]">{k.createdAt}</td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => handleCopyKey(k.keyMasked, k.id)}
                            title="Copy Key"
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          >
                            {copiedKeyId === k.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            title="Revoke Key"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* New Key Modal */}
              {newKeyModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] space-y-4">
                    <h4 className="text-base font-bold text-[#0F172A]">
                      Create API Key
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      Provide a descriptive name for your external integration.
                    </p>
                    <Input
                      placeholder="e.g. Production Data Pipeline"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewKeyModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCreateApiKey}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8]"
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
