import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className=" flex justify-between mb-6">
        <h1 className="text-3xl font-bold">My Blog</h1>
        <Link className="text-xl" href={`/admin`}>
          Admin
        </Link>
      </div>
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
