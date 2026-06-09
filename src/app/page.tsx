"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Database, 
  Code, 
  Globe, 
  Webhook, 
  Cpu, 
  Terminal, 
  Layers, 
  Zap, 
  Play, 
  CheckCircle2 
} from "lucide-react";
import BillingModal from "@/components/universal/BillingModal";
import SocialShare from "@/components/universal/SocialShare";

export default function LandingPage() {
  const [isBillingOpen, setIsBillingOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#070709] text-zinc-100 selection:bg-blue-600/30 overflow-hidden">
      <BillingModal isOpen={isBillingOpen} onClose={() => setIsBillingOpen(false)} userEmail="candidate@example.com" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#070709]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <img src="https://www.gsgroups.net/gslogo.png" alt="GS Logo" className="w-8 h-8 object-contain" />
            <span className="font-outfit text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              GSQODER.AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <button onClick={() => setIsBillingOpen(true)} className="hover:text-white transition-colors">Pricing</button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/home" 
              className="relative group overflow-hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/home" 
              className="glow-btn-blue flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white font-outfit"
            >
              <Sparkles className="h-4 w-4" />
              Start Building
            </Link>
          </div>
        </div>
      </header>


      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="container mx-auto px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 mb-8 backdrop-blur-sm animate-pulse">
            <Zap className="h-3 w-3" />
            <span>Next-Generation AI Web App Builder</span>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl mx-auto font-outfit text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] text-white">
            Build Full-Stack Apps <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              With Database & Connectors
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto mt-6 text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
            Prompt in natural language. Our AI agents write React frontend code, provision dedicated PostgreSQL tables, orchestrate API webhooks, and compile live deployable builds in real time.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/home" 
              className="glow-btn-blue flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white font-outfit w-full sm:w-auto"
            >
              Start Generating
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a 
              href="#how-it-works" 
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200 text-zinc-300 hover:text-white text-base font-medium w-full sm:w-auto backdrop-blur-sm"
            >
              <Play className="h-4 w-4 text-blue-500 fill-blue-500" />
              Watch Demo
            </a>
          </div>

          {/* Builder UI Mockup Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#0d0d11]/80 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden backdrop-blur-md">
            
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="rounded bg-white/5 px-3 py-1 text-xs text-zinc-500 font-mono flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                a0.dev/chat/project-lead-manager
              </div>
              <div className="w-12" />
            </div>

            {/* Mock Dashboard Layout */}
            <div className="grid grid-cols-12 h-[500px]">
              
              {/* Left Chat Frame */}
              <div className="col-span-4 border-r border-white/5 bg-[#0f0f15]/80 p-4 flex flex-col justify-between text-left">
                <div className="space-y-4">
                  <div className="rounded bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-300">
                    <span className="font-semibold">Prompt:</span> Create a modern Dashboard to collect leads. Add a postgres table &quot;leads&quot; with columns name, email, company, and message. Connect a Stripe webhook to record sales.
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Provisioned schema tenant_3102</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Created table `leads`</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-zinc-600 border-t-blue-500 animate-spin" />
                      <span>Generating Lead Dashboard UI...</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg border border-white/10 p-2 text-xs text-zinc-500 font-mono">
                  $ npx vite dev
                </div>
              </div>

              {/* Right Viewport Panel */}
              <div className="col-span-8 bg-[#070709] flex flex-col">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 text-xs text-zinc-400 bg-black/20">
                  <span className="font-semibold text-blue-400">Preview</span>
                  <div className="flex gap-4">
                    <span>Code</span>
                    <span>Database</span>
                    <span>Connectors</span>
                  </div>
                </div>
                
                {/* Mock Application Render */}
                <div className="flex-1 p-6 flex flex-col justify-center items-center bg-[#0d0d11]">
                  <div className="w-full max-w-md rounded-xl border border-white/10 bg-black/40 p-6 space-y-4 text-left">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-blue-400" />
                      Leads Pipeline
                    </h3>
                    <p className="text-xs text-zinc-400">Active leads synced dynamically via PostgreSQL.</p>
                    
                    <div className="space-y-2">
                      <div className="rounded bg-white/5 p-2.5 text-xs border border-white/5 flex justify-between">
                        <div>
                          <p className="text-zinc-200 font-medium">Sarah Jenkins</p>
                          <p className="text-zinc-500">sarah@acme.co</p>
                        </div>
                        <span className="text-blue-400 text-xs font-mono">Acme Corp</span>
                      </div>
                      <div className="rounded bg-white/5 p-2.5 text-xs border border-white/5 flex justify-between">
                        <div>
                          <p className="text-zinc-200 font-medium">David Miller</p>
                          <p className="text-zinc-500">david@hightech.io</p>
                        </div>
                        <span className="text-blue-400 text-xs font-mono">HighTech</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-white/5 bg-black/20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-outfit text-3xl sm:text-5xl font-bold text-white">
              Everything You Need to Ship Full-Stack App Engines
            </h2>
            <p className="text-zinc-400 mt-4 text-lg">
              We don&apos;t just generate layouts. We build functional applications complete with tables, schemas, webhooks, and database triggers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="glass-card rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white font-outfit">AI Agent Coding Engine</h3>
              <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                Our AI agents run a planning and generation loop, compile the code, identify errors, and automatically apply bug patches.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white font-outfit">Dynamic PostgreSQL Tables</h3>
              <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                Add, modify, and query tables on the fly. View active rows, execute custom SQL statements, and check schema relationships in a visual designer.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-5">
                <Webhook className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white font-outfit">Webhook & Event Connectors</h3>
              <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                Integrate Stripe, Slack, Twilio, or HubSpot webhooks in seconds. Map JSON payload properties to database tables with a visual mapper.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-5">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white font-outfit">One-Click Production Deploy</h3>
              <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                Sync production code to Vercel and production databases to Supabase. Instant deployment configurations are ready out of the box.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mb-5">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white font-outfit">Built-In Monaco Code Editor</h3>
              <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                Want to fine-tune the results? Instantly jump into a production-grade Monaco editor to modify code files manually.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white font-outfit">User Authentication Tables</h3>
              <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                Built-in support for mock app signups and users list. Provision a standard Auth schema for app users without managing credentials manually.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/40">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="https://www.gsgroups.net/gslogo.png" alt="GS Logo" className="w-5 h-5 object-contain" />
            <span className="font-outfit text-sm font-semibold tracking-tight text-zinc-400">
              GSQODER.AI App Builder
            </span>
          </div>

          <SocialShare shareUrl="https://a0-clone.vercel.app" title="GSQODER.AI App Builder" />

          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} a0.dev. All rights reserved. Built for pair-programming demonstration.
          </p>

          <div className="flex gap-4 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
