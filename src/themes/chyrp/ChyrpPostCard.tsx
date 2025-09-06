import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  ExternalLink,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  author?: string;
  created_at: string;
  updated_at: string;
}

interface ChyrpPostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
  onLike?: (postId: number) => void;
  onShare?: (post: Post) => void;
  onBookmark?: (postId: number) => void;
}

export const ChyrpPostCard: React.FC<ChyrpPostCardProps> = ({
  post,
  variant = 'default',
  onLike,
  onShare,
  onBookmark
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const createExcerpt = (content: string, maxLength: number = 150): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post);
    } else if (navigator.share) {
      navigator.share({
        title: post.title,
        text: createExcerpt(post.content),
        url: `${window.location.origin}/post/${post.id}`,
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) {
      onBookmark(post.id);
    }
  };

  const cardVariants = {
    default: 'group hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
    featured: 'group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary/20',
    compact: 'group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5'
  };

  const imageVariants = {
    default: 'aspect-video',
    featured: 'aspect-[16/9]',
    compact: 'aspect-square'
  };

  return (
    <TooltipProvider>
      <Card className={`relative overflow-hidden chyrp-card chyrp-hover-lift ${cardVariants[variant]}`}>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBookmark}
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share this post</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Featured Image */}
        {post.image_url && !imageError && (
          <div className={`relative overflow-hidden ${imageVariants[variant]}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
            <img
              src={post.image_url}
              alt={post.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
          </div>
        )}

        <CardHeader className="pb-3">
          {/* Category */}
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              Blog Post
            </Badge>
          </div>

          {/* Title */}
          <Link to={`/post/${post.id}`}>
            <h3 className={`font-bold leading-tight group-hover:text-primary transition-colors duration-200 ${
              variant === 'featured' ? 'text-2xl' : variant === 'compact' ? 'text-lg' : 'text-xl'
            }`}>
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          {variant !== 'compact' && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-foreground/80 transition-colors duration-200">
              {createExcerpt(post.content)}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {(post.author || 'A').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground/80">{post.author || 'Admin'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{calculateReadTime(post.content)}</span>
              </div>
            </div>
          </div>



          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className={`w-3 h-3 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                <span>0</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>0</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Link to={`/post/${post.id}`}>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  Read More
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </TooltipProvider>
  );
};

export default ChyrpPostCard;
