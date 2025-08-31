import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Search, Grid3X3, List, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock photo data
const mockPhotos = [
  {
    id: 1,
    title: "Sunset at the Beach",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Beautiful sunset over the ocean",
    uploadedAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Mountain Landscape",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Snow-capped mountains in the distance",
    uploadedAt: "2024-01-14"
  },
  {
    id: 3,
    title: "City Skyline",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Modern city architecture",
    uploadedAt: "2024-01-13"
  },
  {
    id: 4,
    title: "Forest Path",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Peaceful forest trail",
    uploadedAt: "2024-01-12"
  },
  {
    id: 5,
    title: "Flower Garden",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Colorful spring flowers",
    uploadedAt: "2024-01-11"
  },
  {
    id: 6,
    title: "Desert Dunes",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Golden sand dunes",
    uploadedAt: "2024-01-10"
  }
];

const PhotoGallery = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [photos] = useState(mockPhotos);

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    // TODO: Implement file upload functionality
    console.log("Upload photo");
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
              Photo Gallery
            </h1>

            {/* Right - Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleUpload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-subtle w-4 h-4" />
            <Input
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Photos Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-content-primary mb-1">{photo.title}</h3>
                  <p className="text-sm text-content-subtle mb-2">{photo.description}</p>
                  <p className="text-xs text-content-subtle">{photo.uploadedAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="flex hover:shadow-lg transition-shadow duration-300">
                <div className="w-32 h-32 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <h3 className="font-semibold text-content-primary mb-1">{photo.title}</h3>
                  <p className="text-sm text-content-subtle mb-2">{photo.description}</p>
                  <p className="text-xs text-content-subtle">{photo.uploadedAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-content-subtle">No photos found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
