import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

const PostPage = ({ params }: { params: { slug: string } }) => {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-6">{post.date}</p>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostPage;
