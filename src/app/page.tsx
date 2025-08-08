import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Blog</h1>
      <Link href={`/admin`}>Admin</Link>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="p-4 border rounded">
            <h2 className="text-xl font-semibold">
              <Link
                href={`/posts/${post.slug}`}
                className="hover:text-blue-600"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-500">{post.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
