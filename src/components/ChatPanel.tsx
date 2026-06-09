"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  CheckCircle2, 
  Circle,
  Settings,
  Paperclip
} from "lucide-react";
import { useProjectStore, Task } from "@/lib/store/projectStore";

interface ChatPanelProps {
  projectId: string;
}

export default function ChatPanel({ projectId }: ChatPanelProps) {
  const { projects, addChatMessage, updateActiveTasks, updateFileContent, runSQLQuery } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);
  
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project?.chatHistory, project?.activeTasks]);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
        Project not found
      </div>
    );
  }

  // Mock Agent build simulation loop
  const triggerAgentRun = async (userPrompt: string) => {
    setIsSubmitting(true);
    
    // Add user message
    addChatMessage(projectId, {
      sender: "user",
      text: userPrompt
    });

    setInput("");

    // Simulate Agent initialization
    const steps: Task[] = [
      { id: "step-1", label: "Analyzing request details", status: "running" },
      { id: "step-2", label: "Generating component changes", status: "pending" },
      { id: "step-3", label: "Compiling and linting workspace", status: "pending" },
      { id: "step-4", label: "Applying database schema adjustments", status: "pending" },
    ];

    updateActiveTasks(projectId, steps);

    // Step 1: Analyze
    await new Promise((resolve) => setTimeout(resolve, 1500));
    steps[0].status = "completed";
    steps[1].status = "running";
    updateActiveTasks(projectId, [...steps]);

    // Step 2: Write component code
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Dynamically adjust files based on prompt keywords
    const lowerPrompt = userPrompt.toLowerCase();
    let fileModificationMsg = "";
    
    if (lowerPrompt.includes("chart") || lowerPrompt.includes("analytics") || lowerPrompt.includes("dashboard")) {
      // Modify App.tsx to include charts/metrics
      const updatedCode = `import React, { useState } from 'react';
import { Sparkles, Activity, Plus, TrendingUp, DollarSign, Users, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [revenue, setRevenue] = useState(12840);
  const [leadsCount, setLeadsCount] = useState(142);
  const [conversionRate, setConversionRate] = useState(3.4);

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col p-8 font-sans">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[#0f0f15]/80 border border-white/5 p-6 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-outfit text-white">Analytics Dashboard</h1>
              <p className="text-xs text-zinc-500">Live operational intelligence dashboard.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold">
            Vite Server Active
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0f0f15]/60 border border-white/5 p-5 rounded-2xl">
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-400 font-medium">Monthly Revenue</span>
              <DollarSign className="h-4.5 w-4.5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2 font-outfit">$12,840</p>
            <div className="flex items-center gap-1 text-[10px] text-green-400 mt-2">
              <TrendingUp className="h-3 w-3" />
              <span>+12.4% vs last month</span>
            </div>
          </div>

          <div className="bg-[#0f0f15]/60 border border-white/5 p-5 rounded-2xl">
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-400 font-medium">Pipeline Leads</span>
              <Users className="h-4.5 w-4.5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2 font-outfit">142</p>
            <div className="flex items-center gap-1 text-[10px] text-blue-400 mt-2">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2% new leads</span>
            </div>
          </div>

          <div className="bg-[#0f0f15]/60 border border-white/5 p-5 rounded-2xl">
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-400 font-medium">Conversion Rate</span>
              <Activity className="h-4.5 w-4.5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2 font-outfit">3.4%</p>
            <div className="flex items-center gap-1 text-[10px] text-purple-400 mt-2">
              <TrendingUp className="h-3 w-3" />
              <span>+0.6% improvement</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}`;
      updateFileContent(projectId, "src/App.tsx", updatedCode);
      fileModificationMsg = "Updated `src/App.tsx` layout structure to support stats widgets, graph vectors, and responsive grid layouts.";
    } else if (lowerPrompt.includes("table") || lowerPrompt.includes("database") || lowerPrompt.includes("schema")) {
      // Mock execute table query if table requested
      const tableMatch = userPrompt.match(/table\s+['"]?(\w+)['"]?/i);
      const tableName = tableMatch ? tableMatch[1] : "new_table";
      
      const sqlQuery = `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, name VARCHAR, value TEXT, created_at TIMESTAMP)`;
      const res = runSQLQuery(projectId, sqlQuery);
      
      if (res.success) {
        fileModificationMsg = `Provisioned database schema adjust successfully. Ran SQL query command to create table "${tableName}". `;
      } else {
        fileModificationMsg = `Failed to execute schema SQL. ${res.message}. `;
      }
    } else {
      // General code update
      const updatedCode = `import React from 'react';
import { Sparkles, Terminal, Globe, Heart } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-center items-center p-8 font-sans">
      <div className="max-w-md w-full bg-[#0f0f15]/75 border border-white/5 p-6 rounded-2xl text-center shadow-xl space-y-4">
        <Sparkles className="h-10 w-10 text-pink-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-white">App Layout Rebuilt!</h2>
        <p className="text-xs text-zinc-400">
          The code was modified in real-time according to your prompt.
        </p>
        <div className="p-3 bg-white/5 rounded border border-white/10 text-xs font-mono text-zinc-300">
          "${userPrompt}"
        </div>
      </div>
    </div>
  );
}`;
      updateFileContent(projectId, "src/App.tsx", updatedCode);
      fileModificationMsg = "Recompiled code modules. Updated layout in `src/App.tsx` to handle user specs.";
    }

    steps[1].status = "completed";
    steps[2].status = "running";
    updateActiveTasks(projectId, [...steps]);

    // Step 3: Compiling / Linting
    await new Promise((resolve) => setTimeout(resolve, 1500));
    steps[2].status = "completed";
    steps[3].status = "running";
    updateActiveTasks(projectId, [...steps]);

    // Step 4: Postgres DB updates
    await new Promise((resolve) => setTimeout(resolve, 1000));
    steps[3].status = "completed";
    updateActiveTasks(projectId, []); // Clear active tasks

    // Add agent response
    addChatMessage(projectId, {
      sender: "agent",
      text: `App updated successfully! I have made the following adjustments based on your instructions:\n\n1. ${fileModificationMsg || "Updated code structure in components."}\n2. Ran background Hot Module Replacement (HMR) to re-render in the preview viewport.\n3. Verified syntax correctness and resolved warnings.\n\nYou can now view the updated interface in the Preview viewport or inspect the changed modules in the Code view.`,
      tasks: steps
    });

    setIsSubmitting(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-[380px] border-r border-white/5 bg-[#0b0b0f] flex flex-col h-full shrink-0">
      
      {/* Active Tasks Queue Status */}
      {project.activeTasks.length > 0 && (
        <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-blue-400 font-semibold">
            <span className="flex items-center gap-1.5 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
              AI Agent is coding...
            </span>
            <span>{project.activeTasks.filter(t => t.status === "completed").length} / {project.activeTasks.length}</span>
          </div>
          <div className="space-y-1">
            {project.activeTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-[10px] text-zinc-300">
                {t.status === "completed" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                ) : t.status === "running" ? (
                  <div className="h-3 w-3 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin shrink-0" />
                ) : (
                  <Circle className="h-3 w-3 text-zinc-700 shrink-0" />
                )}
                <span className={t.status === "running" ? "text-white font-medium" : "text-zinc-400"}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {project.chatHistory.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col max-w-[90%] ${
              msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            {/* Bubble */}
            <div 
              className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none font-sans"
                  : "bg-white/[0.03] border border-white/5 text-zinc-300 rounded-bl-none font-sans"
              }`}
            >
              {msg.text.split("\n").map((line, idx) => (
                <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
              ))}
            </div>

            {/* Bubble Controls / Actions */}
            <div className="flex items-center gap-2 mt-1.5 px-1 text-[10px] text-zinc-500">
              <span>{msg.timestamp.split("T")[1]?.slice(0, 5) || "Now"}</span>
              {msg.sender === "agent" && (
                <>
                  <span>•</span>
                  <button 
                    onClick={() => handleCopy(msg.text)} 
                    className="hover:text-zinc-300 flex items-center gap-0.5 cursor-pointer"
                    title="Copy response text"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <button className="hover:text-zinc-300 flex items-center gap-0.5 cursor-pointer" title="Thumbs up">
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                  <button className="hover:text-zinc-300 flex items-center gap-0.5 cursor-pointer" title="Thumbs down">
                    <ThumbsDown className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Prompt Entry area */}
      <div className="p-3.5 border-t border-white/5 bg-black/30">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !isSubmitting) triggerAgentRun(input);
          }}
          className="relative rounded-xl border border-white/10 bg-[#0d0d12]/90 p-2 focus-within:border-blue-500/50 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ask agent to adjust styles, add columns, etc..."
            className="w-full bg-transparent outline-none border-none p-1.5 text-xs text-zinc-200 placeholder-zinc-500 resize-none min-h-[60px] max-h-[140px] font-sans"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isSubmitting) triggerAgentRun(input);
              }
            }}
          />

          <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1.5 px-1">
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                title="Attach design screenshot"
              >
                <Paperclip className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-1 rounded bg-white/[0.02] border border-white/5 px-1.5 py-0.5 text-[10px]">
                <Settings className="h-3 w-3 text-zinc-500" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-zinc-400 font-medium outline-none border-none cursor-pointer pr-1"
                >
                  <option value="gemini-1.5-pro">Gemini 1.5</option>
                  <option value="claude-3.5-sonnet">Claude 3.5</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isSubmitting}
              className={`p-1.5 rounded-lg text-white font-semibold transition-all ${
                input.trim() && !isSubmitting
                  ? "bg-blue-600 hover:bg-blue-500 shadow-sm cursor-pointer"
                  : "bg-zinc-800 text-zinc-600 border border-zinc-700/10 cursor-not-allowed"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
