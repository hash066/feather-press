import React, { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';
import { Play, Pause, ExternalLink } from 'lucide-react';

type VideoItem = { id: number; title: string; description?: string; created_by?: string; source: string; url: string; created_at: string };

const Videos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (e) {
        console.error('Failed to load videos', e);
      }
    })();
  }, []);

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

  const isExternal = (url: string) => /^https?:\/\//.test(url) && !url.includes(window.location.host);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Videos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <Card key={v.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="line-clamp-1">{v.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {v.source === 'upload' && (
                  <div className="relative">
                    <video
                      ref={(el) => (videoRefs.current[v.id] = el)}
                      src={v.url}
                      className="w-full h-56 bg-black"
                      controls={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="secondary" size="icon" onClick={() => togglePlay(v.id)}>
                        {playingId === v.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                )}
                {v.source === 'url' && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={v.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Video
                    </a>
                  </Button>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">{v.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Videos;


