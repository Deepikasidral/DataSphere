"use client";

import React, { useState } from "react";
import { Sidebar, NavItemKey } from "@/components/layout/Sidebar";
import { FlowSwitcher, FlowScreen } from "@/components/layout/FlowSwitcher";
import { Screen1_Login } from "@/components/screens/Screen1_Login";
import { Screen2_Dashboard } from "@/components/screens/Screen2_Dashboard";
import { Screen3_ConnectDatabase } from "@/components/screens/Screen3_ConnectDatabase";
import { Screen4_SchemaIndexing } from "@/components/screens/Screen4_SchemaIndexing";
import { Screen5_AIAssistant } from "@/components/screens/Screen5_AIAssistant";
import { Screen6_QueryHistory } from "@/components/screens/Screen6_QueryHistory";
import { Screen7_ProfileSettings } from "@/components/screens/Screen7_ProfileSettings";
import { Screen_Users } from "@/components/screens/Screen_Users";
import { Screen_DatabasesList } from "@/components/screens/Screen_DatabasesList";
import {
  initialDatabases,
  initialQueries,
  initialUserProfile,
} from "@/lib/mock-data";
import { DatabaseConnection, QueryRecord, UserProfile } from "@/types";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<FlowScreen>("2-dashboard");
  const [currentNav, setCurrentNav] = useState<NavItemKey>("dashboard");
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [databases, setDatabases] = useState<DatabaseConnection[]>(initialDatabases);
  const [queries] = useState<QueryRecord[]>(initialQueries);
  const [selectedAssistantDb, setSelectedAssistantDb] = useState("Company DB");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state between FlowSwitcher and Sidebar
  const handleSelectFlowScreen = (screen: FlowScreen) => {
    setCurrentScreen(screen);
    if (screen === "2-dashboard") setCurrentNav("dashboard");
    else if (screen === "3-connect-database") setCurrentNav("databases");
    else if (screen === "4-schema-indexing") setCurrentNav("databases");
    else if (screen === "5-ai-assistant") setCurrentNav("assistant");
    else if (screen === "6-query-history") setCurrentNav("history");
    else if (screen === "7-profile-settings") setCurrentNav("settings");
    setMobileMenuOpen(false);
  };

  const handleSelectNav = (nav: NavItemKey) => {
    setCurrentNav(nav);
    setMobileMenuOpen(false);
    if (nav === "dashboard") setCurrentScreen("2-dashboard");
    else if (nav === "databases") setCurrentScreen("3-connect-database");
    else if (nav === "assistant") setCurrentScreen("5-ai-assistant");
    else if (nav === "history") setCurrentScreen("6-query-history");
    else if (nav === "settings") setCurrentScreen("7-profile-settings");
  };

  const handleLoginSuccess = () => {
    setCurrentScreen("2-dashboard");
    setCurrentNav("dashboard");
  };

  const handleLogout = () => {
    setCurrentScreen("1-login");
  };

  const handleOpenAssistant = (dbName?: string) => {
    if (dbName) setSelectedAssistantDb(dbName);
    setCurrentScreen("5-ai-assistant");
    setCurrentNav("assistant");
  };

  const handleConnectSuccess = (newDb: DatabaseConnection) => {
    setDatabases((prev) => [newDb, ...prev.filter((d) => d.id !== newDb.id)]);
    setSelectedAssistantDb(newDb.name);
    setCurrentScreen("4-schema-indexing");
  };

  const handleIndexingComplete = () => {
    setCurrentScreen("5-ai-assistant");
    setCurrentNav("assistant");
  };

  // Render the active view
  const renderContent = () => {
    // If login screen is active, show standalone login page
    if (currentScreen === "1-login") {
      return <Screen1_Login onLoginSuccess={handleLoginSuccess} />;
    }

    if (currentScreen === "2-dashboard" || currentNav === "dashboard") {
      return (
        <Screen2_Dashboard
          user={user}
          databases={databases}
          queries={queries}
          onOpenAssistant={handleOpenAssistant}
          onConnectDatabase={() => {
            setCurrentScreen("3-connect-database");
            setCurrentNav("databases");
          }}
          onViewAllQueries={() => {
            setCurrentScreen("6-query-history");
            setCurrentNav("history");
          }}
          onSelectQuery={(q) => {
            setSelectedAssistantDb(q.database);
            setCurrentScreen("5-ai-assistant");
            setCurrentNav("assistant");
          }}
        />
      );
    }

    if (currentScreen === "3-connect-database") {
      return (
        <Screen3_ConnectDatabase
          onSuccessConnect={handleConnectSuccess}
          onCancel={() => {
            setCurrentScreen("2-dashboard");
            setCurrentNav("dashboard");
          }}
        />
      );
    }

    if (currentScreen === "4-schema-indexing") {
      return (
        <Screen4_SchemaIndexing
          databaseName={selectedAssistantDb}
          onComplete={handleIndexingComplete}
        />
      );
    }

    if (currentScreen === "5-ai-assistant" || currentNav === "assistant") {
      return (
        <Screen5_AIAssistant
          databases={databases}
          selectedDbName={selectedAssistantDb}
          onSelectDatabase={(name) => setSelectedAssistantDb(name)}
        />
      );
    }

    if (currentScreen === "6-query-history" || currentNav === "history") {
      return (
        <Screen6_QueryHistory
          queries={queries}
          onOpenInAssistant={(q) => {
            setSelectedAssistantDb(q.database);
            setCurrentScreen("5-ai-assistant");
            setCurrentNav("assistant");
          }}
        />
      );
    }

    if (currentScreen === "7-profile-settings" || currentNav === "settings") {
      return (
        <Screen7_ProfileSettings
          user={user}
          onUpdateUser={(updated) => setUser(updated)}
        />
      );
    }

    if (currentNav === "users") {
      return <Screen_Users />;
    }

    if (currentNav === "databases") {
      return (
        <Screen_DatabasesList
          databases={databases}
          onConnectNew={() => setCurrentScreen("3-connect-database")}
          onOpenAssistant={handleOpenAssistant}
          onTriggerIndexing={(name) => {
            setSelectedAssistantDb(name);
            setCurrentScreen("4-schema-indexing");
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FC]">
      {/* Top Prototype Navigation Switcher matching the 7 reference slides */}
      <FlowSwitcher
        currentScreen={currentScreen}
        onSelectScreen={handleSelectFlowScreen}
      />

      {currentScreen === "1-login" ? (
        // Fullscreen layout for Login Page
        <main className="flex-1">
          {renderContent()}
        </main>
      ) : (
        // SaaS Application layout with Dark Navy Sidebar & Light Blue-Gray Canvas
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile Menu Backdrop */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-slate-900/60 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-200 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
          >
            <Sidebar
              currentTab={currentNav}
              onSelectTab={handleSelectNav}
              user={user}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Mobile Header Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-[#142238] text-white border-b border-slate-700">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="font-bold text-sm text-white">NL2SQL</div>
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {user.initials}
              </div>
            </div>

            {/* Page Canvas */}
            <main className="flex-1">
              {renderContent()}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
