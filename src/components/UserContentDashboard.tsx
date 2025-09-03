import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Image, 
  Quote, 
  Video, 
  Plus,
  Calendar,
  Eye
} from 'lucide-react';
import { apiClient, Post } from '@/lib/apiClient';
import { FloatingShapes, GradientMesh } from '@/components/AnimatedBackground';

interface UserContentDashboardProps {
  userId?: string;
}

export const UserContentDashboard: React.FC<UserContentDashboardProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [quoteCount, setQuoteCount] = useState<number>(0);
  const [galleryCount, setGalleryCount] = useState<number>(0);
  const [videoCount, setVideoCount] = useState<number>(0);
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log('UserContentDashboard component is rendering!'); // Debug log

  useEffect(() => {
    async function fetchUserPosts() {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
        const author = currentUser?.username || (typeof userId === 'string' ? userId : undefined);
        if (!author) {
          setPosts([]);
          return;
        }
        console.log('[Me] fetching posts for author:', author);
        const [postsRes, quotesRes, galleriesRes, videosRes] = await Promise.allSettled([
          apiClient.getPosts(author),
          apiClient.getQuotes(author),
          apiClient.getGalleries(author),
          apiClient.getVideos(author),
        ]);
        const postsList = postsRes.status === 'fulfilled' ? postsRes.value : [];
        const quotesList = quotesRes.status === 'fulfilled' ? quotesRes.value : [];
        const galleriesList = galleriesRes.status === 'fulfilled' ? galleriesRes.value : [];
        const videosList = videosRes.status === 'fulfilled' ? videosRes.value : [];
        console.log('[Me] fetched', postsList.length, 'posts');
        setPosts(postsList);
        setQuoteCount(quotesList.length);
        setGalleryCount(galleriesList.length);
        setVideoCount(videosList.length);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserPosts();
  }, [userId]);

  const handleNewContent = (type: string) => {
    console.log('Creating new content of type:', type); // Debug log
    switch (type) {
      case 'post':
        navigate('/create-post');
        break;
      case 'gallery':
        navigate('/create-gallery');
        break;
      case 'video':
        navigate('/create-video');
        break;
      case 'quote':
        navigate('/create-quote');
        break;
      default:
        break;
    }
  };

  const contentSections = [
    {
      id: 'post',
      title: 'Blog Posts',
      icon: FileText,
      color: 'from-amber-400 to-yellow-500',
      count: posts.length,
      description: 'Your published articles and stories'
    },
    {
      id: 'gallery',
      title: 'Photo Gallery',
      icon: Image,
      color: 'from-amber-500 to-orange-500',
      count: galleryCount,
      description: 'Your image collections and albums'
    },
    {
      id: 'video',
      title: 'Videos',
      icon: Video,
      color: 'from-yellow-400 to-amber-600',
      count: videoCount,
      description: 'Your video content and tutorials'
    },
    {
      id: 'quote',
      title: 'Quotes',
      icon: Quote,
      color: 'from-amber-400 to-orange-500',
      count: quoteCount,
      description: 'Your inspirational quotes and thoughts'
    }
  ];

  const handleDeletePost = async (postId: number) => {
    try {
      await apiClient.deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (e) {
      console.error('Delete post failed', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-black to-zinc-900">
      {/* Animated background like landing */}
      <FloatingShapes />
      <GradientMesh />
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(234,179,8,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.15) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 mb-4">
            Your Content Dashboard
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Manage and create your published content across different formats
          </p>
        </div>

        {/* Content Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contentSections.map((section) => (
            <Card key={section.id} className="group hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-300 border border-yellow-500/20 bg-zinc-900/80">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} shadow-[0_0_20px_rgba(234,179,8,0.35)] flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                    <section.icon className="w-8 h-8 text-black" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  {section.title}
                </CardTitle>
                <p className="text-sm text-zinc-400 mt-2">
                  {section.description}
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold text-white">
                  {section.count}
                </div>
                <div className="text-sm text-zinc-400">
                  {section.count === 1 ? 'Item' : 'Items'} Published
                </div>
                <Button
                  onClick={() => handleNewContent(section.id)}
                  className={`w-full bg-gradient-to-r ${section.color} hover:opacity-90 text-black font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.35)]`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New {section.title.slice(0, -1)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Posts Section */}
        {posts.length > 0 && (
          <div className="bg-zinc-900/80 border border-yellow-500/20 backdrop-blur rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.1)] p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Recent Blog Posts
              </h2>
              <Button
                onClick={() => handleNewContent('post')}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-90 text-black shadow-[0_0_20px_rgba(234,179,8,0.35)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
            
            <div className="space-y-6">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="border border-yellow-500/20 rounded-lg p-6 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-shadow duration-300 bg-black/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-zinc-300 mb-4 line-clamp-2">
                        {post.content.length > 150 
                          ? `${post.content.substring(0, 150)}...` 
                          : post.content
                        }
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-zinc-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-amber-400" />
                          <span>0 views</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {posts.length > 5 && (
              <div className="text-center mt-8">
                <Button variant="outline" className="px-8 border-yellow-500/30 text-zinc-200 hover:bg-yellow-500/10">
                  View All Posts ({posts.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <FileText className="w-12 h-12 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No content yet
            </h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Start creating your first piece of content! Choose from posts, galleries, videos, or quotes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => handleNewContent('post')}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-90 text-black shadow-[0_0_20px_rgba(234,179,8,0.35)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
