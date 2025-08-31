import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ChyrpLightboxProps {
  images?: LightboxImage[];
  initialIndex?: number;
}

export const ChyrpLightbox: React.FC<ChyrpLightboxProps> = ({
  images = [],
  initialIndex = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
        zoomOut();
        break;
      case 'r':
        resetTransform();
        break;
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    resetTransform();
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    resetTransform();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    resetTransform();
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.1));
  };

  const resetTransform = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const rotateImage = () => {
    setRotation((prev) => prev + 90);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={closeLightbox}
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Image Container */}
      <div
        className="relative flex-1 flex items-center justify-center p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default' }}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          draggable={false}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/50 rounded-lg p-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={zoomOut}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-white text-sm min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={zoomIn}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={rotateImage}
          aria-label="Rotate image"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={resetTransform}
          aria-label="Reset image"
        >
          Reset
        </Button>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Caption */}
      {currentImage.caption && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white text-center max-w-md px-4">
          <p className="text-sm bg-black/50 rounded px-3 py-2">
            {currentImage.caption}
          </p>
        </div>
      )}
    </div>
  );
};

// Export a hook for easy usage
export const useLightbox = () => {
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [] as LightboxImage[],
    initialIndex: 0,
  });

  const openLightbox = (images: LightboxImage[], index = 0) => {
    setLightboxState({ isOpen: true, images, initialIndex: index });
  };

  const closeLightbox = () => {
    setLightboxState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    lightboxState,
    openLightbox,
    closeLightbox,
  };
};

export default ChyrpLightbox;
