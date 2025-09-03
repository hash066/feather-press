import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Video, Upload, ArrowLeft, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient, API_ORIGIN } from '@/lib/apiClient';

const CreateVideo = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
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
      } else if (videoUrl) {
        finalUrl = videoUrl.trim();
        source = 'url';
      }
      if (!title || !finalUrl) {
        setMessage('Please provide a title and either a video file or URL.');
        return;
      }
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      const created_by = currentUser?.username;
      await apiClient.createVideo({ title, description, created_by, source, url: finalUrl, tags });
      setMessage('Video created!');
      setTitle(''); setDescription(''); setVideoUrl(''); setFile(null);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to create video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Create New Video Post</h1>
          <p className="text-muted-foreground">Share your video content and tutorials</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title</Label>
              <Input id="title" placeholder="Enter video title" className="w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your video content" rows={3} className="w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" placeholder="e.g. nature, travel" className="w-full" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <div className="flex gap-2">
                <Input id="videoUrl" placeholder="YouTube, Vimeo, or direct video link" className="flex-1" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                <Button variant="outline" size="icon">
                  <Link className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Video File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Drag and drop video file here, or click to browse
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button asChild variant="outline">
                    <label htmlFor="video-file" className="cursor-pointer">Choose Video</label>
                  </Button>
                  <input id="video-file" type="file" accept="video/*" onChange={onChooseFile} className="hidden" />
                </div>
                {file && <p className="text-sm text-muted-foreground mt-3">Selected: {file.name}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1" onClick={onCreate} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create Video Post'}</Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
            {message && <p className="text-sm text-muted-foreground pt-2">{message}</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateVideo;
