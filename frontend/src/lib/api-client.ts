import axios, { AxiosInstance } from "axios";
import { DatabaseConnection, QueryRecord, UserProfile, UserItem, ApiKeyItem, DatabaseType } from "@/types";
import { initialDatabases, initialQueries, initialUserProfile, mockUsers, mockApiKeys } from "./mock-data";

// Centralized Axios client instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request & Response Interceptors for debugging and future auth tokens
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nl2sql_auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// In-memory / localStorage state helpers
const getStoredDatabases = (): DatabaseConnection[] => {
  if (typeof window === "undefined") return initialDatabases;
  const stored = localStorage.getItem("nl2sql_databases");
  if (!stored) {
    localStorage.setItem("nl2sql_databases", JSON.stringify(initialDatabases));
    return initialDatabases;
  }
  return JSON.parse(stored);
};

const getStoredQueries = (): QueryRecord[] => {
  if (typeof window === "undefined") return initialQueries;
  const stored = localStorage.getItem("nl2sql_queries");
  if (!stored) {
    localStorage.setItem("nl2sql_queries", JSON.stringify(initialQueries));
    return initialQueries;
  }
  return JSON.parse(stored);
};

const getStoredUser = (): UserProfile => {
  if (typeof window === "undefined") return initialUserProfile;
  const stored = localStorage.getItem("nl2sql_user");
  if (!stored) {
    localStorage.setItem("nl2sql_user", JSON.stringify(initialUserProfile));
    return initialUserProfile;
  }
  return JSON.parse(stored);
};

