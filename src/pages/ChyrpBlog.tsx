import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Clock, 
  Star,
  Bookmark,
  Share2,
  Eye,
  MessageCircle,
  Heart,
  Sparkles,
  Zap
} from 'lucide-react';
import { ChyrpPostCard } from '@/themes/chyrp/ChyrpPostCard';
import { ChyrpSidebar } from '@/themes/chyrp/ChyrpSidebar';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with actual API calls
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-react-typescript',
    excerpt: 'Learn how to build modern web applications with React and TypeScript. This comprehensive guide covers everything from setup to advanced patterns.',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    author: { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face' },
    category: { name: 'Development', slug: 'development' },
    tags: [{ name: 'React', slug: 'react' }, { name: 'TypeScript', slug: 'typescript' }, { name: 'Frontend', slug: 'frontend' }],
    createdAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    viewCount: 1247,
    likeCount: 89,
    commentCount: 23,
    isTrending: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'The Future of Web Development in 2024',
    slug: 'future-web-development-2024',
    excerpt: 'Explore the latest trends and technologies that will shape web development in 2024 and beyond.',
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    author: { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face' },
    category: { name: 'Technology', slug: 'technology' },
    tags: [{ name: 'Web Development', slug: 'web-development' }, { name: 'Trends', slug: 'trends' }],
    createdAt: '2024-01-14T15:30:00Z',
    readTime: 12,
    viewCount: 892,
    likeCount: 67,
    commentCount: 15,
    isTrending: true
  },
  {
    id: '3',
    title: 'Building Scalable APIs with Node.js',
    slug: 'building-scalable-apis-nodejs',
    excerpt: 'A deep dive into building robust and scalable APIs using Node.js, Express, and modern best practices.',
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    author: { name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face' },
    category: { name: 'Backend', slug: 'backend' },
    tags: [{ name: 'Node.js', slug: 'nodejs' }, { name: 'API', slug: 'api' }, { name: 'Express', slug: 'express' }],
    createdAt: '2024-01-13T09:15:00Z',
    readTime: 15,
    viewCount: 567,
    likeCount: 45,
    commentCount: 8
  },
  {
    id: '4',
    title: 'CSS Grid vs Flexbox: When to Use Each',
    slug: 'css-grid-vs-flexbox',
    excerpt: 'Understanding the differences between CSS Grid and Flexbox, and when to use each layout system.',
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    author: { name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face' },
    category: { name: 'CSS', slug: 'css' },
    tags: [{ name: 'CSS', slug: 'css' }, { name: 'Layout', slug: 'layout' }, { name: 'Grid', slug: 'grid' }],
    createdAt: '2024-01-12T14:20:00Z',
    readTime: 6,
    viewCount: 423,
    likeCount: 34,
    commentCount: 12
  },
  {
    id: '5',
    title: 'Introduction to Machine Learning for Developers',
    slug: 'introduction-machine-learning-developers',
    excerpt: 'A beginner-friendly guide to machine learning concepts and how developers can integrate ML into their applications.',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    author: { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face' },
    category: { name: 'AI/ML', slug: 'ai-ml' },
    tags: [{ name: 'Machine Learning', slug: 'machine-learning' }, { name: 'AI', slug: 'ai' }, { name: 'Python', slug: 'python' }],
    createdAt: '2024-01-11T11:45:00Z',
    readTime: 18,
    viewCount: 789,
    likeCount: 56,
    commentCount: 19,
    isFeatured: true
  }
];

const mockCategories = [
  { id: '1', name: 'Development', slug: 'development', count: 15 },
  { id: '2', name: 'Technology', slug: 'technology', count: 12 },
  { id: '3', name: 'Backend', slug: 'backend', count: 8 },
  { id: '4', name: 'CSS', slug: 'css', count: 6 },
  { id: '5', name: 'AI/ML', slug: 'ai-ml', count: 4 }
];

const mockTags = [
  { id: '1', name: 'React', slug: 'react', count: 8 },
  { id: '2', name: 'TypeScript', slug: 'typescript', count: 6 },
  { id: '3', name: 'Node.js', slug: 'nodejs', count: 5 },
  { id: '4', name: 'CSS', slug: 'css', count: 4 },
  { id: '5', name: 'Machine Learning', slug: 'machine-learning', count: 3 }
];

const ChyrpBlog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  // Mock API calls
  const { data: posts = mockPosts, isLoading } = useQuery({
    queryKey: ['posts', searchQuery, selectedCategory, selectedTag, sortBy],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPosts;
    }
  });

  const { data: categories = mockCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => mockCategories
  });

  const { data: tags = mockTags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => mockTags
  });

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || post.category?.slug === selectedCategory;
    const matchesTag = !selectedTag || post.tags?.some(tag => tag.slug === selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.viewCount || 0) - (a.viewCount || 0);
      case 'trending':
        return (b.likeCount || 0) - (a.likeCount || 0);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleLike = (postId: string) => {
    toast({
      title: "Post liked!",
      description: "Thanks for your feedback.",
    });
  };

  const handleShare = (post: any) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `${window.location.origin}/post/${post.slug}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.slug}`);
      toast({
        title: "Link copied!",
        description: "Post link has been copied to clipboard.",
      });
    }
  };

  const handleBookmark = (postId: string) => {
    toast({
      title: "Post bookmarked!",
      description: "Post has been added to your bookmarks.",
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setSortBy('latest');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag || sortBy !== 'latest';

  return (
    <div className="min-h-screen chyrp-page-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 chyrp-hero-bg py-16 px-8 rounded-3xl">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 chyrp-glass">
            <Sparkles className="w-4 h-4" />
            <span>Discover amazing content</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 chyrp-heading">
            Blog & Articles
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of insightful articles, tutorials, and guides written by industry experts.
          </p>
        </div>

        {/* Main Content - No sidebar since ChyrpLayout provides it */}
        <div className="w-full">
          {/* Search and Filters */}
          <Card className="mb-8 chyrp-glass">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles, topics, or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-12 text-base"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </Button>

                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Latest</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="popular">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>Popular</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="trending">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Trending</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-1 border rounded-lg p-1">
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

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name} ({category.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Tags</SelectItem>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.slug}>
                            {tag.name} ({tag.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Showing {filteredPosts.length} of {posts.length} posts
              </span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  Filtered
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Sorted by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </div>
          </div>

          {/* Posts Grid/List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded mb-1" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
            }>
              {sortedPosts.map((post, index) => (
                <ChyrpPostCard
                  key={post.id}
                  post={post}
                  variant={index === 0 && sortBy === 'trending' ? 'featured' : 'default'}
                  onLike={handleLike}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8">
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChyrpBlog;
