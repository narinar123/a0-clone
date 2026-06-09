"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { 
  Database, 
  Terminal as ConsoleIcon, 
  Users as UsersIcon, 
  Play, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  Unlock
} from "lucide-react";
import { useProjectStore } from "@/lib/store/projectStore";

interface CloudConsoleProps {
  projectId: string;
}

export default function CloudConsole({ projectId }: CloudConsoleProps) {
  const { projects, runSQLQuery, addDBUser } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [consoleTab, setConsoleTab] = useState<"tables" | "sql" | "users">("tables");
  
  // Tables state
  const [selectedTableName, setSelectedTableName] = useState<string>("leads");
  
  // SQL Editor state
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM leads;");
  const [sqlResult, setSqlResult] = useState<{ success: boolean; message: string; rows?: any[] } | null>(null);
  
  // User creation modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserProvider, setNewUserProvider] = useState("google");

  if (!project) return null;

  const currentTable = project.dbTables.find(t => t.name === selectedTableName) || project.dbTables[0];

  const handleRunSQL = () => {
    if (!sqlQuery.trim()) return;
    const res = runSQLQuery(projectId, sqlQuery);
    setSqlResult(res);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;
    
    addDBUser(projectId, {
      email: newUserEmail,
      provider: newUserProvider
    });

    setNewUserEmail("");
    setShowAddUserModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070709] overflow-hidden select-none">
      
      {/* DB Navbar */}
      <div className="h-11 border-b border-white/5 bg-[#0b0b0f] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setConsoleTab("tables")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              consoleTab === "tables" ? "bg-white/5 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Table Browser</span>
          </button>
          <button
            onClick={() => setConsoleTab("sql")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              consoleTab === "sql" ? "bg-white/5 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <ConsoleIcon className="h-3.5 w-3.5" />
            <span>SQL Editor</span>
          </button>
          <button
            onClick={() => setConsoleTab("users")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              consoleTab === "users" ? "bg-white/5 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <UsersIcon className="h-3.5 w-3.5" />
            <span>Auth Users</span>
          </button>
        </div>

        <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span>db_schema_tenant_{project.id}</span>
        </div>
      </div>

      {/* Dynamic Pane view */}
      <div className="flex-1 overflow-hidden">
        
        {/* VIEW 1: Table Browser */}
        {consoleTab === "tables" && (
          <div className="h-full flex">
            {/* Left tables list */}
            <div className="w-56 border-r border-white/5 bg-[#0b0b0f]/50 p-4 space-y-4 shrink-0 overflow-y-auto">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Database Tables
              </h3>
              <div className="space-y-1">
                {project.dbTables.map((table) => (
                  <div
                    key={table.name}
                    onClick={() => setSelectedTableName(table.name)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      (currentTable?.name === table.name)
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
                    }`}
                  >
                    <span className="truncate">{table.name}</span>
                    <span className="text-[9px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono">
                      {table.rows.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right details / rows viewer */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black/10">
              {currentTable ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Table details bar */}
                  <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-outfit">
                        {currentTable.name}
                        <span className="text-[10px] font-normal text-zinc-500 font-mono">
                          ({currentTable.columns.length} columns)
                        </span>
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Operational PostgreSQL table data.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${
                        currentTable.rlsEnabled
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      }`}>
                        {currentTable.rlsEnabled ? (
                          <>
                            <Lock className="h-3 w-3" />
                            RLS Active
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3 w-3" />
                            Public RLS
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Schema Columns overview */}
                  <div className="px-6 py-2.5 border-b border-white/5 bg-white/[0.005] flex gap-4 overflow-x-auto text-[10px] text-zinc-500 font-mono shrink-0 select-text">
                    <span className="font-bold text-zinc-400 shrink-0">COLUMNS:</span>
                    {currentTable.columns.map((col) => (
                      <span key={col.name} className="shrink-0">
                        {col.name} <span className="text-blue-500 font-semibold">{col.type}</span>
                        {col.isPrimary && <span className="text-yellow-500 font-bold ml-0.5">🔑</span>}
                      </span>
                    ))}
                  </div>

                  {/* Rows Table view */}
                  <div className="flex-1 overflow-y-auto">
                    {currentTable.rows.length === 0 ? (
                      <div className="h-full flex flex-col justify-center items-center gap-2 text-zinc-500 text-xs">
                        <AlertCircle className="h-5 w-5 text-zinc-600" />
                        <span>Table contains no rows yet</span>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs select-text">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-500 font-medium font-mono text-[11px]">
                            {currentTable.columns.map((col) => (
                              <th key={col.name} className="p-4">{col.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {currentTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.01] transition-colors">
                              {currentTable.columns.map((col) => (
                                <td key={col.name} className="p-4 text-zinc-300 font-mono text-[11px]">
                                  {row[col.name] !== undefined ? String(row[col.name]) : "NULL"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex justify-center items-center text-zinc-500 text-xs">
                  No tables provisioned
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: SQL Editor */}
        {consoleTab === "sql" && (
          <div className="h-full flex flex-col">
            
            {/* Query TextArea */}
            <div className="p-4 bg-[#0b0b0f] border-b border-white/5 flex flex-col space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold">Write query statement</span>
                <button
                  onClick={handleRunSQL}
                  className="glow-btn-blue flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Run SQL
                </button>
              </div>

              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-zinc-100 font-mono text-xs focus:border-blue-500"
                placeholder="-- Write SQL here e.g. CREATE TABLE test (id INT);"
              />
            </div>

            {/* Results Console */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                Execution Results
              </h4>
              
              {!sqlResult ? (
                <div className="text-zinc-600 text-xs select-none">
                  -- Run a query to display logs and returned rows.
                </div>
              ) : sqlResult.success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{sqlResult.message}</span>
                  </div>

                  {sqlResult.rows && sqlResult.rows.length > 0 && (
                    <div className="border border-white/5 rounded-lg overflow-hidden max-w-full">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-500 font-mono">
                            {Object.keys(sqlResult.rows[0]).map((key) => (
                              <th key={key} className="p-3">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {sqlResult.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.005]">
                              {Object.values(row).map((val: any, cIdx) => (
                                <td key={cIdx} className="p-3 text-zinc-300 font-mono">
                                  {val !== undefined ? String(val) : "NULL"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <span>{sqlResult.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: Auth Users */}
        {consoleTab === "users" && (
          <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
            
            {/* Header / Add User action */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-outfit">User Authentication Database</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Manage simulated logins and credentials for your app instance.
                </p>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="glow-btn-blue flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add User
              </button>
            </div>

            {/* Users grid list */}
            <div className="border border-white/5 rounded-xl overflow-hidden bg-black/10 select-text">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-500 font-medium font-mono text-[10px]">
                    <th className="p-4">User UID</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Auth Provider</th>
                    <th className="p-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {project.dbUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.005] transition-colors">
                      <td className="p-4 text-zinc-400 font-mono">{user.id}</td>
                      <td className="p-4 text-zinc-200 font-medium">{user.email}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${
                          user.provider === "google" 
                            ? "bg-red-500/10 text-red-400 border-red-500/20" 
                            : user.provider === "github"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700/30"
                        }`}>
                          {user.provider}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500 font-mono">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <form 
            onSubmit={handleCreateUser}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d0d12] p-6 space-y-4 shadow-2xl relative"
          >
            <h3 className="font-outfit text-base font-bold text-white">Create New User</h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Provider</label>
                <select
                  value={newUserProvider}
                  onChange={(e) => setNewUserProvider(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white outline-none"
                >
                  <option value="google">Google API OAuth</option>
                  <option value="github">GitHub OAuth</option>
                  <option value="password">Email & Password</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glow-btn-blue px-4 py-2 rounded-lg text-white font-semibold text-xs cursor-pointer"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
