import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Tag, Folder, User, Clock } from 'lucide-react';

interface ChyrpSidebarProps {
  author: string;
  posts: any[];
  categories: any[];
  tags: any[];
}

export const ChyrpSidebar: React.FC<ChyrpSidebarProps> = ({
  author,
  posts,
  categories,
  tags
}) => {
  const recentPosts = posts.slice(0, 5);
  const topCategories = categories.slice(0, 10);
  const topTags = tags.slice(0, 15);

  return (
    <aside className="p-6 space-y-6">
      {/* Author Info */}
      <Card className="chyrp-glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>About</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/api/avatar/default" alt={author} />
              <AvatarFallback>{author.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{author}</h3>
              <p className="text-xs text-muted-foreground">Blog Author</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome to my blog where I share thoughts, ideas, and experiences.
          </p>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className="chyrp-glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Recent Posts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.slug}`}
                className="block group"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="chyrp-glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="h-4 w-4" />
            <span>Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="inline-block"
              >
                <Badge
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="chyrp-glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Tags</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                className="inline-block"
              >
                <Badge
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer text-xs"
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="chyrp-glass">
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full px-3 py-2 chyrp-input text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              aria-label="Search posts"
            />
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default ChyrpSidebar;
