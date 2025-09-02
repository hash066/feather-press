import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Quote, User, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';

const CreateQuote = () => {
  const navigate = useNavigate();

  const [quoteText, setQuoteText] = React.useState('');
  const [quoteAuthor, setQuoteAuthor] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleCreate = async () => {
    setMessage('');
    if (!quoteText.trim()) {
      setMessage('Please enter a quote');
      return;
    }
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      const createdBy = currentUser?.username;
      await apiClient.createQuote(quoteText, quoteAuthor || undefined, createdBy);
      setMessage('Quote created!');
      setQuoteText('');
      setQuoteAuthor('');
      navigate('/me');
    } catch (e) {
      setMessage('Failed to create quote');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Create New Quote</h1>
          <p className="text-muted-foreground">Share your inspirational thoughts and wisdom</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="w-5 h-5" />
              Quote Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="quote">Quote Text</Label>
              <Textarea
                id="quote"
                placeholder="Enter your inspirational quote here..."
                rows={4}
                className="w-full text-lg font-medium"
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <div className="flex gap-2">
                <Input
                  id="author"
                  placeholder="Who said this quote?"
                  className="flex-1"
                  value={quoteAuthor}
                  onChange={(e) => setQuoteAuthor(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Motivation, Life, Success, Love, etc."
                className="w-full"
              />
            </div>

            {/* Removed Source and Tags per request */}

            {/* Optional background removed */}

            <div className="flex gap-4 pt-4">
              {message && <div className="text-sm text-muted-foreground">{message}</div>}
              <Button className="flex-1" onClick={handleCreate}>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Quote
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateQuote;
