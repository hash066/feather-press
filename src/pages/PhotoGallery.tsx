import React, { useState } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FloatingShapes, GradientMesh } from '@/components/AnimatedBackground';

// Mock photo data
const mockPhotos = [
  {
    id: 1,
    title: "Sunset at the Beach",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Beautiful sunset over the ocean with golden reflections",
    photographer: "Sarah Wilson",
    uploadedAt: "2024-01-15",
    category: "Nature",
    tags: ["sunset", "beach", "ocean", "golden hour"],
    likes: 156,
    downloads: 23,
    views: 892
  },
  {
    id: 2,
    title: "Mountain Landscape",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Snow-capped mountains in the distance with dramatic clouds",
    photographer: "Mike Johnson",
    uploadedAt: "2024-01-14",
    category: "Landscape",
    tags: ["mountains", "snow", "landscape", "nature"],
    likes: 234,
    downloads: 45,
    views: 1247
  },
  {
    id: 3,
    title: "City Skyline",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Modern city architecture with glass and steel",
    photographer: "Alex Chen",
    uploadedAt: "2024-01-13",
    category: "Urban",
    tags: ["city", "architecture", "urban", "modern"],
    likes: 189,
    downloads: 34,
    views: 756
  },
  {
    id: 4,
    title: "Forest Path",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Peaceful forest trail with dappled sunlight",
    photographer: "Emma Davis",
    uploadedAt: "2024-01-12",
    category: "Nature",
    tags: ["forest", "path", "nature", "trees"],
    likes: 145,
    downloads: 28,
    views: 634
  },
  {
    id: 5,
    title: "Flower Garden",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Colorful spring flowers in full bloom",
    photographer: "Lisa Brown",
    uploadedAt: "2024-01-11",
    category: "Nature",
    tags: ["flowers", "garden", "spring", "colorful"],
    likes: 267,
    downloads: 56,
    views: 1456
  },
  {
    id: 6,
    title: "Desert Dunes",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Golden sand dunes stretching to the horizon",
    photographer: "Tom Wilson",
    uploadedAt: "2024-01-10",
    category: "Landscape",
    tags: ["desert", "dunes", "sand", "golden"],
    likes: 198,
    downloads: 41,
    views: 987
  },
  {
    id: 7,
    title: "Abstract Art",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Colorful abstract patterns and shapes",
    photographer: "David Lee",
    uploadedAt: "2024-01-09",
    category: "Art",
    tags: ["abstract", "art", "colorful", "patterns"],
    likes: 123,
    downloads: 19,
    views: 445
  },
  {
    id: 8,
    title: "Street Photography",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Candid moments of urban life",
    photographer: "Maria Garcia",
    uploadedAt: "2024-01-08",
    category: "Urban",
    tags: ["street", "photography", "urban", "candid"],
    likes: 178,
    downloads: 32,
    views: 723
  }
];

const categories = ['All', 'Nature', 'Landscape', 'Urban', 'Art', 'Portrait'];

const PhotoGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState<typeof mockPhotos[0] | null>(null);
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  // Filter and sort photos
  const filteredPhotos = mockPhotos.filter(photo => {
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

  const handleDownload = (photo: typeof mockPhotos[0]) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title}.jpg`;
    link.click();
  };

  const handleShare = (photo: typeof mockPhotos[0]) => {
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

  const handlePhotoClick = (photo: typeof mockPhotos[0]) => {
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
