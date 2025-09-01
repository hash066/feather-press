import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import CreatePost from "./pages/CreatePost";
import ChyrpBlog from "./pages/ChyrpBlog";
import ChyrpPostDetail from "./pages/ChyrpPostDetail";
import PhotoGallery from "./pages/PhotoGallery";
import TestSupabase from "./pages/TestSupabase";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/blog" element={<ChyrpBlog />} />
            <Route path="/post/:slug" element={<ChyrpPostDetail />} />
            <Route path="/gallery" element={<PhotoGallery />} />
            <Route path="/test-supabase" element={<TestSupabase />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
