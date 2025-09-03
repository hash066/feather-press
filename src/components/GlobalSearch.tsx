import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { apiClient, Post, QuoteItem } from "@/lib/apiClient";
import { FileText, ImageIcon, PlayCircle, Quote } from "lucide-react";

type Video = Awaited<ReturnType<typeof apiClient.getVideos>>[number];
type Gallery = Awaited<ReturnType<typeof apiClient.getGalleries>>[number];

export interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(false);

  const prefetchAll = async () => {
    let cancelled = false;
    setLoading(true);
    try {
      const [p, q, v, g] = await Promise.all([
        apiClient.getPosts().catch(() => []),
        apiClient.getQuotes().catch(() => []),
        apiClient.getVideos().catch(() => []),
        apiClient.getGalleries().catch(() => []),
      ]);
      if (cancelled) return;
      setPosts(p);
      setQuotes(q);
      setVideos(v);
      setGalleries(g);
      console.debug('[GlobalSearch] loaded', { posts: p.length, quotes: q.length, videos: v.length, galleries: g.length });
    } finally {
      if (!cancelled) setLoading(false);
    }
    return () => { cancelled = true };
  };

  useEffect(() => {
    // Prefetch once on mount
    prefetchAll();
  }, []);

  useEffect(() => {
    if (!open) return;
    // Refresh when opened
    prefetchAll();
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const extractTags = (raw?: string): string[] => {
    if (!raw) return [];
    const s = raw.trim();
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map((x) => String(x).toLowerCase());
    } catch {}
    return s
      .split(/[,#\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  };

  const filtered = useMemo(() => {
    if (!normalizedQuery) {
      return {
        posts: posts.slice(0, 5),
        quotes: quotes.slice(0, 5),
        videos: videos.slice(0, 5),
        galleries: galleries.slice(0, 5),
      };
    }
    const includes = (s?: string) => (s || "").toLowerCase().includes(normalizedQuery);
    return {
      posts: posts.filter(p => {
        const tagTokens = extractTags(p.tags);
        return includes(p.title) || includes(p.content) || includes(p.author) || tagTokens.some(t => t.includes(normalizedQuery));
      }).slice(0, 10),
      quotes: quotes.filter(q => {
        const tagTokens = extractTags(q.tags);
        return includes(q.text) || includes(q.author) || includes(q.category) || tagTokens.some(t => t.includes(normalizedQuery));
      }).slice(0, 10),
      videos: videos.filter(v => {
        const tagTokens = extractTags(v.tags as any);
        return includes(v.title) || includes(v.description) || includes(v.created_by) || tagTokens.some(t => t.includes(normalizedQuery));
      }).slice(0, 10),
      galleries: galleries.filter(g => {
        const tagTokens = extractTags((g as any).tags);
        return includes(g.title) || includes(g.description) || includes(g.created_by) || tagTokens.some(t => t.includes(normalizedQuery));
      }).slice(0, 10),
    };
  }, [normalizedQuery, posts, quotes, videos, galleries]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search posts, photos, videos, quotes..." value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>{loading ? "Loading..." : "No results found."}</CommandEmpty>

        <CommandGroup heading="Posts">
          {filtered.posts.map((p) => (
            <CommandItem key={`post-${p.id}`} value={`post-${p.id}`} onSelect={() => { onOpenChange(false); navigate(`/posts/${p.id}`); }}>
              <FileText className="mr-2 h-4 w-4" />
              <span>{p.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quotes">
          {filtered.quotes.map((q) => (
            <CommandItem key={`quote-${q.id}`} value={`quote-${q.id}`} onSelect={() => { onOpenChange(false); navigate(`/quotes`); }}>
              <Quote className="mr-2 h-4 w-4" />
              <span>{q.text}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Videos">
          {filtered.videos.map((v) => (
            <CommandItem key={`video-${v.id}`} value={`video-${v.id}`} onSelect={() => { onOpenChange(false); navigate(`/videos`); }}>
              <PlayCircle className="mr-2 h-4 w-4" />
              <span>{v.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Galleries">
          {filtered.galleries.map((g) => (
            <CommandItem key={`gallery-${g.id}`} value={`gallery-${g.id}`} onSelect={() => { onOpenChange(false); navigate(`/gallery`); }}>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>{g.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default GlobalSearch;

