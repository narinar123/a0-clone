"use client";

import { 
  Eye, 
  Code, 
  Database, 
  FileCode
} from "lucide-react";

export type TabType = "preview" | "code" | "database" | "connectors";

interface WorkspaceTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function WorkspaceTabs({ activeTab, setActiveTab }: WorkspaceTabsProps) {
  const tabs = [
    { id: "preview", name: "Preview", icon: Eye },
    { id: "code", name: "Code Editor", icon: Code },
    { id: "database", name: "Database & SQL", icon: Database },
    { id: "connectors", name: "Connectors", icon: FileCode },
  ] as const;

  return (
    <div className="h-12 border-b border-white/5 bg-[#0b0b0f] px-6 flex items-center justify-between shrink-0 select-none">
      
      {/* Tab selectors */}
      <div className="flex items-center gap-1.5 h-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 h-full text-xs font-semibold relative transition-all border-b-2 cursor-pointer ${
                isActive
                  ? "border-blue-500 text-white font-bold bg-white/[0.02]"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Quick Actions */}
      <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/40 border border-white/5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Vite Server Up
        </span>
      </div>

    </div>
  );
}
