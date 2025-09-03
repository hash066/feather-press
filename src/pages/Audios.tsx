import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';
import { Play, Pause, ExternalLink } from 'lucide-react';

type AudioItem = { id: number; title: string; description?: string; created_by?: string; source: string; url: string; created_at: string };

const Audios = () => {
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({});

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.getAudios();
        setAudios(data);
      } catch (e) {
        console.error('Failed to load audios', e);
      }
    })();
  }, []);

  const togglePlay = (id: number) => {
    const el = audioRefs.current[id];
    if (!el) return;
    if (playingId === id) {
      el.pause();
      setPlayingId(null);
    } else {
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId]!.pause();
      }
      el.play();
      setPlayingId(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Audios</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audios.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{a.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {a.source === 'upload' && (
                  <div className="flex items-center gap-3">
                    <audio ref={(el) => (audioRefs.current[a.id] = el)} src={a.url} className="w-full" />
                    <Button variant="secondary" size="icon" onClick={() => togglePlay(a.id)}>
                      {playingId === a.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                  </div>
                )}
                {a.source === 'url' && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={a.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Audio
                    </a>
                  </Button>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Audios;


