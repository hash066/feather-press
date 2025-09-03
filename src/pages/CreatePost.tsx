import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, FileText, Plus, Search, Feather } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import AITitleSuggestions from "@/components/AITitleSuggestions";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage("Please fill in both title and content fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      const fallbackAuthor = currentUser?.username;
      const author = formData.author?.trim() || fallbackAuthor;
      await apiClient.createPost(formData.title, formData.content, undefined, author);
      setMessage("Post created successfully!");
      setFormData({ title: "", content: "", author: "" });
      // Navigate to home page after successful creation
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Create post error:", error);
      setMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    console.log("Previewing post:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Feather className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-content-primary">Feather Blog</span>
              </div>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-content-secondary hover:text-content-primary transition-colors">
                Home
              </a>
              <a href="/categories" className="text-content-secondary hover:text-content-primary transition-colors">
                Categories
              </a>
              <a href="/about" className="text-content-secondary hover:text-content-primary transition-colors">
                About
              </a>
            </div>

            {/* Right - Search and Write Button */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-content-subtle" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10 w-64 bg-background border-border"
                />
              </div>
              
              {/* Write Button */}
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" />
                Write
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left - Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-content-secondary hover:text-content-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {/* Center - Page Title */}
            <h1 className="text-3xl font-bold text-content-primary">
              Create New Post
            </h1>

            {/* Right - Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-content-primary">
              Post Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.includes("successfully") 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Title Field */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-content-primary">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter your post title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* AI Title Suggestions */}
              <AITitleSuggestions
                content={formData.content}
                onSelectTitle={(title) => handleInputChange("title", title)}
                className="mt-4"
              />
            </div>
            {/* Author Field */}
            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium text-content-primary">
                Author (defaults to logged-in username)
              </label>
              <Input
                id="author"
                placeholder="Enter author username (optional)"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-content-primary">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Write your post content here... (Supports Markdown)"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="w-full min-h-[400px] resize-y"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
