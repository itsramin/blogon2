// lib/github.ts
const GITHUB_API = "https://api.github.com";
const REPO = process.env.GITHUB_REPO || "";
const TOKEN = process.env.GITHUB_TOKEN || "";

export async function createFileInRepo(
  path: string,
  content: string,
  message: string
) {
  const [owner, repo] = REPO.split("/");

  if (!owner || !repo) {
    throw new Error("GitHub repository not configured");
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create file in GitHub");
  }

  return await response.json();
}

export async function getFileFromRepo(path: string) {
  const [owner, repo] = REPO.split("/");

  if (!owner || !repo) {
    throw new Error("GitHub repository not configured");
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    const error = await response.json();
    throw new Error(error.message || "Failed to get file from GitHub");
  }

  const data = await response.json();
  if (data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return null;
}
