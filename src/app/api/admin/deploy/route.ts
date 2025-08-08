import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const vercelHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

    if (!vercelHookUrl) {
      return NextResponse.json(
        { error: "Deployment hook URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(vercelHookUrl, { method: "POST" });

    if (!response.ok) {
      throw new Error("Failed to trigger deployment");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deployment trigger error:", error);
    return NextResponse.json(
      { error: "Failed to trigger deployment" },
      { status: 500 }
    );
  }
}
