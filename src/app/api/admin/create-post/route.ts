import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const filePath = path.join(process.cwd(), "posts", `${slug}.xml`);

    // Create XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<post>
  <title>${escapeXml(title)}</title>
  <date>${new Date().toISOString().split("T")[0]}</date>
  <content>${escapeXml(content)}</content>
</post>`;

    await writeFile(filePath, xmlContent);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

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
