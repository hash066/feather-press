# Lovable Integration for Chyrp Theme

This document explains how to use the Lovable integration features and convert React components to Twig templates for backend integration.

## 🎨 Lovable Theme Editor

The Chyrp theme includes a built-in Lovable-inspired theme editor that allows real-time customization of the theme.

### Features

- **Real-time Preview**: See changes instantly as you modify the theme
- **Preset Themes**: Choose from pre-built theme configurations
- **Color Customization**: Modify primary, secondary, accent, and background colors
- **Layout Settings**: Adjust sidebar width, max width, and spacing
- **Typography Options**: Change font family, size, and line height
- **Import/Export**: Save and load theme configurations

### Usage

```tsx
import { LovableIntegration } from '@/themes/chyrp/LovableIntegration';

const [themeConfig, setThemeConfig] = useState({
  theme: {
    primary: 'hsl(220, 26%, 14%)',
    secondary: 'hsl(220, 13%, 91%)',
    accent: 'hsl(43, 74%, 66%)',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(220, 26%, 14%)'
  },
  layout: {
    sidebarWidth: 'w-80',
    maxWidth: 'max-w-4xl',
    spacing: 'normal'
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: 'text-base',
    lineHeight: 'leading-normal'
  }
});

<LovableIntegration
  currentConfig={themeConfig}
  onConfigChange={setThemeConfig}
/>
```

### Accessing the Editor

The theme editor appears as a floating palette button in the bottom-right corner of the screen. Click it to open the editor panel.

## 🔄 Twig Template Conversion

The theme includes a utility to convert React components to Twig templates for use with PHP backends like the original Chyrp Lite.

### TwigConverter Utility

```tsx
import TwigConverter from '@/utils/twigConverter';

const converter = new TwigConverter();

// Convert React JSX to Twig
const jsx = `
<div className="post-card">
  <h2>{post.title}</h2>
  <p>{post.excerpt}</p>
  {post.tags && post.tags.map(tag => (
    <span key={tag.id}>{tag.name}</span>
  ))}
</div>
`;

const twigTemplate = converter.convertJSXToTwig(jsx, 'post-card.twig');
console.log(twigTemplate.content);
```

### Generated Twig Templates

The converter generates three main templates:

#### 1. Post List Template (`post-list.twig`)

```twig
{% extends "layout.twig" %}

{% block content %}
<div class="chyrp-blog">
  <div class="blog-header">
    <h1>{{ siteTitle }}</h1>
    <p>{{ siteDescription }}</p>
  </div>

  <div class="posts-grid">
    {% for post in posts %}
      <article class="post-card">
        {% if post.featuredImage %}
          <div class="post-image">
            <img src="{{ post.featuredImage }}" alt="{{ post.title }}" loading="lazy">
          </div>
        {% endif %}
        
        <div class="post-content">
          <h2 class="post-title">
            <a href="/post/{{ post.slug }}">{{ post.title }}</a>
          </h2>
          
          {% if post.excerpt %}
            <p class="post-excerpt">{{ post.excerpt }}</p>
          {% endif %}
          
          <div class="post-meta">
            <span class="author">{{ post.author.name }}</span>
            <span class="date">{{ post.createdAt|date('M j, Y') }}</span>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</div>
{% endblock %}
```

#### 2. Single Post Template (`single-post.twig`)

```twig
{% extends "layout.twig" %}

{% block content %}
<article class="chyrp-post">
  <div class="post-header">
    <a href="/blog" class="back-link">← Back to Blog</a>
    
    {% if post.featuredImage %}
      <div class="featured-image">
        <img src="{{ post.featuredImage }}" alt="{{ post.title }}" loading="lazy">
      </div>
    {% endif %}
    
    <h1 class="post-title">{{ post.title }}</h1>
    
    <div class="post-meta">
      <div class="author-info">
        <img src="{{ post.author.avatar }}" alt="{{ post.author.name }}" class="author-avatar">
        <span class="author-name">{{ post.author.name }}</span>
      </div>
      <span class="post-date">{{ post.createdAt|date('F j, Y') }}</span>
    </div>
  </div>
  
  <div class="post-content">
    {{ post.content|raw }}
  </div>
  
  {% include "comments.twig" with { postId: post.id } %}
</article>
{% endblock %}
```

#### 3. Comments Template (`comments.twig`)

```twig
<div class="comments-section">
  <h3>Comments ({{ comments|length }})</h3>
  
  <form class="comment-form" method="POST" action="/api/comments">
    <input type="hidden" name="postId" value="{{ postId }}">
    <textarea name="content" placeholder="Write a comment..." required></textarea>
    <button type="submit">Post Comment</button>
  </form>
  
  <div class="comments-list">
    {% for comment in comments %}
      {% if not comment.parentId %}
        <div class="comment" data-comment-id="{{ comment.id }}">
          <div class="comment-header">
            <img src="{{ comment.author.avatar }}" alt="{{ comment.author.name }}" class="comment-avatar">
            <span class="comment-author">{{ comment.author.name }}</span>
            <span class="comment-date">{{ comment.createdAt|date('M j, Y g:i A') }}</span>
          </div>
          
          <div class="comment-content">
            {{ comment.content|nl2br }}
          </div>
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>
```

### PHP Controller Integration

The converter also generates PHP controller examples:

