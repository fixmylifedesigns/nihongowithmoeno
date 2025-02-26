"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ContentRenderer from "@/components/ContentRenderer.js";

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`);
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Blog post not found"
            : "Failed to fetch blog post"
        );
      }
      const data = await response.json();
      setPost(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 ">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
            Error: {error}
          </div>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Blog Post Not Found
            </h1>
            <Link href="/blog" className="text-blue-600 hover:text-blue-800">
              ← Back to blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const parsedContent = post.fields.Content ? JSON.parse(post.fields.Content) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto py-12 px-4">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 mb-8 block"
        >
          ← Back to blog
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden text-black">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
                ${
                  post.fields.Category === "Grammar"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {post.fields.Category}
              </span>
              <time className="text-sm text-gray-500">
                {formatDate(post.fields["Date Published"])}
              </time>
              {post.fields["Date Edited"] && (
                <span className="text-sm text-gray-500">
                  (Updated: {formatDate(post.fields["Date Edited"])})
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.fields.Title}
            </h1>

            <div className="text-gray-600 mb-6">{post.fields.Description}</div>

            {/* Content Renderer */}
            <div className="prose prose-lg max-w-none">
              {parsedContent && <ContentRenderer content={parsedContent} />}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center">
                <div>
                  <div className="text-sm text-gray-500">Written by</div>
                  <div className="text-gray-900 font-medium">
                    {post.fields.Author}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}