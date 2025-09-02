import React, { useCallback, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image, Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';

const CreateGallery = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');

  const addFiles = useCallback((files: File[]) => {
    if (!files || files.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  }, []);

  const onChooseFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const files: File[] = [];
    for (let i = 0; i < dt.files.length; i++) {
      const f = dt.files[i];
      if (f.type.startsWith('image/')) files.push(f);
    }
    addFiles(files);
  };

  const onPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file && file.type.startsWith('image/')) files.push(file);
      }
    }
    if (files.length > 0) addFiles(files);
  };

  const onCreateGallery = async () => {
    if (!title || selectedFiles.length === 0) {
      setMessage('Please add a title and select at least one image.');
      return;
    }
    try {
      setIsSubmitting(true);
      setMessage('');
      const { files } = await apiClient.uploadImages(selectedFiles);
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      const created_by = currentUser?.username;
      await apiClient.createGallery({
        title,
        description,
        created_by,
        images: files.map((f) => ({ url: f.url }))
      });
      setMessage(`Gallery created with ${files.length} image(s).`);
    } catch (err: any) {
      setMessage(err?.message || 'Upload failed');
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
          <h1 className="text-3xl font-bold text-foreground">Create New Photo Gallery</h1>
          <p className="text-muted-foreground">Share your beautiful image collections</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Gallery Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Gallery Title</Label>
              <Input
                id="title"
                placeholder="Enter gallery title"
                className="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your gallery"
                rows={3}
                className="w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Images</Label>
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onPaste={onPaste}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Drag & drop, click to browse, or paste from clipboard (Ctrl/Cmd+V)
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button asChild variant="outline">
                    <label htmlFor="file-input" className="cursor-pointer">Choose Images</label>
                  </Button>
                  <input id="file-input" type="file" accept="image/*" multiple onChange={onChooseFiles} className="hidden" />
                </div>
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    {previews.map((src, idx) => (
                      <img key={idx} src={src} className="w-full h-24 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1" onClick={onCreateGallery} disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Create Gallery'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
            {message && (
              <p className="text-sm text-muted-foreground pt-2">{message}</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateGallery;
