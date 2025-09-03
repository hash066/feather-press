import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Music, Upload, ArrowLeft, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient, API_ORIGIN } from '@/lib/apiClient';

const CreateAudio = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const onCreate = async () => {
    try {
      setIsSubmitting(true);
      setMessage('');
      let finalUrl = '';
      let source: 'upload' | 'url' = 'url';
      if (file) {
        const { files } = await apiClient.uploadImages([file]);
        const first = files[0];
        finalUrl = first ? (first.url.startsWith('/uploads/') ? `${API_ORIGIN}${first.url}` : first.url) : '';
        source = 'upload';
      } else if (audioUrl) {
        finalUrl = audioUrl.trim();
        source = 'url';
      }
      if (!title || !finalUrl) {
        setMessage('Please provide a title and either an audio file or URL.');
        return;
      }
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      const created_by = currentUser?.username;
      await apiClient.createAudio({ title, description, created_by, source, url: finalUrl });
      setMessage('Audio created!');
      setTitle(''); setDescription(''); setAudioUrl(''); setFile(null);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to create audio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Create New Audio</h1>
          <p className="text-muted-foreground">Upload audio or link a URL</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Audio Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Audio Title</Label>
              <Input id="title" placeholder="Enter audio title" className="w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your audio" rows={3} className="w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio URL</Label>
              <div className="flex gap-2">
                <Input id="audioUrl" placeholder="Direct link (mp3, wav) or streaming URL" className="flex-1" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} />
                <Button variant="outline" size="icon">
                  <Link className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload Audio File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Drag and drop audio file here, or click to browse</p>
                <div className="flex items-center justify-center gap-3">
                  <Button asChild variant="outline">
                    <label htmlFor="audio-file" className="cursor-pointer">Choose Audio</label>
                  </Button>
                  <input id="audio-file" type="file" accept="audio/*" onChange={onChooseFile} className="hidden" />
                </div>
                {file && <p className="text-sm text-muted-foreground mt-3">Selected: {file.name}</p>}
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="flex-1" onClick={onCreate} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create Audio'}</Button>
              <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
            </div>
            {message && <p className="text-sm text-muted-foreground pt-2">{message}</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateAudio;