```php
<?php
class BlogController {
    public function index() {
        $posts = Post::with(['author', 'category', 'tags'])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->paginate(12);
            
        $categories = Category::all();
        
        return view('post-list', [
            'posts' => $posts,
            'categories' => $categories,
            'siteTitle' => config('app.name'),
            'siteDescription' => config('app.description'),
            'searchQuery' => request('search', ''),
            'selectedCategory' => request('category', '')
        ]);
    }
    
    public function show($slug) {
        $post = Post::with(['author', 'category', 'tags'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();
            
        $comments = Comment::with(['author', 'replies'])
            ->where('post_id', $post->id)
            ->whereNull('parent_id')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return view('single-post', [
            'post' => $post,
            'comments' => $comments,
            'isLiked' => $this->checkIfLiked($post->id)
        ]);
    }
}
?>
```

## 🎯 Template Variables

### Post List Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `siteTitle` | string | Site title | "My Blog" |
| `siteDescription` | string | Site description | "A modern blog" |
| `searchQuery` | string | Current search query | "" |
| `categories` | array | List of categories | `[{id: 1, name: "Tech", slug: "tech"}]` |
| `selectedCategory` | string | Currently selected category | "tech" |
| `posts` | array | List of posts | `[{id: 1, title: "Post", ...}]` |

### Single Post Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `post` | object | Post data | `{id: 1, title: "Post", content: "...", ...}` |
| `isLiked` | boolean | Whether current user liked the post | `true` |

### Comments Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `postId` | string | Post ID | "123" |
| `comments` | array | List of comments | `[{id: 1, content: "...", ...}]` |

## 🔧 Conversion Rules

The TwigConverter follows these conversion rules:

### React to Twig Mappings

| React | Twig |
|-------|------|
| `{variable}` | `{{ variable }}` |
| `className=` | `class=` |
| `onClick={handler}` | `onclick="{{ handler }}"` |
| `{condition ? value1 : value2}` | `{% if condition %}{{ value1 }}{% else %}{{ value2 }}{% endif %}` |
| `{condition && value}` | `{% if condition %}{{ value }}{% endif %}` |
| `.map(item => <div>{item.name}</div>)` | `{% for item in items %}<div>{{ item.name }}</div>{% endfor %}` |

### Conditional Rendering

```jsx
// React
{post.featuredImage && (
  <img src={post.featuredImage} alt={post.title} />
)}

// Twig
{% if post.featuredImage %}
  <img src="{{ post.featuredImage }}" alt="{{ post.title }}">
{% endif %}
```

### Loops

```jsx
// React
{posts.map(post => (
  <div key={post.id}>{post.title}</div>
))}

// Twig
{% for post in posts %}
  <div>{{ post.title }}</div>
{% endfor %}
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Access the Theme Editor

- Navigate to the blog page
- Click the floating palette button in the bottom-right corner
- Customize your theme in real-time

### 4. Generate Twig Templates

```tsx
import TwigConverter from '@/utils/twigConverter';

const converter = new TwigConverter();

// Generate all templates
const postListTemplate = converter.generatePostListTemplate();
const singlePostTemplate = converter.generateSinglePostTemplate();
const commentsTemplate = converter.generateCommentsTemplate();

// Save templates to files
console.log(postListTemplate.content);
console.log(singlePostTemplate.content);
console.log(commentsTemplate.content);
```

## 📁 File Structure

```
src/
├── themes/
│   └── chyrp/
│       ├── ChyrpTheme.tsx
│       ├── ChyrpLayout.tsx
│       ├── ChyrpHeader.tsx
│       ├── ChyrpSidebar.tsx
│       ├── ChyrpFooter.tsx
│       ├── ChyrpPostCard.tsx
│       ├── ChyrpPostDetail.tsx
│       ├── ChyrpComments.tsx
│       ├── ChyrpLightbox.tsx
│       ├── ChyrpCodeHighlighter.tsx
│       ├── LovableIntegration.tsx
│       ├── chyrp-theme.css
│       ├── README.md
│       └── LOVABLE_INTEGRATION.md
├── utils/
│   └── twigConverter.ts
└── pages/
    ├── ChyrpBlog.tsx
    └── ChyrpPostDetail.tsx
```

## 🎨 Customization

### Adding New Preset Themes

```tsx
const presetThemes = {
  // ... existing themes
  custom: {
    primary: 'hsl(120, 50%, 50%)',
    secondary: 'hsl(120, 30%, 90%)',
    accent: 'hsl(60, 80%, 60%)',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(120, 20%, 20%)'
  }
};
```

### Extending the Converter

```tsx
class CustomTwigConverter extends TwigConverter {
  convertCustomComponent(jsx: string): string {
    // Add custom conversion logic
    return this.convertJSXToTwig(jsx, 'custom.twig').content;
  }
}
```

## 🔗 Integration with Backend

### Laravel Integration

1. Place Twig templates in `resources/views/`
2. Install Twig package: `composer require twig/twig`
3. Configure Twig in `config/view.php`
4. Use generated controllers

### WordPress Integration

1. Convert Twig templates to PHP templates
2. Use WordPress template hierarchy
3. Integrate with WordPress hooks and filters

### Custom PHP Backend

1. Use generated PHP controllers as reference
2. Adapt to your framework's conventions
3. Implement authentication and authorization

## 🐛 Troubleshooting

### Common Issues

1. **Template variables not found**: Ensure all variables are passed from the controller
2. **Styling issues**: Check that CSS classes match between React and Twig versions
3. **JavaScript errors**: Verify that event handlers are properly converted

### Debug Mode

Enable debug mode in the TwigConverter:

```tsx
const converter = new TwigConverter();
converter.debug = true; // Enable detailed logging
```

## 📚 Additional Resources

- [Twig Documentation](https://twig.symfony.com/)
- [Chyrp Lite Documentation](https://github.com/xenocrat/chyrp-lite)
- [React to Twig Conversion Guide](https://example.com)
- [Lovable Design System](https://lovable.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
