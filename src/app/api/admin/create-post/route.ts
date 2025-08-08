import { NextRequest, NextResponse } from "next/server";
import { createFileInRepo } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<post>
  <title>${escapeXml(title)}</title>
  <date>${new Date().toISOString().split("T")[0]}</date>
  <content>${escapeXml(content)}</content>
</post>`;

    // Save to GitHub
    await createFileInRepo(
      `posts/${slug}.xml`,
      xmlContent,
      `Add new post: ${title}`
    );

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 }
    );
  }
}

// Keep your escapeXml function

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
