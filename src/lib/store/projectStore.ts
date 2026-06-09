"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "failed";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  tasks?: Task[];
}

export interface DBColumn {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable?: boolean;
}

export interface DBTable {
  name: string;
  columns: DBColumn[];
  rows: Record<string, any>[];
  rlsEnabled?: boolean;
}

export interface DBUser {
  id: string;
  email: string;
  provider: string;
  createdAt: string;
}

export interface Connector {
  id: string;
  name: string;
  category: "Sales" | "Google" | "Productivity" | "Messaging" | "Marketing";
  status: "connected" | "disconnected";
  iconName: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  status: "idle" | "generating" | "completed" | "failed";
  prompt: string;
  files: Record<string, string>; // path -> content
  chatHistory: ChatMessage[];
  activeTasks: Task[];
  dbTables: DBTable[];
  dbUsers: DBUser[];
  connectors: Connector[];
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  credits: number;
  
  // Actions
  addProject: (name: string, description: string, prompt: string) => string;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  addChatMessage: (projectId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateActiveTasks: (projectId: string, tasks: Task[]) => void;
  updateProjectFiles: (projectId: string, files: Record<string, string>) => void;
  updateFileContent: (projectId: string, path: string, content: string) => void;
  deductCredits: (amount: number) => boolean;
  addDBTable: (projectId: string, table: DBTable) => void;
  runSQLQuery: (projectId: string, sql: string) => { success: boolean; message: string; rows?: any[] };
  addDBUser: (projectId: string, user: Omit<DBUser, "id" | "createdAt">) => void;
  toggleConnector: (projectId: string, connectorId: string) => void;
}

const defaultFiles = {
  "src/App.tsx": `import React, { useState } from 'react';
import { Sparkles, Activity, Plus } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: "Initial project setup", done: true },
    { id: 2, name: "Add PostgreSQL dynamic queries", done: false },
    { id: 3, name: "Test Webhook triggers", done: false },
  ]);
  const [newItem, setNewItem] = useState("");

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now(), name: newItem, done: false }]);
    setNewItem("");
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-center items-center p-8 font-sans">
      <div className="w-full max-w-md bg-[#0f0f15]/80 border border-white/5 p-6 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-blue-500 h-5 w-5" />
          <h1 className="text-xl font-bold font-outfit text-white">Dynamic AI Sandbox</h1>
        </div>
        
        <p className="text-xs text-zinc-400 mb-6">
          This preview runs in real-time on our sandboxed dev-server.
        </p>

        <form onSubmit={addItem} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new integration task..."
            className="flex-1 px-3 py-2 text-xs rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </form>

        <div className="space-y-2.5">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg text-xs justify-between">
              <span className={item.done ? "text-zinc-500 line-through" : "text-zinc-200"}>
                {item.name}
              </span>
              <span className={\`px-2 py-0.5 rounded text-[10px] font-semibold \${
                item.done ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              }\`}>
                {item.done ? "Done" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
  "src/index.css": `@import "tailwindcss";
body {
  background-color: #070709;
  color: #f4f4f5;
}`,
  "package.json": `{
  "name": "sandboxed-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.450.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}`
};

const defaultTables: DBTable[] = [
  {
    name: "profiles",
    rlsEnabled: true,
    columns: [
      { name: "id", type: "UUID", isPrimary: true },
      { name: "name", type: "VARCHAR", isPrimary: false },
      { name: "avatar_url", type: "TEXT", isPrimary: false },
      { name: "updated_at", type: "TIMESTAMP", isPrimary: false },
    ],
    rows: [
      { id: "e03fb80a-9d22-4a0b-bc9d-ef30d52bdfa1", name: "Alice Vance", avatar_url: "https://avatar.vercel.sh/alice", updated_at: "2026-06-07T14:23:00Z" },
      { id: "7a26ba19-158a-4089-a54c-1db2f7cf3be4", name: "Bob Peterson", avatar_url: "https://avatar.vercel.sh/bob", updated_at: "2026-06-07T16:10:00Z" }
    ]
  },
  {
    name: "leads",
    rlsEnabled: false,
    columns: [
      { name: "id", type: "SERIAL", isPrimary: true },
      { name: "name", type: "VARCHAR", isPrimary: false },
      { name: "email", type: "VARCHAR", isPrimary: false },
      { name: "company", type: "VARCHAR", isPrimary: false },
      { name: "message", type: "TEXT", isPrimary: false }
    ],
    rows: [
      { id: 1, name: "Sarah Jenkins", email: "sarah@acme.co", company: "Acme Corp", message: "Interested in Pro pricing plans." },
      { id: 2, name: "David Miller", email: "david@hightech.io", company: "HighTech Inc", message: "Looking to deploy a multi-tenant DB app." }
    ]
  }
];

const defaultUsers: DBUser[] = [
  { id: "usr_912", email: "sarah@acme.co", provider: "google", createdAt: "2026-06-05T09:12:00Z" },
  { id: "usr_784", email: "david@hightech.io", provider: "github", createdAt: "2026-06-06T15:43:00Z" },
  { id: "usr_321", email: "bob@a0.dev", provider: "password", createdAt: "2026-06-07T11:20:00Z" }
];

const defaultConnectors: Connector[] = [
  { id: "stripe", name: "Stripe Webhooks", category: "Sales", status: "disconnected", iconName: "DollarSign" },
  { id: "slack", name: "Slack Alerts", category: "Messaging", status: "disconnected", iconName: "MessageSquare" },
  { id: "hubspot", name: "HubSpot Leads", category: "Marketing", status: "disconnected", iconName: "BarChart" },
  { id: "gmail", name: "Gmail Email Client", category: "Google", status: "disconnected", iconName: "Mail" },
  { id: "linear", name: "Linear Tracker", category: "Productivity", status: "disconnected", iconName: "CheckSquare" }
];

const sampleProjects: Project[] = [
  {
    id: "lead-manager",
    name: "Lead Manager Dashboard",
    description: "AI-generated dashboard featuring PostgreSQL leads capturing and Stripe webhooks sync.",
    updatedAt: "2026-06-07T21:40:00Z",
    status: "completed",
    prompt: "Create a modern Dashboard to collect leads. Add a postgres table 'leads' with columns name, email, company, and message. Connect a Stripe webhook to record sales.",
    files: { ...defaultFiles },
    chatHistory: [
      {
        id: "msg-1",
        sender: "user",
        text: "Create a modern Dashboard to collect leads. Add a postgres table 'leads' with columns name, email, company, and message. Connect a Stripe webhook to record sales.",
        timestamp: "2026-06-07T21:38:00Z"
      },
      {
        id: "msg-2",
        sender: "agent",
        text: "Great request! I will initialize the setup, provision the dynamic schema, build the tables and create the dashboard preview for you.",
        timestamp: "2026-06-07T21:40:00Z",
        tasks: [
          { id: "t1", label: "Provisioning database tenant", status: "completed" },
          { id: "t2", label: "Creating leads table schema", status: "completed" },
          { id: "t3", label: "Generating React Dashboard Component", status: "completed" },
          { id: "t4", label: "Configuring Webhook listener", status: "completed" }
        ]
      }
    ],
    activeTasks: [],
    dbTables: [...defaultTables],
    dbUsers: [...defaultUsers],
    connectors: [...defaultConnectors]
  }
];

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: sampleProjects,
      activeProjectId: "lead-manager",
      credits: 80,

      addProject: (name, description, prompt) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newProject: Project = {
          id,
          name,
          description: description || "No description provided.",
          updatedAt: new Date().toISOString(),
          status: "idle",
          prompt,
          files: { ...defaultFiles },
          chatHistory: [
            {
              id: "msg-1",
              sender: "user",
              text: prompt,
              timestamp: new Date().toISOString()
            }
          ],
          activeTasks: [
            { id: "t1", label: "Scaffolding workspace tree", status: "pending" },
            { id: "t2", label: "Provisioning database tables", status: "pending" },
            { id: "t3", label: "Generating source files", status: "pending" },
            { id: "t4", label: "Compiling sandbox container", status: "pending" }
          ],
          dbTables: [
            {
              name: "profiles",
              rlsEnabled: true,
              columns: [
                { name: "id", type: "UUID", isPrimary: true },
                { name: "name", type: "VARCHAR", isPrimary: false },
                { name: "updated_at", type: "TIMESTAMP", isPrimary: false }
              ],
              rows: []
            }
          ],
          dbUsers: [],
          connectors: [...defaultConnectors]
        };

        set((state) => ({
          projects: [newProject, ...state.projects],
          activeProjectId: id,
          credits: Math.max(0, state.credits - 5) // Deduct 5 credits for a new build
        }));

        return id;
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
          activeProjectId: state.activeProjectId === id ? (state.projects[0]?.id || null) : state.activeProjectId
        }));
      },

      setActiveProject: (id) => {
        set({ activeProjectId: id });
      },

      addChatMessage: (projectId, message) => {
        const msg: ChatMessage = {
          ...message,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString()
        };
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                updatedAt: new Date().toISOString(),
                chatHistory: [...p.chatHistory, msg]
              };
            }
            return p;
          })
        }));
      },

      updateActiveTasks: (projectId, tasks) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                activeTasks: tasks
              };
            }
            return p;
          })
        }));
      },

      updateProjectFiles: (projectId, files) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                files: { ...p.files, ...files },
                updatedAt: new Date().toISOString()
              };
            }
            return p;
          })
        }));
      },

      updateFileContent: (projectId, path, content) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              const updatedFiles = { ...p.files, [path]: content };
              return {
                ...p,
                files: updatedFiles,
                updatedAt: new Date().toISOString()
              };
            }
            return p;
          })
        }));
      },

      deductCredits: (amount) => {
        let success = false;
        set((state) => {
          if (state.credits >= amount) {
            success = true;
            return { credits: state.credits - amount };
          }
          return {};
        });
        return success;
      },

      addDBTable: (projectId, table) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                dbTables: [...p.dbTables, table],
                updatedAt: new Date().toISOString()
              };
            }
            return p;
          })
        }));
      },

      runSQLQuery: (projectId, sql) => {
        const query = sql.trim().toLowerCase();
        
        // Simple client-side mock SQL executor
        if (query.startsWith("create table")) {
          // parse name
          const match = sql.match(/create table\s+(\w+)\s*\(([^)]+)\)/i);
          if (!match) {
            return { success: false, message: "SQL Syntax error near CREATE TABLE" };
          }
          
          const tableName = match[1].trim();
          const columnsRaw = match[2].split(",");
          const columns: DBColumn[] = columnsRaw.map((colStr) => {
            const parts = colStr.trim().split(/\s+/);
            const name = parts[0];
            const type = parts[1] || "VARCHAR";
            const isPrimary = colStr.toLowerCase().includes("primary key");
            return { name, type, isPrimary };
          });
          
          const store = get();
          const p = store.projects.find(proj => proj.id === projectId);
          if (p && p.dbTables.some(t => t.name === tableName)) {
            return { success: false, message: `Table "${tableName}" already exists` };
          }

          store.addDBTable(projectId, { name: tableName, columns, rows: [], rlsEnabled: false });
          return { success: true, message: `CREATE TABLE: Successfully created table "${tableName}"` };
        }

        if (query.startsWith("select")) {
          const match = query.match(/from\s+(\w+)/i);
          if (!match) {
            return { success: false, message: "SQL Syntax error near FROM clause" };
          }
          const tableName = match[1].trim();
          const p = get().projects.find(proj => proj.id === projectId);
          const table = p?.dbTables.find(t => t.name === tableName);
          
          if (!table) {
            return { success: false, message: `Table "${tableName}" does not exist` };
          }

          return { success: true, message: `SELECT: Returned ${table.rows.length} rows`, rows: table.rows };
        }

        if (query.startsWith("insert into")) {
          // mock insert
          const match = sql.match(/insert into\s+(\w+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
          if (!match) {
            return { success: false, message: "SQL Syntax error near INSERT INTO values" };
          }

          const tableName = match[1].trim();
          const colNames = match[2].split(",").map(c => c.trim());
          const colValues = match[3].split(",").map(v => v.trim().replace(/['"]/g, ""));

          let msg = "";
          set((state) => ({
            projects: state.projects.map((p) => {
              if (p.id === projectId) {
                const tableIndex = p.dbTables.findIndex(t => t.name === tableName);
                if (tableIndex === -1) {
                  msg = `Table "${tableName}" not found.`;
                  return p;
                }
                const table = p.dbTables[tableIndex];
                const newRow: Record<string, any> = {};
                table.columns.forEach((col) => {
                  if (col.isPrimary && col.type.toLowerCase() === "serial") {
                    newRow[col.name] = table.rows.length + 1;
                  } else {
                    const insertIdx = colNames.indexOf(col.name);
                    newRow[col.name] = insertIdx !== -1 ? colValues[insertIdx] : null;
                  }
                });

                const updatedTables = [...p.dbTables];
                updatedTables[tableIndex] = {
                  ...table,
                  rows: [...table.rows, newRow]
                };
                msg = `INSERT: Successfully inserted 1 row into "${tableName}"`;
                return { ...p, dbTables: updatedTables };
              }
              return p;
            })
          }));

          return msg.includes("Successfully") ? { success: true, message: msg } : { success: false, message: msg };
        }

        return { 
          success: false, 
          message: "Unsupported SQL syntax in mock engine. Supported: CREATE TABLE, SELECT * FROM, INSERT INTO" 
        };
      },

      addDBUser: (projectId, user) => {
        const newUser: DBUser = {
          ...user,
          id: "usr_" + Math.random().toString(36).substring(2, 7),
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                dbUsers: [newUser, ...p.dbUsers],
                updatedAt: new Date().toISOString()
              };
            }
            return p;
          })
        }));
      },

      toggleConnector: (projectId, connectorId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              const updatedConnectors = p.connectors.map((c) => {
                if (c.id === connectorId) {
                  return {
                    ...c,
                    status: c.status === "connected" ? ("disconnected" as const) : ("connected" as const)
                  };
                }
                return c;
              });
              return {
                ...p,
                connectors: updatedConnectors,
                updatedAt: new Date().toISOString()
              };
            }
            return p;
          })
        }));
      }
    }),
    {
      name: "a0-projects-storage",
      skipHydration: false
    }
  )
);
