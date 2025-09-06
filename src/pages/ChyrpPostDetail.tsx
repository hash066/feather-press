import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient, Post } from '@/lib/apiClient';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ChyrpPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const p = await apiClient.getPost(Number(id));
        setPost(p);
      } catch (e: any) {
        setError(e?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">Back</Button>
        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <Card><CardContent className="py-10">{error}</CardContent></Card>
        ) : post ? (
          <Card className="border border-border">
            <CardContent className="py-6 space-y-4">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              {post.image_url && (
                <img src={post.image_url} alt={post.title} className="w-full rounded" />
              )}
              <div className="prose prose-invert max-w-none whitespace-pre-wrap">{post.content}</div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default ChyrpPostDetail;