// API Services
export const authService = {
  async login(credentials: { email: string; password?: string; rememberMe?: boolean }) {
    await new Promise((r) => setTimeout(r, 600));
    const token = `mock-jwt-token-${credentials.email}-${Date.now()}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("nl2sql_auth_token", token);
    }
    return {
      success: true,
      token,
      user: getStoredUser(),
    };
  },
  async logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nl2sql_auth_token");
    }
    return { success: true };
  },
  async getCurrentUser(): Promise<UserProfile> {
    return getStoredUser();
  },
};

export const databaseService = {
  async list(): Promise<DatabaseConnection[]> {
    return getStoredDatabases();
  },
  async get(id: string): Promise<DatabaseConnection | undefined> {
    const list = getStoredDatabases();
    return list.find((d) => d.id === id);
  },
  async testConnection(params: {
    type: string;
    host: string;
    port: number;
    databaseName: string;
    username: string;
    password?: string;
  }): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 800));
    return {
      success: true,
      message: `Connection successful! Database '${params.databaseName}' is reachable and credentials are valid.`,
    };
  },
  async connect(params: {
    type: string;
    host: string;
    port: number;
    databaseName: string;
    username: string;
    password?: string;
  }): Promise<DatabaseConnection> {
    await new Promise((r) => setTimeout(r, 1000));
    const newDb: DatabaseConnection = {
      id: params.databaseName.toLowerCase().replace(/[^a-z0-9_]/g, "_") || "db_" + Date.now(),
      name: params.databaseName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "New Database",
      type: (params.type as DatabaseType) || "MySQL",
      host: params.host || "localhost",
      port: Number(params.port) || 3306,
      databaseName: params.databaseName,
      username: params.username,
      status: "Connected",
      tablesCount: 12,
      columnsCount: 45,
      lastUpdated: "Just now",
    };
    if (typeof window !== "undefined") {
      const existing = getStoredDatabases();
      const updated = [newDb, ...existing.filter((d) => d.id !== newDb.id)];
      localStorage.setItem("nl2sql_databases", JSON.stringify(updated));
    }
    return newDb;
  },
};

export const queryService = {
  async listHistory(filterDb?: string): Promise<QueryRecord[]> {
    const all = getStoredQueries();
    if (!filterDb || filterDb === "All Databases") return all;
    return all.filter((q) => q.database.toLowerCase().includes(filterDb.toLowerCase()));
  },
  async executeQuery(databaseName: string, question: string): Promise<QueryRecord> {
    await new Promise((r) => setTimeout(r, 1200));

    // Smart heuristic mock responses based on input
    const lower = question.toLowerCase();
    let sql = "";
    let columns: string[] = [];
    let rows: Record<string, string | number | boolean | null>[] = [];
    const status: 'Success' | 'Blocked' = 'Success';

    if (lower.includes("employee") && (lower.includes("department") || lower.includes("how many") || lower.includes("count"))) {
      sql = `SELECT department, COUNT(*) as employee_count\nFROM employees\nGROUP BY department\nORDER BY employee_count DESC;`;
      columns = ["department", "employee_count"];
      rows = [
        { department: "IT", employee_count: 51 },
        { department: "HR", employee_count: 23 },
        { department: "Finance", employee_count: 17 },
        { department: "Sales", employee_count: 14 },
        { department: "Marketing", employee_count: 12 },
      ];
    } else if (lower.includes("salary") && lower.includes("highest")) {
      sql = `SELECT emp_id, full_name, department, salary\nFROM salaries\nJOIN employees ON salaries.emp_id = employees.id\nORDER BY salary DESC\nLIMIT 5;`;
      columns = ["emp_id", "full_name", "department", "salary"];
      rows = [
        { emp_id: "E-101", full_name: "Sarah Jenkins", department: "IT", salary: "$165,000" },
        { emp_id: "E-104", full_name: "Marcus Vance", department: "Engineering", salary: "$152,000" },
        { emp_id: "E-108", full_name: "David Kim", department: "Finance", salary: "$142,000" },
        { emp_id: "E-112", full_name: "Amanda Chen", department: "Sales", salary: "$138,000" },
      ];
    } else if (lower.includes("student") || lower.includes("attendance")) {
      sql = `SELECT student_id, full_name, course, attendance_rate\nFROM student_attendance\nWHERE attendance_rate < 0.75\nORDER BY attendance_rate ASC;`;
      columns = ["student_id", "full_name", "course", "attendance_rate"];
      rows = [
        { student_id: "ST-1042", full_name: "Alex Martinez", course: "Computer Science", attendance_rate: "68%" },
        { student_id: "ST-1089", full_name: "Emily Watson", course: "Data Science", attendance_rate: "71%" },
        { student_id: "ST-1120", full_name: "Devon Vance", course: "Cybersecurity", attendance_rate: "73%" },
      ];
    } else {
      sql = `SELECT * FROM ${databaseName.toLowerCase().includes("hr") ? "records" : "analytics"}\nWHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)\nLIMIT 5;`;
      columns = ["metric", "current_value", "change_pct"];
      rows = [
        { metric: "Active Sessions", current_value: "1,420", change_pct: "+12.4%" },
        { metric: "Data Syncs", current_value: "840", change_pct: "+5.1%" },
        { metric: "Cache Hit Rate", current_value: "96.4%", change_pct: "+1.2%" },
        { metric: "Avg Query Latency", current_value: "0.22s", change_pct: "-8.3%" },
      ];
    }

    const newQuery: QueryRecord = {
      id: Date.now(),
      question,
      database: databaseName,
      time: "Just now",
      relativeTime: "Just now",
      status,
      sql,
      executionTime: "0.23s",
      rowCount: rows.length,
      columns,
      rows,
    };

    if (typeof window !== "undefined") {
      const existing = getStoredQueries();
      localStorage.setItem("nl2sql_queries", JSON.stringify([newQuery, ...existing]));
    }

    return newQuery;
  },
};

export const profileService = {
  async update(profile: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 400));
    const current = getStoredUser();
    const updated = { ...current, ...profile };
    if (typeof window !== "undefined") {
      localStorage.setItem("nl2sql_user", JSON.stringify(updated));
    }
    return updated;
  },
};

export const usersService = {
  async list(): Promise<UserItem[]> {
    return mockUsers;
  },
};

export const apiKeysService = {
  async list(): Promise<ApiKeyItem[]> {
    return mockApiKeys;
  },
};
