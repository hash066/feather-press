import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Reply, 
  MoreHorizontal, 
  Flag, 
  Edit, 
  Trash2,
  Send,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: Comment[];
  isEdited?: boolean;
  isModerated?: boolean;
}

interface ChyrpCommentsProps {
  postId: string;
}

// Mock API functions - replace with your actual API
const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await fetch(`/api/comments/post/${postId}`);
  return response.json();
};

const createComment = async ({ postId, content, parentId }: {
  postId: string;
  content: string;
  parentId?: string;
}): Promise<Comment> => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId, content, parentId }),
  });
  return response.json();
};

const updateComment = async ({ commentId, content }: {
  commentId: string;
  content: string;
}): Promise<Comment> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  return response.json();
};

const deleteComment = async (commentId: string): Promise<void> => {
  await fetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
};

export const ChyrpComments: React.FC<ChyrpCommentsProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
      setReplyingTo(null);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setEditingComment(null);
      setEditContent('');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      postId,
      content: newComment,
      parentId: replyingTo || undefined,
    });
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editContent.trim()) return;

    updateCommentMutation.mutate({
      commentId,
      content: editContent,
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderComment = (comment: Comment, level = 0) => (
    <div key={comment.id} className={`${level > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <div className="flex items-start space-x-3 mb-4">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <Badge variant="outline" className="text-xs">
                edited
              </Badge>
            )}
            {comment.isModerated && (
              <Badge variant="destructive" className="text-xs">
                moderated
              </Badge>
            )}
          </div>
          
          {editingComment === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit your comment..."
                className="min-h-[80px]"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateComment(comment.id)}
                  disabled={updateCommentMutation.isPending}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Update
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed">{comment.content}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setEditingComment(comment.id)}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-3 w-3 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Reply Form */}
      {replyingTo === comment.id && (
        <form onSubmit={handleSubmitComment} className="mb-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Reply to ${comment.author.name}...`}
            className="mb-2"
          />
          <div className="flex space-x-2">
            <Button
              type="submit"
              size="sm"
              disabled={createCommentMutation.isPending}
            >
              <Send className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => renderComment(reply, level + 1))}
        </div>
      )}
    </div>
  );

  const topLevelComments = comments.filter(comment => !comment.parentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* New Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[100px]"
                disabled={createCommentMutation.isPending}
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  disabled={!newComment.trim() || createCommentMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>

        <Separator />

        {/* Comments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : topLevelComments.length > 0 ? (
          <div className="space-y-6">
            {topLevelComments.map(renderComment)}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChyrpComments;
