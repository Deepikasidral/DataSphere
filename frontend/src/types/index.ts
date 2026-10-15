export type DatabaseType = 'MySQL' | 'PostgreSQL' | 'SQLite' | 'Snowflake' | 'MariaDB';

export interface DatabaseConnection {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  status: 'Connected' | 'Disconnected' | 'Syncing' | 'Error';
  tablesCount: number;
  columnsCount?: number;
  lastUpdated: string;
}

export interface QueryRecord {
  id: number;
  question: string;
  database: string;
  databaseId?: string;
  time: string;
  relativeTime?: string;
  status: 'Success' | 'Blocked' | 'Error';
  sql: string;
  executionTime?: string;
  rowCount?: number;
  columns?: string[];
  rows?: Record<string, string | number | boolean | null>[];
  errorMessage?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  initials: string;
}

export interface IndexingStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  createdAt: string;
  lastUsed: string;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Data Analyst' | 'Viewer';
  status: 'Active' | 'Pending' | 'Inactive';
  lastActive: string;
}
