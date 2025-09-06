import React, { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';
import { Play, Pause, ExternalLink, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

type VideoItem = { id: number; title: string; description?: string; created_by?: string; source: string; url: string; likes?: number; tags?: string; created_at: string };

interface Comment {
  id: number;
  content_type: string;
  content_id: number;
  author?: string;
  text: string;
  created_at: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
        
        // Load comments for each video
        const commentsData: Record<number, Comment[]> = {};
        for (const video of data) {
          try {
            const videoComments = await apiClient.getComments('videos', video.id);
            commentsData[video.id] = videoComments;
          } catch (error) {
            console.error(`Failed to load comments for video ${video.id}:`, error);
            commentsData[video.id] = [];
          }
        }
        setComments(commentsData);
      } catch (e) {
        console.error('Failed to load videos', e);
      }
    })();
  }, []);

  const filteredVideos = videos.filter((v) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const extractTags = (raw?: string): string[] => {
      if (!raw) return [];
      const s = raw.trim();
      try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) return parsed.map(x => String(x).toLowerCase()); } catch {}
      return s.split(/[,#\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
    };
    const tagTokens = extractTags(v.tags);
    return (
      (v.title || '').toLowerCase().includes(q) ||
      (v.description || '').toLowerCase().includes(q) ||
      tagTokens.some(t => t.includes(q))
    );
  });

  const togglePlay = (id: number) => {
    const el = videoRefs.current[id];
    if (!el) return;
    if (playingId === id) {
      el.pause();
      setPlayingId(null);
    } else {
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId]!.pause();
      }
      el.play();
      setPlayingId(id);
    }
  };

  const handleLike = async (video: VideoItem) => {
    try {
      const videoId = video.id.toString();
      if (likedVideos.has(videoId)) {
        await apiClient.unlikeVideo(video.id);
        setLikedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
      } else {
        await apiClient.likeVideo(video.id);
        setLikedVideos(prev => new Set(prev).add(videoId));
      }
      
      // Refresh videos to get updated like count
      const updatedVideos = await apiClient.getVideos();
      setVideos(updatedVideos);
    } catch (error) {
      console.error('Failed to like/unlike video:', error);
    }
  };

  const toggleComments = (videoId: number) => {
    setShowComments(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const handleAddComment = async (videoId: number) => {
    const commentText = newComment[videoId]?.trim();
    if (!commentText) return;

    try {
      await apiClient.addComment('videos', videoId, commentText, currentUser?.username);
      setNewComment(prev => ({ ...prev, [videoId]: '' }));
      
      // Refresh comments
      const updatedComments = await apiClient.getComments('videos', videoId);
      setComments(prev => ({
        ...prev,
        [videoId]: updatedComments
      }));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleShare = (video: VideoItem) => {
    const text = `${video.title} - ${video.description || 'Check out this video!'}`;
    if (navigator.share) {
      navigator.share({ text, url: video.url });
    } else {
      navigator.clipboard.writeText(video.url);
    }
  };

  const isExternal = (url: string) => /^https?:\/\//.test(url) && !url.includes(window.location.host);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Videos</h1>
        <div>
          <Input placeholder="Search videos or tags..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="line-clamp-1">{video.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {video.source === 'upload' && (
                  <div className="relative">
                    <video
                      ref={(el) => (videoRefs.current[video.id] = el)}
                      src={video.url}
                      className="w-full h-56 bg-black"
                      controls={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="secondary" size="icon" onClick={() => togglePlay(video.id)}>
                        {playingId === video.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                )}
                {video.source === 'url' && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={video.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Video
                    </a>
                  </Button>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                
                {/* Interaction buttons */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{video.likes ?? 0}</span>
                    </div>
                    <button className="flex items-center space-x-1" onClick={() => toggleComments(video.id)}>
                      <MessageCircle className="w-4 h-4" />
                      <span>{(comments[video.id]?.length ?? 0)}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(video)}
                      className={`h-8 w-8 p-0 ${likedVideos.has(video.id.toString()) ? 'text-brand-accent' : ''}`}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(video)}
                      className="h-8 w-8 p-0"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Comments section */}
                {showComments[video.id] && (
                  <div className="pt-3 border-t border-border">
                    <h4 className="font-medium mb-3">Comments</h4>
                    
                    {/* Add comment form */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment[video.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [video.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleAddComment(video.id)}
                        disabled={!newComment[video.id]?.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                    
                    {/* Comments list */}
                    <div className="space-y-3">
                      {comments[video.id]?.map(comment => (
                        <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground mb-1">
                            {comment.author || 'Anonymous'} • {new Date(comment.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-foreground">{comment.text}</div>
                        </div>
                      ))}
                      {(!comments[video.id] || comments[video.id].length === 0) && (
                        <div className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Videos;


