"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useProjectStore } from "@/lib/store/projectStore";
import { 
  Sparkles, 
  Paperclip, 
  Settings, 
  Flame, 
  ArrowRight, 
  Terminal, 
  Database,
  UserCheck 
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { addProject, credits } = useProjectStore();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gemini-1.5-pro");
  const [isAttaching, setIsAttaching] = useState(false);

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Generate a reasonable name from prompt
    const nameWords = prompt.split(" ").slice(0, 3).join(" ");
    const name = nameWords.length > 20 ? nameWords.slice(0, 20) + "..." : nameWords || "New AI App";
    
    // Add to project list
    const projectId = addProject(name, prompt, prompt);
    
    // Redirect to build workspace
    router.push(`/chat/${projectId}`);
  };

  const handleTemplateClick = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  const templates = [
    {
      title: "SaaS CRM Pipeline",
      prompt: "Build a CRM pipeline manager to track deals, contacts, notes, and sales activity. Create tables for leads, deals, and activity_history.",
      icon: UserCheck,
      color: "text-blue-400"
    },
    {
      title: "E-Commerce Dashboard",
      prompt: "Create an e-commerce dashboard with products, orders, customers, and inventory tracking. Include sales analytics charts.",
      icon: Database,
      color: "text-pink-400"
    },
    {
      title: "AI Chat Assistant App",
      prompt: "Generate an AI Chat assistant with multiple conversation threads, model parameters custom settings, and token usage statistics.",
      icon: Terminal,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#070709] text-zinc-100 font-sans">
      
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Home Panel */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#070709]/40 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <span>Workspace</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg text-xs">
              <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-zinc-300 font-semibold">{credits}</span>
              <span className="text-zinc-500">free credits left</span>
            </div>
          </div>
        </header>

        {/* Home Workspace Area */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-8 py-12 z-10">
          
          {/* Header titles */}
          <div className="text-center mb-10">
            <h2 className="font-outfit text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Build full-stack web apps.<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Make it operational in seconds.
              </span>
            </h2>
            <p className="text-zinc-500 mt-3 text-sm max-w-md mx-auto">
              Our AI engine generates frontends, provisions PostgreSQL tables, configures webhook events, and deploys.
            </p>
          </div>

          {/* Prompt Entry Box */}
          <form onSubmit={handleBuild} className="w-full relative rounded-2xl border border-white/10 bg-[#0d0d12]/90 p-3.5 shadow-2xl focus-within:border-blue-500/50 transition-all duration-200">
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build (e.g. 'Create a product inventory manager with a table for stock levels and low stock email alerts...')"
              className="w-full min-h-[120px] bg-transparent resize-none outline-none border-none p-2 text-sm text-zinc-200 placeholder-zinc-500 font-sans"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleBuild(e);
                }
              }}
            />

            {/* Prompt Actions bar */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3.5 px-2 mt-2">
              <div className="flex items-center gap-3">
                
                {/* File picker */}
                <button
                  type="button"
                  onClick={() => setIsAttaching(!isAttaching)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    isAttaching 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>{isAttaching ? "Mockup Attached" : "Attach Screenshot / Design"}</span>
                </button>

                {/* Model Selector */}
                <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1 text-xs">
                  <Settings className="h-3.5 w-3.5 text-zinc-500" />
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="bg-transparent text-zinc-300 font-medium outline-none border-none cursor-pointer pr-1"
                  >
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="gpt-4o">GPT-4o Engine</option>
                  </select>
                </div>
              </div>

              {/* Submit trigger */}
              <button
                type="submit"
                disabled={!prompt.trim()}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold font-outfit transition-all duration-200 ${
                  prompt.trim()
                    ? "glow-btn-blue text-white cursor-pointer"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700/30 cursor-not-allowed"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Build it
              </button>
            </div>
          </form>

          {/* Quick Start Templates */}
          <div className="mt-14 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 font-outfit">
              Popular Starting Templates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <div
                    key={tpl.title}
                    onClick={() => handleTemplateClick(tpl.prompt)}
                    className="glass-card rounded-xl p-4 cursor-pointer hover:border-blue-500/20 group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg bg-white/[0.02] border border-white/5 ${tpl.color}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-200 mt-3 font-outfit">
                      {tpl.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {tpl.prompt}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Decorative Grid Patterns in Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none z-0" />
      </main>

    </div>
  );
}
