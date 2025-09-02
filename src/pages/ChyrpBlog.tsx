import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Clock, 
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Calendar,
  User,
  Tag,
  FileText,
  Loader2
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FloatingShapes, GradientMesh } from '@/components/AnimatedBackground';
import { apiClient, Post } from '@/lib/apiClient';

const categories = ['All', 'Development', 'Technology', 'Backend', 'CSS', 'AI/ML'];

// Helper function to create excerpt from content
const createExcerpt = (content: string, maxLength: number = 150): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

// Helper function to calculate read time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const ChyrpBlog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { elementRef, isVisible } = useScrollAnimation(0.1);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Array<{ id: number; text: string; author?: string; created_at: string }>>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});

  // Fetch posts from database
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPosts = await apiClient.getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // For now, we'll show all posts regardless of category since we don't have categories in the database yet
    const matchesCategory = selectedCategory === 'All';
    
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        // For now, sort by creation date since we don't have view counts
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'trending':
        // For now, sort by creation date since we don't have like counts
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleLike = async (post: Post) => {
    const idStr = post.id.toString();
    const isLiked = likedPosts.has(idStr);
    try {
      if (isLiked) {
        const { likes } = await apiClient.unlikePost(post.id);
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes } : p));
        setLikedPosts(prev => {
          const s = new Set(prev);
          s.delete(idStr);
          return s;
        });
      } else {
        const { likes } = await apiClient.likePost(post.id);
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes } : p));
        setLikedPosts(prev => new Set(prev).add(idStr));
      }
    } catch (e) {
      console.error('Like toggle failed', e);
    }
  };

  const handleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: createExcerpt(post.content),
        url: `${window.location.origin}/post/${post.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const toggleComments = async (post: Post) => {
    const isOpen = openCommentsPostId === post.id;
    const next = isOpen ? null : post.id;
    setOpenCommentsPostId(next);
    if (!isOpen && !comments[post.id]) {
      try {
        const list = await apiClient.getComments(post.id);
        setComments(prev => ({ ...prev, [post.id]: list }));
      } catch (e) {
        console.error('Load comments failed', e);
      }
    }
  };

  const submitComment = async (post: Post) => {
    const text = (newComment[post.id] || '').trim();
    if (!text) return;
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      const author = currentUser?.username;
      const list = await apiClient.addComment(post.id, text, author);
      setComments(prev => ({ ...prev, [post.id]: list }));
      setNewComment(prev => ({ ...prev, [post.id]: '' }));
    } catch (e) {
      console.error('Add comment failed', e);
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
              <FileText className="w-4 h-4 text-brand-accent animate-pulse-soft" />
              <span className="text-brand-accent font-medium text-sm">Blog & Articles</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-content-primary mb-6">
              Discover Amazing Content
            </h1>
            <p className="text-xl text-content-secondary max-w-4xl mx-auto leading-relaxed">
              Explore our collection of insightful articles, tutorials, and guides written by industry experts.
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
                    placeholder="Search articles, topics, or authors..."
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-content-secondary">
                Showing {filteredPosts.length} of {posts.length} posts
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

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-content-secondary">Loading posts...</span>
              </div>
            </div>
          ) : error ? (
            <Card className="text-center py-12 shadow-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardContent>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-content-primary">Error Loading Posts</h3>
                <p className="text-content-secondary mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredPosts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
            }>
              {sortedPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className={`overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 transform hover:-translate-y-1 border-0 bg-card/80 backdrop-blur-sm`}
                >
                {post.image_url && (
                  <div className="relative">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      Blog Post
                    </Badge>
                    <span className="text-xs text-content-secondary">{calculateReadTime(post.content)}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-brand-accent transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-content-secondary mb-4 line-clamp-3">
                    {createExcerpt(post.content)}
                  </p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="w-4 h-4 text-content-secondary" />
                    <span className="text-sm text-content-secondary">Admin</span>
                    <Calendar className="w-4 h-4 text-content-secondary ml-2" />
                    <span className="text-sm text-content-secondary">{formatDate(post.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-content-secondary">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes ?? 0}</span>
                      </div>
                      <button className="flex items-center space-x-1" onClick={() => toggleComments(post)}>
                        <MessageCircle className="w-4 h-4" />
                        <span>{(comments[post.id]?.length ?? 0)}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post)}
                        className={`h-8 w-8 p-0 ${likedPosts.has(post.id.toString()) ? 'text-brand-accent' : ''}`}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(post.id.toString())}
                        className={`h-8 w-8 p-0 ${bookmarkedPosts.has(post.id.toString()) ? 'text-brand-primary' : ''}`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post)}
                        className="h-8 w-8 p-0"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                {openCommentsPostId === post.id && (
                  <div className="px-6 pb-6 space-y-3">
                    <div className="space-y-2">
                      {(comments[post.id] || []).map(c => (
                        <div key={c.id} className="text-sm text-content-secondary">
                          <span className="font-medium text-content-primary">{c.author || 'Anon'}:</span> {c.text}
                        </div>
                      ))}
                      {(!comments[post.id] || comments[post.id].length === 0) && (
                        <div className="text-sm text-content-secondary">No comments yet.</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 border border-border rounded px-3 py-2 text-sm bg-background"
                        placeholder="Write a comment..."
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      />
                      <Button size="sm" onClick={() => submitComment(post)}>Post</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
          ) : (
            <Card className="text-center py-12 shadow-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardContent>
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-content-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-content-primary">No posts found</h3>
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
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8">
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChyrpBlog;
