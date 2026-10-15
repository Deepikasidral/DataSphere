"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/lib/mock-data";
import { UserItem } from "@/types";

export const Screen_Users: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<UserItem["role"]>("Data Analyst");

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newUser: UserItem = {
      id: "u-" + Date.now(),
      name: inviteName || inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "Pending",
      lastActive: "Invited just now",
    };
    setUsers([...users, newUser]);
    setInviteEmail("");
    setInviteName("");
    setInviteModal(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Users & Access</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Manage team members and database querying permissions
          </p>
        </div>

        <Button
          onClick={() => setInviteModal(true)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold h-9 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite User</span>
        </Button>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#1E293B]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F172A]">{u.name}</div>
                        <div className="text-[11px] text-[#64748B]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-[#334155]">{u.role}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={u.status === "Active" ? "success" : "secondary"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-[#64748B]">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] space-y-4">
            <h4 className="text-base font-bold text-[#0F172A]">
              Invite Team Member
            </h4>
            <form onSubmit={handleSendInvite} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Rachel Adams"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="rachel@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserItem["role"])}
                  className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-xs font-medium text-[#1E293B]"
                >
                  <option value="Admin">Admin (Full database & user access)</option>
                  <option value="Manager">Manager (Can connect databases & query)</option>
                  <option value="Data Analyst">Data Analyst (Query & export results)</option>
                  <option value="Viewer">Viewer (Read-only query history)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8]"
                >
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
