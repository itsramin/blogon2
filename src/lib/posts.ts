import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import { getFileFromRepo } from "./github";

const rootDirectory = process.cwd();
const postsDirectory = path.join(
  rootDirectory,
  process.env.NODE_ENV === "production"
    ? ".next/server/posts" // Adjusted production path
    : "posts" // Directly point to src/posts in dev
);
const parser = new XMLParser();

export interface PostData {
  slug: string;
  title: string;
  date: string;
  content: string;
}

export async function getAllPosts(): Promise<PostData[]> {
  if (process.env.NODE_ENV === "production") {
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts: PostData[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".xml")) continue;

    const slug = fileName.replace(/\.xml$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    try {
      const parsed = parser.parse(fileContents);
      const post = parsed.post;

      posts.push({
        slug,
        title: post.title,
        date: post.date,
        content: post.content,
      });
    } catch (error: any) {
      console.error(`Error parsing ${fileName}:`, error); // Ensure this exists
      // Consider adding:
      throw new Error(`XML parse error in ${fileName}: ${error.message}`);
    }
  }
  console.log("Found posts:", fileNames, postsDirectory);
  console.log("Current working directory:", process.cwd());
  console.log("Posts directory path:", postsDirectory);
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string) {
  try {
    const xmlContent = await getFileFromRepo(`posts/${slug}.xml`);
    if (!xmlContent) return null;

    // Simple XML parsing (for more complex needs, consider a proper parser)
    const titleMatch = xmlContent.match(/<title>(.*?)<\/title>/);
    const dateMatch = xmlContent.match(/<date>(.*?)<\/date>/);
    const contentMatch = xmlContent.match(/<content>(.*?)<\/content>/);

    return {
      title: titleMatch ? titleMatch[1] : "",
      date: dateMatch ? dateMatch[1] : "",
      content: contentMatch ? contentMatch[1] : "",
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}
