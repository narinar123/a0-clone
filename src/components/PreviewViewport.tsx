"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { 
  RotateCw, 
  Smartphone, 
  Tablet, 
  Laptop, 
  ExternalLink, 
  Terminal as ConsoleIcon, 
  Sparkles 
} from "lucide-react";
import { useProjectStore } from "@/lib/store/projectStore";

interface PreviewViewportProps {
  projectId: string;
}

export default function PreviewViewport({ projectId }: PreviewViewportProps) {
  const { projects } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);
  
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [address, setAddress] = useState("/");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const appCode = project?.files["src/App.tsx"] || "";

  // Trigger loading HMR logs on code updates
  useEffect(() => {
    let active = true;
    
    // Set loading asynchronously to avoid synchronous setState inside the effect body warning
    const loadTimer = setTimeout(() => {
      if (active) setIsLoading(true);
    }, 0);

    const logs = [
      `[vite] HMR connection established.`,
      `[vite] hot updated: /src/App.tsx`,
      `[compiler] Bundled src/App.tsx successfully in 42ms.`,
      `[console] App running on port 5173.`
    ];
    
    const doneTimer = setTimeout(() => {
      if (active) {
        setIsLoading(false);
        setConsoleLogs(logs);
      }
    }, 800);

    return () => {
      active = false;
      clearTimeout(loadTimer);
      clearTimeout(doneTimer);
    };
  }, [appCode]);

  if (!project) return null;

  // Simple parser to dynamically render the active React mockup inside the preview frame
  const renderMockAppContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex flex-col justify-center items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
          <span className="text-xs text-zinc-500 font-mono">Hot reloading Vite bundle...</span>
        </div>
      );
    }

    // Determine which app is active by checking the code contents
    if (appCode.includes("Analytics Dashboard")) {
      return <AnalyticsDashboardMockup project={project} />;
    } else if (appCode.includes("Dynamic AI Sandbox") || appCode.includes("items")) {
      return <TodoListMockup project={project} />;
    } else {
      // Default placeholder app
      return <DefaultAppMockup promptText={project.prompt} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070709] overflow-hidden">
      
      {/* Viewport Control Bar */}
      <div className="h-12 border-b border-white/5 px-4 flex items-center justify-between bg-black/25 select-none">
        
        {/* Device Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewportSize("desktop")}
            className={`p-1.5 rounded transition-all ${
              viewportSize === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Desktop view"
          >
            <Laptop className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewportSize("tablet")}
            className={`p-1.5 rounded transition-all ${
              viewportSize === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Tablet view"
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewportSize("mobile")}
            className={`p-1.5 rounded transition-all ${
              viewportSize === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Address Mock Input */}
        <div className="flex-1 max-w-md mx-6 flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/5 px-3 py-1 text-xs text-zinc-400 font-mono">
          <span className="text-zinc-600">localhost:5173</span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-transparent text-zinc-200 outline-none border-none flex-1 pr-1 font-mono text-[11px]"
          />
          <button 
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
            className="hover:text-white"
          >
            <RotateCw className="h-3 w-3" />
          </button>
        </div>

        {/* Outer link shortcut */}
        <button className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white border border-white/5 bg-white/[0.02] px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          <span>Open App</span>
          <ExternalLink className="h-3 w-3" />
        </button>

      </div>

      {/* Frame Container */}
      <div className="flex-1 flex items-center justify-center p-6 bg-black/45 overflow-y-auto">
        <div 
          className={`bg-[#070709] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 flex flex-col ${
            viewportSize === "desktop"
              ? "w-full h-full"
              : viewportSize === "tablet"
              ? "w-[768px] h-[95%]"
              : "w-[375px] h-[90%]"
          }`}
        >
          {/* Virtual Browser Content */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-[#070709]">
            {renderMockAppContent()}
          </div>
        </div>
      </div>

      {/* Dev Console Terminal (Vite Logs) */}
      <div className="h-36 border-t border-white/5 bg-[#0b0b0f] flex flex-col font-mono text-[10px] text-zinc-400">
        <div className="h-8 border-b border-white/5 px-4 flex items-center justify-between text-zinc-500 bg-black/20 select-none">
          <span className="flex items-center gap-1.5 font-bold">
            <ConsoleIcon className="h-3.5 w-3.5" />
            Vite Developer Console
          </span>
          <span className="text-zinc-600">running node@20.x</span>
        </div>
        <div className="flex-1 p-3 overflow-y-auto space-y-1.5 select-text">
          {consoleLogs.map((log, idx) => (
            <p 
              key={idx} 
              className={
                log.includes("hot updated") 
                  ? "text-blue-400" 
                  : log.includes("success") 
                  ? "text-green-400" 
                  : "text-zinc-400"
              }
            >
              {log}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// Interactive Todo List App Emulator
// -------------------------------------------------------------
function TodoListMockup({ project }: { project: any }) {
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

  const toggleItem = (id: number) => {
    setItems(items.map(it => it.id === id ? { ...it, done: !it.done } : it));
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-md bg-[#0f0f15]/80 border border-white/5 p-6 rounded-2xl shadow-xl backdrop-blur-md text-left">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-blue-500 h-5 w-5" />
          <h1 className="text-xl font-bold font-outfit text-white">Dynamic AI Sandbox</h1>
        </div>
        
        <p className="text-xs text-zinc-400 mb-6 font-sans">
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
          <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold">
            Add
          </button>
        </form>

        <div className="space-y-2.5">
          {items.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleItem(item.id)}
              className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg text-xs justify-between cursor-pointer hover:bg-white/[0.04]"
            >
              <span className={item.done ? "text-zinc-500 line-through" : "text-zinc-200"}>
                {item.name}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                item.done ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              }`}>
                {item.done ? "Done" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Interactive Analytics Dashboard App Emulator
// -------------------------------------------------------------
function AnalyticsDashboardMockup({ project }: { project: any }) {
  const activeLeads = project.dbTables.find((t: any) => t.name === "leads")?.rows || [];

  return (
    <div className="flex-1 flex flex-col p-6 text-left">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[#0f0f15]/80 border border-white/5 p-6 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold font-outfit text-white">Analytics Dashboard</h1>
              <p className="text-[11px] text-zinc-500">Live operational intelligence dashboard.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-semibold">
            Vite Server Active
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0f0f15]/60 border border-white/5 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-500 font-medium">Monthly Revenue</span>
            <p className="text-xl font-bold text-white mt-1 font-outfit">$12,840</p>
            <span className="text-[9px] text-green-400 mt-1 block">▲ +12.4%</span>
          </div>

          <div className="bg-[#0f0f15]/60 border border-white/5 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-500 font-medium">Pipeline Leads</span>
            <p className="text-xl font-bold text-white mt-1 font-outfit">{activeLeads.length}</p>
            <span className="text-[9px] text-blue-400 mt-1 block">▲ +8.2% new leads</span>
          </div>

          <div className="bg-[#0f0f15]/60 border border-white/5 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-500 font-medium">Conversion Rate</span>
            <p className="text-xl font-bold text-white mt-1 font-outfit">3.4%</p>
            <span className="text-[9px] text-purple-400 mt-1 block">▲ +0.6% improvement</span>
          </div>
        </div>

        {/* Live Leads Sync */}
        <div className="bg-[#0f0f15]/40 border border-white/5 p-5 rounded-2xl space-y-4">
          <div>
            <h2 className="text-xs font-bold text-zinc-200">Pipeline Leads Feed</h2>
            <p className="text-[10px] text-zinc-500">Dynamically queried rows from provisioned leads table.</p>
          </div>
          <div className="space-y-2">
            {activeLeads.map((row: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-lg text-[11px]">
                <div>
                  <p className="text-zinc-300 font-medium">{row.name}</p>
                  <p className="text-zinc-500 text-[10px]">{row.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-blue-400 font-mono text-[10px] bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                    {row.company || "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Generic Rebuilt Placeholder App Emulator
// -------------------------------------------------------------
function DefaultAppMockup({ promptText }: { promptText: string }) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-md bg-[#0f0f15]/75 border border-white/5 p-6 rounded-2xl text-center shadow-xl space-y-4 text-left">
        <Sparkles className="h-9 w-9 text-pink-500 mx-auto animate-pulse" />
        <h2 className="text-base font-bold text-white text-center">App Layout Rebuilt!</h2>
        <p className="text-xs text-zinc-400 text-center">
          The code was modified in real-time according to your prompt.
        </p>
        <div className="p-3 bg-white/5 rounded border border-white/10 text-[11px] font-mono text-zinc-300 break-words leading-relaxed">
          {promptText}
        </div>
      </div>
    </div>
  );
}
