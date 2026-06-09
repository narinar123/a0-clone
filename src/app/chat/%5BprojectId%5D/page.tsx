"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Globe, 
  CheckCircle2, 
  ExternalLink
} from "lucide-react";
import { useProjectStore } from "@/lib/store/projectStore";
import ChatPanel from "@/components/ChatPanel";
import WorkspaceTabs, { TabType } from "@/components/WorkspaceTabs";
import PreviewViewport from "@/components/PreviewViewport";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import CloudConsole from "@/components/CloudConsole";
import ConnectorsModal from "@/components/ConnectorsModal";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectWorkspace({ params }: PageProps) {
  const router = useRouter();
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;

  const { projects } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [activeTab, setActiveTab] = useState<TabType>("preview");
  const [selectedFile, setSelectedFile] = useState<string>("src/App.tsx");
  
  // Deploy State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<string | null>(null);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

  // Set default selected file if project files change or loads
  useEffect(() => {
    if (project && !project.files[selectedFile]) {
      const firstFile = Object.keys(project.files)[0];
      if (firstFile && firstFile !== selectedFile) {
        const timer = setTimeout(() => setSelectedFile(firstFile), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [project, selectedFile]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-xs space-y-4 font-mono text-zinc-500">
        <div className="h-5 w-5 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
        <span>Resolving project workspace...</span>
        <button
          onClick={() => router.push("/apps")}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-white/5 cursor-pointer font-sans"
        >
          Return to Apps
        </button>
      </div>
    );
  }

  // Simulated Deployment pipeline
  const handleDeploy = async () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployedUrl(null);

    const steps = [
      "Running ESLint diagnostics...",
      "Syncing dynamic database schemas to production...",
      "Configuring Supabase RLS security policies...",
      "Compiling Next.js/Vite optimized static production assets...",
      "Uploading bundle to Vercel edge routes...",
    ];

    for (const step of steps) {
      setDeployStep(step);
      await new Promise((resolve) => setTimeout(resolve, 1400));
    }

    setDeployStep(null);
    setDeployedUrl(`https://${project.id}-sandbox.vercel.app`);
    setIsDeploying(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#070709] overflow-hidden text-zinc-100 font-sans">
      
      {/* Editor Header Bar */}
      <header className="h-16 border-b border-white/5 bg-[#0b0b0f] flex items-center justify-between px-6 shrink-0 z-20">
        
        {/* Left: Breadcrumbs & Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/apps"
            className="p-2 bg-white/5 border border-white/5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Back to Apps"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs font-semibold">Your Apps</span>
            <span className="text-zinc-700 text-xs">/</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-outfit">{project.name}</span>
              <span className={`h-2 w-2 rounded-full ${
                project.status === "completed" 
                  ? "bg-green-500" 
                  : project.status === "generating"
                  ? "bg-yellow-500 animate-pulse"
                  : "bg-zinc-600"
              }`} />
            </div>
          </div>
        </div>

        {/* Center: Tabs */}
        <WorkspaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right: Cloud Deploy Trigger */}
        <div className="flex items-center gap-3">
          
          {/* Active deployed URL shortcut */}
          {deployedUrl && (
            <a
              href={deployedUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Production Live</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-semibold font-outfit transition-all ${
              isDeploying
                ? "bg-zinc-800 text-zinc-500 border border-zinc-700/20 cursor-not-allowed"
                : "glow-btn-blue text-white cursor-pointer"
            }`}
          >
            {isDeploying ? (
              <div className="h-3.5 w-3.5 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin shrink-0" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span>{isDeploying ? "Deploying..." : "Publish to Web"}</span>
          </button>
        </div>

      </header>

      {/* Editor Body Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Agent Panel */}
        <ChatPanel projectId={projectId} />

        {/* Right Side: Tab Viewports */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c0c0f]">
          
          {/* Viewport 1: Live Interactive Browser */}
          {activeTab === "preview" && (
            <PreviewViewport projectId={projectId} />
          )}

          {/* Viewport 2: Source Code view */}
          {activeTab === "code" && (
            <div className="flex-1 flex h-full overflow-hidden">
              <FileExplorer
                files={project.files}
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
              />
              <CodeEditor
                projectId={projectId}
                selectedFile={selectedFile}
              />
            </div>
          )}

          {/* Viewport 3: Database Designer */}
          {activeTab === "database" && (
            <CloudConsole projectId={projectId} />
          )}

          {/* Viewport 4: Webhook Connectors Console */}
          {activeTab === "connectors" && (
            <ConnectorsModal projectId={projectId} />
          )}

        </div>

      </div>

      {/* Deploying Pipeline Modal */}
      {isDeploying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d0d12] p-6 space-y-4 shadow-2xl text-center select-none">
            <div className="h-10 w-10 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin mx-auto" />
            
            <div className="space-y-1.5">
              <h3 className="font-outfit text-sm font-bold text-white">Publishing Application</h3>
              <p className="text-[10px] text-zinc-500 font-mono leading-relaxed px-4">
                {deployStep}
              </p>
            </div>

            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse w-[60%]" />
            </div>
          </div>
        </div>
      )}

      {/* Deployment Success Modal */}
      {deployedUrl && !isDeploying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d0d12] p-6 space-y-4 shadow-2xl text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            
            <div className="space-y-1">
              <h3 className="font-outfit text-base font-bold text-white">Application Deployed Live!</h3>
              <p className="text-[11px] text-zinc-400">
                Your application and PostgreSQL schema are live at:
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-blue-400 select-all truncate">
              {deployedUrl}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeployedUrl(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close View
              </button>
              <a
                href={deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="glow-btn-blue flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-semibold text-white font-outfit"
              >
                Launch App
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
