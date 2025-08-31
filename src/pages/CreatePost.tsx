import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log("Publishing post:", formData);
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Previewing post:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
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
            <h1 className="text-2xl font-bold text-content-primary">
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
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="w-4 h-4" />
                Publish
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
            {/* Title Field */}
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

            {/* Excerpt Field */}
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium text-content-primary">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                placeholder="Write a brief description of your post..."
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                className="w-full min-h-[100px] resize-none"
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
                className="w-full min-h-[400px] resize-none"
              />
              <p className="text-xs text-content-subtle">
                (Supports Markdown)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
