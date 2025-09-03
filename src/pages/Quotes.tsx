import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { apiClient, QuoteItem } from '@/lib/apiClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, Heart, MessageCircle, Share2 } from 'lucide-react';

interface Comment {
  id: number;
  
  content_type: string;
  content_id: number;
  author?: string;
  text: string;
  created_at: string;
}

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const items = await apiClient.getQuotes();
        setQuotes(items);
        
        // Load comments for each quote
        const commentsData: Record<number, Comment[]> = {};
        for (const quote of items) {
          try {
            const quoteComments = await apiClient.getComments('quotes', quote.id);
            commentsData[quote.id] = quoteComments;
          } catch (error) {
            console.error(`Failed to load comments for quote ${quote.id}:`, error);
            commentsData[quote.id] = [];
          }
        }
        setComments(commentsData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLike = async (quote: QuoteItem) => {
    try {
      const quoteId = quote.id.toString();
      if (likedQuotes.has(quoteId)) {
        await apiClient.unlikeQuote(quote.id);
        setLikedQuotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(quoteId);
          return newSet;
        });
      } else {
        await apiClient.likeQuote(quote.id);
        setLikedQuotes(prev => new Set(prev).add(quoteId));
      }
      
      // Refresh quotes to get updated like count
      const updatedQuotes = await apiClient.getQuotes();
      setQuotes(updatedQuotes);
    } catch (error) {
      console.error('Failed to like/unlike quote:', error);
    }
  };

  const toggleComments = (quoteId: number) => {
    setShowComments(prev => ({
      ...prev,
      [quoteId]: !prev[quoteId]
    }));
  };

  const handleAddComment = async (quoteId: number) => {
    const commentText = newComment[quoteId]?.trim();
    if (!commentText) return;

    try {
      await apiClient.addComment('quotes', quoteId, commentText, currentUser?.username);
      setNewComment(prev => ({ ...prev, [quoteId]: '' }));
      
      // Refresh comments
      const updatedComments = await apiClient.getComments('quotes', quoteId);
      setComments(prev => ({
        ...prev,
        [quoteId]: updatedComments
      }));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleShare = (quote: QuoteItem) => {
    const text = `"${quote.text}" - ${quote.author || 'Unknown'}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Quotes</h1>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="space-y-6">
            {quotes.map(quote => (
              <Card key={quote.id} className="border border-border">
                <CardContent className="py-6">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 mt-1 opacity-60" />
                    <div className="flex-1">
                      <p className="text-lg">{quote.text}</p>
                      <div className="text-sm text-muted-foreground mt-2">— {quote.author || 'Unknown'}</div>
                      
                      {/* Interaction buttons */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4 text-sm text-content-secondary">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{quote.likes ?? 0}</span>
                          </div>
                          <button className="flex items-center space-x-1" onClick={() => toggleComments(quote.id)}>
                            <MessageCircle className="w-4 h-4" />
                            <span>{(comments[quote.id]?.length ?? 0)}</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(quote)}
                            className={`h-8 w-8 p-0 ${likedQuotes.has(quote.id.toString()) ? 'text-brand-accent' : ''}`}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(quote)}
                            className="h-8 w-8 p-0"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Comments section */}
                      {showComments[quote.id] && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="font-medium mb-3">Comments</h4>
                          
                          {/* Add comment form */}
                          <div className="flex gap-2 mb-4">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={newComment[quote.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [quote.id]: e.target.value }))}
                              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleAddComment(quote.id)}
                              disabled={!newComment[quote.id]?.trim()}
                            >
                              Comment
                            </Button>
                          </div>
                          
                          {/* Comments list */}
                          <div className="space-y-3">
                            {comments[quote.id]?.map(comment => (
                              <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                                <div className="text-sm text-muted-foreground mb-1">
                                  {comment.author || 'Anonymous'} • {new Date(comment.created_at).toLocaleDateString()}
                                </div>
                                <div className="text-foreground">{comment.text}</div>
                              </div>
                            ))}
                            {(!comments[quote.id] || comments[quote.id].length === 0) && (
                              <div className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {quotes.length === 0 && <div className="text-muted-foreground">No quotes yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;


