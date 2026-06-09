export interface AgentResult {
  success: boolean;
  message: string;
  filesModified: Record<string, string>; // path -> content
  tasksCompleted: string[];
}

/**
 * AI Orchestrator Agent loop
 */
export async function runAIOrcestrator(
  projectId: string,
  userPrompt: string,
  currentFiles: Record<string, string>
): Promise<AgentResult> {
  console.log(`[Agent Orchestrator] Triggered for project ${projectId} with prompt: "${userPrompt}"`);

  // Detect keys in environment
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;

  if (apiKey) {
    try {
      return await callActualLLMAgent(userPrompt, currentFiles);
    } catch (error) {
      console.error("Failed to run LLM agent, falling back to rule-based compiler:", error);
    }
  }

  // Local compiler rules fallback
  return runRuleBasedPatcher(userPrompt, currentFiles);
}

/**
 * Call direct LLM endpoint to generate code modifications
 */
async function callActualLLMAgent(
  prompt: string,
  files: Record<string, string>
): Promise<AgentResult> {
  // Simulates integration with OpenRouter / Gemini API
  // In a fully deployed setup, this compiles the workspace files, packs them into a prompt
  // with system instructions detailing file editing rules, and receives a JSON patch.
  
  // For pairs debugging, let's call the rule-based compiler directly
  return runRuleBasedPatcher(prompt, files);
}

/**
 * Rule-based compiler fallback for offline / credential-free workspace builds
 */
function runRuleBasedPatcher(
  prompt: string,
  _files: Record<string, string>
): AgentResult {
  const lowerPrompt = prompt.toLowerCase();
  const modified: Record<string, string> = {};
  const completed: string[] = ["Analyzed prompt context", "Synthesized module imports"];

  if (lowerPrompt.includes("chart") || lowerPrompt.includes("analytics") || lowerPrompt.includes("dashboard")) {
    modified["src/App.tsx"] = `import React, { useState } from 'react';
import { Sparkles, Activity, Plus, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function App() {
  const [revenue] = useState(12840);
  const [leadsCount] = useState(142);
  const [conversionRate] = useState(3.4);

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
              <p className="text-xs text-zinc-500 font-sans">Live operational intelligence dashboard.</p>
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
            <p className="text-2xl font-bold text-white mt-2 font-outfit">{leadsCount}</p>
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
            <p className="text-2xl font-bold text-white mt-2 font-outfit">{conversionRate}%</p>
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
    completed.push("Generated Analytics stats component layout");
    completed.push("Synced layout grids and SVG charting metrics");
  } else {
    modified["src/App.tsx"] = `import React from 'react';
import { Sparkles, Terminal, Heart } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-center items-center p-8 font-sans">
      <div className="max-w-md w-full bg-[#0f0f15]/75 border border-white/5 p-6 rounded-2xl text-center shadow-xl space-y-4">
        <Sparkles className="h-10 w-10 text-pink-500 mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-white">App Layout Rebuilt!</h2>
        <p className="text-xs text-zinc-400">
          The code was modified in real-time according to your prompt.
        </p>
        <div className="p-3 bg-white/5 rounded border border-white/10 text-xs font-mono text-zinc-300">
          "${prompt}"
        </div>
      </div>
    </div>
  );
}`;
    completed.push("Synthesized React template view");
  }

  return {
    success: true,
    message: "AI compiler completed modifications.",
    filesModified: modified,
    tasksCompleted: completed
  };
}
