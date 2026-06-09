"use client";

import { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  FileJson,
  FileCode
} from "lucide-react";

interface FileExplorerProps {
  files: Record<string, string>;
  selectedFile: string;
  onSelectFile: (path: string) => void;
}

export default function FileExplorer({ files, selectedFile, onSelectFile }: FileExplorerProps) {
  const [srcOpen, setSrcOpen] = useState(true);

  // Group files into structural nodes
  const rootFiles = Object.keys(files).filter((f) => !f.includes("/"));
  const srcFiles = Object.keys(files).filter((f) => f.startsWith("src/"));

  const getFileIcon = (path: string) => {
    if (path.endsWith(".json")) return <FileJson className="h-3.5 w-3.5 text-yellow-500/80" />;
    return <FileCode className="h-3.5 w-3.5 text-blue-400/80" />;
  };

  const renderFileRow = (path: string, displayName: string) => {
    const isSelected = selectedFile === path;
    return (
      <div
        key={path}
        onClick={() => onSelectFile(path)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
          isSelected 
            ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
        }`}
      >
        {getFileIcon(displayName)}
        <span>{displayName}</span>
      </div>
    );
  };

  return (
    <div className="w-56 border-r border-white/5 bg-[#0b0b0f] flex flex-col h-full shrink-0 select-none p-3 space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-bold px-2 uppercase tracking-wider">
        <span>Files Explorer</span>
        <button className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Directory Hierarchy */}
      <div className="space-y-1">
        
        {/* Src Directory */}
        <div className="space-y-0.5">
          <div
            onClick={() => setSrcOpen(!srcOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-bold text-zinc-300 cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            {srcOpen ? <ChevronDown className="h-3 w-3 text-zinc-500" /> : <ChevronRight className="h-3 w-3 text-zinc-500" />}
            {srcOpen ? <FolderOpen className="h-3.5 w-3.5 text-blue-400/70" /> : <Folder className="h-3.5 w-3.5 text-blue-400/70" />}
            <span>src</span>
          </div>

          {srcOpen && (
            <div className="pl-5 space-y-0.5">
              {srcFiles.map((path) => {
                const displayName = path.substring(4); // Remove 'src/' prefix
                return renderFileRow(path, displayName);
              })}
            </div>
          )}
        </div>

        {/* Root Files */}
        {rootFiles.map((path) => renderFileRow(path, path))}

      </div>

    </div>
  );
}
