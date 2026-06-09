"use client";

import Editor from "@monaco-editor/react";
import { useProjectStore } from "@/lib/store/projectStore";
import { Terminal } from "lucide-react";

interface CodeEditorProps {
  projectId: string;
  selectedFile: string;
}

export default function CodeEditor({ projectId, selectedFile }: CodeEditorProps) {
  const { projects, updateFileContent } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  if (!project) return null;

  const fileContent = project.files[selectedFile] || "";

  // Infer language based on file extension
  const getEditorLanguage = (path: string) => {
    if (path.endsWith(".tsx") || path.endsWith(".ts") || path.endsWith(".jsx") || path.endsWith(".js")) {
      return "typescript";
    }
    if (path.endsWith(".css")) return "css";
    if (path.endsWith(".json")) return "json";
    return "plaintext";
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFileContent(projectId, selectedFile, value);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0c0f]">
      
      {/* Editor Status Bar */}
      <div className="h-10 border-b border-white/5 bg-[#0b0b0f] px-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-zinc-300">{selectedFile}</span>
        </div>
        
        <div className="flex items-center gap-3 text-[10px]">
          <span>UTF-8</span>
          <span>•</span>
          <span className="text-zinc-400 capitalize">{getEditorLanguage(selectedFile)}</span>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 bg-[#0c0c0f]">
        <Editor
          height="100%"
          language={getEditorLanguage(selectedFile)}
          value={fileContent}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 12.5,
            fontFamily: "var(--font-geist-mono), monospace",
            lineNumbers: "on",
            wordWrap: "on",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6
            },
            theme: "vs-dark",
            automaticLayout: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 12, bottom: 12 }
          }}
          loading={
            <div className="h-full w-full flex flex-col justify-center items-center gap-2 text-xs text-zinc-500 font-mono bg-[#0c0c0f]">
              <div className="h-5 w-5 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
              <span>Loading Monaco Editor...</span>
            </div>
          }
        />
      </div>

    </div>
  );
}
