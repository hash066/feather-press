import { apiClient, Post } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No posts yet. Create your first post!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
            <div className="text-sm text-gray-500">
              Created: {new Date(post.created_at).toLocaleDateString()}
              {post.updated_at !== post.created_at && (
                <span> • Updated: {new Date(post.updated_at).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
