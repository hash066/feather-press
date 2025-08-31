import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChyrpTheme } from "@/themes/chyrp/ChyrpTheme";
import Index from "./pages/Index";
import ChyrpBlog from "./pages/ChyrpBlog";
import ChyrpPostDetail from "./pages/ChyrpPostDetail";
import CreatePost from "./pages/CreatePost";
import PhotoGallery from "./pages/PhotoGallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Mock data for the theme
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-react-typescript',
    excerpt: 'Learn how to build modern web applications with React and TypeScript.',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'The Future of Web Development in 2024',
    slug: 'future-web-development-2024',
    excerpt: 'Explore the latest trends and technologies that will shape web development.',
    createdAt: '2024-01-14T15:30:00Z',
  },
  {
    id: '3',
    title: 'Building Scalable APIs with Node.js',
    slug: 'building-scalable-apis-nodejs',
    excerpt: 'A deep dive into building robust and scalable APIs using Node.js.',
    createdAt: '2024-01-13T09:15:00Z',
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ChyrpTheme
          siteTitle="Chyrp Lite Modern"
          siteDescription="A modern blog platform built with React and TypeScript"
          author="Admin"
          posts={mockPosts}
          categories={mockCategories}
          tags={mockTags}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<ChyrpBlog />} />
            <Route path="/post/:slug" element={<ChyrpPostDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/gallery" element={<PhotoGallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ChyrpTheme>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
