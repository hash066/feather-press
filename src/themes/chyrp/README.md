# Chyrp Theme for Feather Press

A modern, accessible, and responsive blog theme inspired by the original Chyrp Lite platform, built with React, TypeScript, and Tailwind CSS.

## Features

### 🎨 Design & Accessibility
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation
- **Dark/Light Mode**: Automatic theme switching with system preference detection
- **Typography**: Optimized font stack with Inter and Playfair Display
- **Focus Management**: Clear focus indicators for keyboard navigation

### 📱 User Experience
- **Lazy Loading**: Images load progressively for better performance
- **Lightbox**: Full-screen image viewer with zoom, rotate, and navigation
- **Code Highlighting**: Syntax highlighting with copy-to-clipboard functionality
- **Search & Filtering**: Real-time search with category and tag filters
- **Infinite Scroll**: Smooth pagination for better content discovery

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **React Query**: Efficient data fetching and caching
- **Component Library**: Built with shadcn/ui components
- **Performance**: Optimized bundle size and loading times
- **SEO**: Meta tags, structured data, and semantic HTML

## Components

### Core Components
- `ChyrpTheme`: Main theme wrapper with context providers
- `ChyrpLayout`: Page layout with header, sidebar, and footer
- `ChyrpHeader`: Navigation header with search and theme toggle
- `ChyrpSidebar`: Sidebar with author info, categories, and recent posts
- `ChyrpFooter`: Footer with links and social media

### Content Components
- `ChyrpPostCard`: Post preview cards with multiple variants
- `ChyrpPostDetail`: Full post view with comments
- `ChyrpComments`: Comment system with threading
- `ChyrpLightbox`: Image lightbox with zoom and navigation
- `ChyrpCodeHighlighter`: Code blocks with syntax highlighting

## Usage

### Basic Setup
```tsx
import { ChyrpTheme } from '@/themes/chyrp/ChyrpTheme';

function App() {
  return (
    <ChyrpTheme
      siteTitle="My Blog"
      siteDescription="A modern blog platform"
      author="John Doe"
    >
      {/* Your routes and content */}
    </ChyrpTheme>
  );
}
```

### Using Post Cards
```tsx
import { ChyrpPostCard } from '@/themes/chyrp/ChyrpPostCard';

const post = {
  id: '1',
  title: 'My First Post',
  slug: 'my-first-post',
  content: 'Post content...',
  author: { name: 'John Doe' },
  createdAt: '2024-01-01',
  // ... other post data
};

<ChyrpPostCard post={post} variant="default" />
```

### Using Lightbox
```tsx
import { useLightbox } from '@/themes/chyrp/ChyrpLightbox';

const { openLightbox } = useLightbox();

const images = [
  { src: '/image1.jpg', alt: 'Image 1', caption: 'Beautiful sunset' },
  { src: '/image2.jpg', alt: 'Image 2', caption: 'Mountain view' }
];

// Open lightbox
openLightbox(images, 0);
```

## API Integration

The theme is designed to work with RESTful APIs. Update the API functions in your pages:

```tsx
// Example API functions
const fetchPosts = async () => {
  const response = await fetch('/api/posts');
  return response.json();
};

const fetchCategories = async () => {
  const response = await fetch('/api/categories');
  return response.json();
};

const fetchTags = async () => {
  const response = await fetch('/api/tags');
  return response.json();
};
```

## Customization

### Colors
The theme uses CSS custom properties for easy customization:

```css
:root {
  --primary: 220 26% 14%;
  --secondary: 220 13% 91%;
  --accent: 43 74% 66%;
  /* ... more color variables */
}
```

### Typography
Font families can be customized in the CSS:

```css
body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
}
```

### Layout
The layout is responsive and can be adjusted using Tailwind classes:

```tsx
<ChyrpLayout
  className="max-w-7xl mx-auto" // Custom max width
  sidebarWidth="w-96" // Custom sidebar width
>
  {/* Content */}
</ChyrpLayout>
```

## Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: High contrast ratios for better readability
- **Reduced Motion**: Respects user's motion preferences

## Performance Optimizations

- **Lazy Loading**: Images load only when needed
- **Code Splitting**: Components are loaded on demand
- **Caching**: React Query provides intelligent caching
- **Bundle Optimization**: Tree shaking and code splitting
- **Image Optimization**: Responsive images with proper sizing

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions, please open an issue on GitHub or contact the development team.
