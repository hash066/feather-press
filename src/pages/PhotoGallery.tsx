import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Grid3X3, 
  List, 
  Upload, 
  Heart, 
  Download, 
  Share2, 
  Eye,
  Calendar,
  User,
  Tag,
  Filter,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FloatingShapes, GradientMesh } from '@/components/AnimatedBackground';
import { apiClient, PhotoItem } from '@/lib/apiClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const mockPhotos: PhotoItem[] = [];

const categories = ['All', 'Nature', 'Landscape', 'Urban', 'Art', 'Portrait'];

const PhotoGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>(mockPhotos);
  const { elementRef, isVisible } = useScrollAnimation(0.1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState<{title: string; url?: string; dataUrl?: string; description?: string; category?: string; tags?: string;}>({ title: '' });
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = !!currentUser && currentUser.role === 'admin';

  useEffect(() => {
    (async () => {
      try {
        const list = await apiClient.getPhotos();
        setPhotos(list);
      } catch {}
    })();
  }, []);

  // Filter and sort photos
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = !searchQuery || 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'trending':
        return b.likes - a.likes;
      default:
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }
  });

  const handleLike = (photoId: number) => {
    setLikedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleDownload = (photo: PhotoItem) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title}.jpg`;
    link.click();
  };

  const handleShare = (photo: PhotoItem) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: photo.url,
      });
    } else {
      navigator.clipboard.writeText(photo.url);
      alert('Photo URL copied to clipboard!');
    }
  };

  const handlePhotoClick = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    try {
      const created = newPhoto.dataUrl
        ? await apiClient.uploadPhotoLocal({
            title: newPhoto.title.trim(),
            dataUrl: newPhoto.dataUrl,
            description: newPhoto.description?.trim() || undefined,
            category: newPhoto.category?.trim() || undefined,
            tags: newPhoto.tags?.trim() || undefined,
            created_by: user?.username,
            photographer: user?.username,
          })
        : await apiClient.createPhoto({
            title: newPhoto.title.trim(),
            url: (newPhoto.url || '').trim(),
            description: newPhoto.description?.trim() || undefined,
            category: newPhoto.category?.trim() || undefined,
            tags: newPhoto.tags?.trim() || undefined,
            created_by: user?.username,
            photographer: user?.username,
          });
      setPhotos(prev => [created, ...prev]);
      setIsCreateOpen(false);
      setNewPhoto({ title: '' });
    } catch (err) {
      const msg = (err as Error)?.message || 'Failed to upload photo';
      alert(msg);
    }
  };

  const handleDelete = async (photo: PhotoItem) => {
    if (!currentUser) return alert('Please log in');
    if (!confirm('Delete this photo?')) return;
    try {
      await apiClient.deletePhoto(photo.id, { userId: currentUser.id, username: currentUser.username, isAdmin });
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
    } catch (e) {
      console.error('Delete photo failed', e);
      alert('Failed to delete photo');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section ref={elementRef} className="py-24 content-gradient relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <FloatingShapes />
        <GradientMesh />
        <div className="absolute inset-0 morphing-bg opacity-30"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              animation: 'gradient-y 25s ease infinite'
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-brand-accent/10 px-4 py-2 rounded-full mb-6">
              <Camera className="w-4 h-4 text-brand-accent animate-pulse-soft" />
              <span className="text-brand-accent font-medium text-sm">Photo Gallery</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-content-primary mb-6">
              Explore Beautiful Moments
            </h1>
            <p className="text-xl text-content-secondary max-w-4xl mx-auto leading-relaxed">
              Discover stunning photographs from talented photographers around the world.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 shadow-soft border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-content-secondary" />
                  <Input
                    type="text"
                    placeholder="Search photos, photographers, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-12 text-base border-border bg-background text-content-primary placeholder-content-secondary focus:border-brand-accent focus:ring-brand-accent"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: 'latest' | 'popular' | 'trending') => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="popular">Most Viewed</SelectItem>
                      <SelectItem value="trending">Most Liked</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-1 border border-border rounded-lg p-1 bg-background">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 w-8 p-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary/90 hover:to-brand-accent/90 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border border-border">
                      <DialogHeader>
                        <DialogTitle>Upload a new photo</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                          <label className="block text-sm mb-1">Title</label>
                          <Input value={newPhoto.title} onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm">Select Image</label>
                          <Input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => setNewPhoto(p => ({ ...p, dataUrl: String(reader.result) }));
                            reader.readAsDataURL(file);
                          }} />
                          {(newPhoto.dataUrl || newPhoto.url) && (
                            <div className="mt-2 border rounded-md overflow-hidden">
                              <img src={newPhoto.dataUrl || newPhoto.url!} alt="Preview" className="max-h-48 w-full object-contain bg-muted" />
                            </div>
                          )}
                          <div className="text-xs text-content-secondary">Or paste an image URL below (optional)</div>
                          <Input type="url" value={newPhoto.url || ''} onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })} placeholder="https://..." />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Description</label>
                          <Textarea rows={3} value={newPhoto.description || ''} onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm mb-1">Category</label>
                            <Input value={newPhoto.category || ''} onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Tags (comma separated)</label>
                            <Input value={newPhoto.tags || ''} onChange={(e) => setNewPhoto({ ...newPhoto, tags: e.target.value })} />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                          <Button type="submit">Upload</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-content-secondary">
                Showing {filteredPhotos.length} of {mockPhotos.length} photos
              </span>
              {(searchQuery || selectedCategory !== 'All') && (
                <Badge variant="secondary" className="text-xs">
                  Filtered
                </Badge>
              )}
            </div>
            <div className="text-sm text-content-secondary">
              Sorted by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </div>
          </div>

          {/* Photos Grid/List */}
          {filteredPhotos.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-6'
            }>
              {sortedPhotos.map((photo) => (
                <Card 
                  key={photo.id} 
                  className="overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 transform hover:-translate-y-1 group cursor-pointer border-0 bg-card/80 backdrop-blur-sm"
                  onClick={() => handlePhotoClick(photo)}
                >
                <div className="relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      viewMode === 'grid' ? 'h-64' : 'h-32'
                    }`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(photo.id);
                        }}
                        className={`h-8 w-8 p-0 ${likedPhotos.has(photo.id) ? 'text-red-500' : ''}`}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(photo);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      {(isAdmin || (currentUser && currentUser.username === photo.created_by)) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleDelete(photo); }}
                          className="h-8 w-8 p-0"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <Badge className="absolute top-4 left-4 bg-brand-accent text-white">
                    {photo.category}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors">
                    {photo.title}
                  </h3>
                  
                  {viewMode === 'list' && (
                    <p className="text-content-secondary mb-3 line-clamp-2 text-sm">
                      {photo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-content-secondary">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{photo.photographer}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{photo.uploadedAt}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-sm text-content-secondary">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{photo.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{photo.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{photo.downloads}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {photo.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{photo.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          ) : (
            <Card className="text-center py-12 shadow-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardContent>
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-content-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-content-primary">No photos found</h3>
                <p className="text-content-secondary mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }} 
                  variant="outline"
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Load More Button */}
          {filteredPhotos.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8">
                Load More Photos
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-auto"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-card/90 hover:bg-card border border-border"
              >
                ×
              </Button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-content-primary">{selectedPhoto.title}</h2>
              <p className="text-content-secondary mb-4">{selectedPhoto.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-content-secondary">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{selectedPhoto.photographer}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedPhoto.uploadedAt}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLike(selectedPhoto.id)}
                    className={likedPhotos.has(selectedPhoto.id) ? 'text-brand-accent' : ''}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {selectedPhoto.likes}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedPhoto)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(selectedPhoto)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPhoto.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
