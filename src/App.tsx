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
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/blog" element={<ProtectedRoute><ChyrpBlog /></ProtectedRoute>} />
            <Route path="/post/:slug" element={<ProtectedRoute><ChyrpPostDetail /></ProtectedRoute>} />
            <Route path="/gallery" element={<ProtectedRoute><PhotoGallery /></ProtectedRoute>} />
            <Route path="/test-supabase" element={<ProtectedRoute><TestSupabase /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
