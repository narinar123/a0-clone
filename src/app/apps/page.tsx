"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useProjectStore } from "@/lib/store/projectStore";
import { 
  Search, 
  Grid, 
  List, 
  ExternalLink, 
  Trash2, 
  Sparkles, 
  Clock,
  Layout,
  Plus
} from "lucide-react";

export default function AppsPage() {
  const { projects, deleteProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070709] text-zinc-100 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Apps View */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#070709]/40 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <span>Workspace</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Your Apps</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/home" 
              className="glow-btn-blue flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-semibold text-white font-outfit"
            >
              <Plus className="h-4 w-4" />
              New App
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 px-8 py-10 max-w-6xl w-full mx-auto z-10 space-y-8">
          
          {/* Section titles */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-outfit text-2xl font-bold text-white tracking-tight">
                Your Applications
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Manage, edit, preview, and monitor database operations for your generated projects.
              </p>
            </div>

            {/* Filters and Layout controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-white/[0.02] border border-white/5 pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-0.5 rounded-lg border border-white/5 bg-white/[0.02] p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === "grid" 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === "list" 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Apps Layout */}
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl p-16 text-center bg-black/10">
              <div className="p-4 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 mb-4">
                <Layout className="h-8 w-8" />
              </div>
              <h3 className="font-outfit text-lg font-semibold text-zinc-200">No applications found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mt-2">
                {searchQuery ? "No apps match your search criteria. Try a different query." : "Generate your first full-stack application with database schemas using our AI agent."}
              </p>
              {!searchQuery && (
                <Link
                  href="/home"
                  className="mt-6 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md font-outfit"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate App
                </Link>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between min-h-[200px] hover:border-blue-500/20 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Layout className="h-4.5 w-4.5" />
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        proj.status === "completed" 
                          ? "bg-green-500/10 text-green-400 border-green-500/20" 
                          : proj.status === "generating"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700/30"
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-outfit text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                        {proj.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-1.5 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(proj.updatedAt)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/chat/${proj.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors font-medium border border-white/5"
                      >
                        Builder
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-500 font-medium">
                    <th className="p-4">App Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Updated At</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-4 font-semibold text-zinc-200 flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          <Layout className="h-3.5 w-3.5" />
                        </div>
                        {proj.name}
                      </td>
                      <td className="p-4 text-zinc-500 max-w-xs truncate">{proj.description}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          proj.status === "completed" 
                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                            : proj.status === "generating"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700/30"
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500">{formatDate(proj.updatedAt)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <Link
                            href={`/chat/${proj.id}`}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors border border-white/5"
                          >
                            Open Builder
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Grid backgrounds */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none z-0" />
      </main>

    </div>
  );
}
