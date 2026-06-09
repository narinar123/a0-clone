import { NextResponse } from "next/server";
import { runAIOrcestrator } from "@/lib/agent/orchestrator";

export async function POST(request: Request) {
  try {
    const { projectId, prompt, files } = await request.json();

    if (!projectId || !prompt || !files) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters (projectId, prompt, files)" },
        { status: 400 }
      );
    }

    const result = await runAIOrcestrator(projectId, prompt, files);

    return NextResponse.json({
      success: true,
      message: result.message,
      filesModified: result.filesModified,
      tasksCompleted: result.tasksCompleted
    });
  } catch (error: unknown) {
    console.error("API /api/agent error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process agent build request.";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
