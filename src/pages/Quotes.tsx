import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { apiClient, QuoteItem } from '@/lib/apiClient';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const items = await apiClient.getQuotes();
        setQuotes(items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Quotes</h1>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="space-y-4">
            {quotes.map(q => (
              <Card key={q.id} className="border border-border">
                <CardContent className="py-6">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 mt-1 opacity-60" />
                    <div>
                      <p className="text-lg">{q.text}</p>
                      <div className="text-sm text-muted-foreground mt-2">— {q.author || 'Unknown'}</div>
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


