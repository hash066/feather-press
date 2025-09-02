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
  Download, 
  Share2, 
  Calendar,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { apiClient, API_ORIGIN } from '@/lib/apiClient';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FloatingShapes, GradientMesh } from '@/components/AnimatedBackground';

//

const categories = ['All'];

type Gallery = { id: number; title: string; description?: string; created_by?: string; images: string; created_at: string };
type GalleryImage = { url: string };
type BlogPost = { id: number; title: string; image_url?: string; created_at: string };
type UploadFile = { name: string; url: string; size: number; mtime: number };

const PhotoGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [selectedPhoto, setSelectedPhoto] = useState<{ title: string; url: string; uploadedAt: string } | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allUploads, setAllUploads] = useState<Array<{ id: string; title: string; url: string; uploadedAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  const normalizeUrl = (raw: string): string => {
    if (!raw) return '/placeholder.svg';
    const trimmed = raw.trim();
    // Treat obviously invalid values as missing
    if (trimmed === 'null' || trimmed === 'undefined' || /[<>]/.test(trimmed)) {
      return '/placeholder.svg';
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('/uploads/')) return `${API_ORIGIN}${trimmed}`;
    if (trimmed.startsWith('uploads/')) return `${API_ORIGIN}/${trimmed}`;
    // If no extension and not a known path, fallback
    if (!/\.[a-zA-Z0-9]{2,5}($|\?)/.test(trimmed)) return '/placeholder.svg';
    return trimmed;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          apiClient.getGalleries(),
          apiClient.getPosts(),
          apiClient.listUploads(),
        ]);

        const gRes = results[0];
        const pRes = results[1];
        const uRes = results[2];

        if (gRes.status === 'fulfilled') setGalleries(gRes.value);
        if (pRes.status === 'fulfilled') setPosts(pRes.value);
        if (uRes.status === 'fulfilled') {
          const uploadPhotos: Array<{ id: string; title: string; url: string; uploadedAt: string }> = ((uRes.value?.files || []) as UploadFile[])
            .map((f) => ({ id: `upload-${f.name}`, title: f.name, url: normalizeUrl(f.url), uploadedAt: new Date(f.mtime).toISOString() }));
          setAllUploads(uploadPhotos);
        } else {
          setAllUploads([]);
        }
      } catch (e) {
        console.error('Failed to load gallery data:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  // Build a flat list of images from galleries
  const galleryPhotos: Array<{ id: string; title: string; url: string; uploadedAt: string }> = galleries.flatMap((g) => {
    let imgs: GalleryImage[] = [];
    try { imgs = JSON.parse(g.images) as GalleryImage[]; } catch {}
    const photos = imgs.map((img, idx) => ({ 
      id: `${g.id}-${idx}`, 
      title: g.title, 
      url: normalizeUrl(img.url), 
      uploadedAt: g.created_at 
    }));
    if (photos.length === 0) {
      photos.push({ id: `${g.id}-0`, title: g.title, url: '/placeholder.svg', uploadedAt: g.created_at });
    }
    return photos;
  });

  const postPhotos: Array<{ id: string; title: string; url: string; uploadedAt: string }> = posts
    .map((p) => ({
      id: `post-${p.id}`,
      title: p.title,
      url: p.image_url && p.image_url.trim() !== '' ? normalizeUrl(p.image_url) : '/placeholder.svg',
      uploadedAt: p.created_at,
    }));

  const allPhotos = [...allUploads, ...galleryPhotos, ...postPhotos];

  const filteredPhotos = allPhotos.filter((photo) => {
    const matchesSearch = !searchQuery || photo.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All';
    return matchesSearch && matchesCategory;
  });

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      default:
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }
  });

  const handleDownload = (photo: { title: string; url: string }) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title}.jpg`;
    link.click();
  };

  const handleShare = (photo: { title: string; url: string }) => {
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

  const handlePhotoClick = (photo: { title: string; url: string; uploadedAt: string }) => {
    setSelectedPhoto(photo);
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

                  <Button className="bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary/90 hover:to-brand-accent/90 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-content-secondary">
                Showing {filteredPhotos.length} of {allPhotos.length} photos
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
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
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
                    </div>
                  </div>

                  
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors">
                    {photo.title}
                  </h3>
                  
                  
                  
                  <div className="flex items-center justify-between text-sm text-content-secondary">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{photo.uploadedAt}</span>
                    </div>
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
            <div className="text-center mt-12"></div>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-content-secondary">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedPhoto.uploadedAt}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
