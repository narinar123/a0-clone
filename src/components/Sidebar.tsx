"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Grid, 
  BookOpen, 
  HelpCircle, 
  Zap, 
  Share2, 
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Your Apps", href: "/apps", icon: Grid },
    { name: "Documentation", href: "#", icon: BookOpen },
    { name: "Support", href: "#", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0b0b0f] flex flex-col h-screen sticky top-0 shrink-0">
      
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 gap-2.5">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            a0
          </div>
          <span className="font-outfit text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            a0.dev
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/5 text-white shadow-inner border-l-2 border-blue-500 pl-2.5"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : ""}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade & Share Cards */}
      <div className="px-4 py-4 space-y-3.5 border-t border-white/5 bg-black/20">
        
        {/* Share and Earn */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3.5 hover:border-white/10 transition-all cursor-pointer group">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-300">
              <Share2 className="h-3.5 w-3.5 text-purple-400" />
              Share & Earn
            </span>
            <ChevronRight className="h-3 w-3 text-zinc-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
            Get 100 free credits for each friend that joins.
          </p>
        </div>

        {/* Upgrade to Pro */}
        <div className="rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/20 p-3.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-12 w-12 bg-blue-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold">
            <Zap className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            Upgrade to Pro
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
            Unlock unlimited deployments, faster agents, and custom domains.
          </p>
          <button className="w-full mt-3 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-sm">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-pink-500 p-0.5 shadow-sm">
            <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center text-xs font-semibold text-white">
              JD
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-200">John Doe</p>
            <p className="text-[10px] text-zinc-500">john@a0.dev</p>
          </div>
        </div>
        <div className="flex h-5 items-center gap-1 rounded bg-zinc-800/60 px-1.5 text-[10px] font-medium text-zinc-400">
          <span>Free</span>
        </div>
      </div>

    </aside>
  );
}
