import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Index from '@/pages/Index'
import ChyrpBlog from '@/pages/ChyrpBlog'
import Me from '@/pages/Me'
import CreatePost from '@/pages/CreatePost'
import CreateGallery from '@/pages/CreateGallery'
import CreateVideo from '@/pages/CreateVideo'
import CreateQuote from '@/pages/CreateQuote'
import Login from '@/pages/Login'
import ProtectedRoute from '@/components/ProtectedRoute'
import Quotes from '@/pages/Quotes'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/blog" element={<ProtectedRoute><ChyrpBlog /></ProtectedRoute>} />
      <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
      <Route path="/me" element={<ProtectedRoute><Me /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/create-gallery" element={<ProtectedRoute><CreateGallery /></ProtectedRoute>} />
      <Route path="/create-video" element={<ProtectedRoute><CreateVideo /></ProtectedRoute>} />
      <Route path="/create-quote" element={<ProtectedRoute><CreateQuote /></ProtectedRoute>} />
      <Route path="*" element={<Index />} />
    </Routes>
  </BrowserRouter>
);
