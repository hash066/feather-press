/**
 * Twig Template Converter
 * 
 * This utility helps convert React components to Twig templates
 * for use with PHP backends like the original Chyrp Lite.
 */

export interface TwigVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  example: any;
}

export interface TwigTemplate {
  name: string;
  content: string;
  variables: TwigVariable[];
  dependencies: string[];
}

export class TwigConverter {
  private variables: TwigVariable[] = [];
  private dependencies: string[] = [];

  /**
   * Convert React JSX to Twig template
   */
  convertJSXToTwig(jsx: string, templateName: string): TwigTemplate {
    this.variables = [];
    this.dependencies = [];

    let twigContent = jsx
      // Convert React props to Twig variables
      .replace(/\{([^}]+)\}/g, (match, content) => {
        if (content.includes('.')) {
          // Handle nested properties
          return `{{ ${content} }}`;
        }
        return `{{ ${content} }}`;
      })
      // Convert className to class
      .replace(/className=/g, 'class=')
      // Convert JSX self-closing tags
      .replace(/<([^>]+)\/>/g, '<$1></$1>')
      // Convert React event handlers to Twig
      .replace(/onClick=\{([^}]+)\}/g, 'onclick="{{ $1 }}"')
      .replace(/onChange=\{([^}]+)\}/g, 'onchange="{{ $1 }}"')
      // Convert conditional rendering
      .replace(/\{([^}]+)\s*\?\s*([^:]+)\s*:\s*([^}]+)\}/g, '{% if $1 %}{{ $2 }}{% else %}{{ $3 }}{% endif %}')
      .replace(/\{([^}]+)\s*&&\s*([^}]+)\}/g, '{% if $1 %}{{ $2 }}{% endif %}')
      // Convert map functions to Twig loops
      .replace(/\.map\(\(([^)]+)\)\s*=>\s*([^}]+)\)/g, '{% for $1 in items %}{{ $2 }}{% endfor %}')
      // Convert ternary operators in attributes
      .replace(/className=\{([^}]+)\s*\?\s*([^:]+)\s*:\s*([^}]+)\}/g, 'class="{% if $1 %}{{ $2 }}{% else %}{{ $3 }}{% endif %}"');

    // Extract variables from the template
    this.extractVariables(twigContent);

    return {
      name: templateName,
      content: twigContent,
      variables: this.variables,
      dependencies: this.dependencies
    };
  }

  /**
   * Extract Twig variables from template content
   */
  private extractVariables(content: string): void {
    const variableRegex = /\{\{\s*([^}]+)\s*\}\}/g;
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      const varName = match[1].trim();
      
      // Skip if already added
      if (this.variables.find(v => v.name === varName)) continue;

      // Determine variable type and add to list
      this.variables.push({
        name: varName,
        type: this.inferVariableType(varName),
        description: `Variable: ${varName}`,
        example: this.getExampleValue(varName)
      });
    }
  }

  /**
   * Infer variable type based on name
   */
  private inferVariableType(varName: string): TwigVariable['type'] {
    if (varName.includes('Count') || varName.includes('count')) return 'number';
    if (varName.includes('is') || varName.includes('has')) return 'boolean';
    if (varName.includes('s') && varName.endsWith('s')) return 'array';
    if (varName.includes('.')) return 'object';
    return 'string';
  }

  /**
   * Get example value for variable
   */
  private getExampleValue(varName: string): any {
    switch (this.inferVariableType(varName)) {
      case 'number':
        return 42;
      case 'boolean':
        return true;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return 'example';
    }
  }

  /**
   * Generate Twig template for post list
   */
  generatePostListTemplate(): TwigTemplate {
    const template = `
{% extends "layout.twig" %}

{% block content %}
<div class="chyrp-blog">
  <div class="blog-header">
    <h1>{{ siteTitle }}</h1>
    <p>{{ siteDescription }}</p>
  </div>

  <div class="search-filters">
    <input type="text" placeholder="Search posts..." value="{{ searchQuery }}" class="search-input">
    <select class="category-filter">
      <option value="">All Categories</option>
      {% for category in categories %}
        <option value="{{ category.slug }}" {% if selectedCategory == category.slug %}selected{% endif %}>
          {{ category.name }}
        </option>
      {% endfor %}
    </select>
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
          {% if post.category %}
            <span class="category-badge">{{ post.category.name }}</span>
          {% endif %}
          
          <h2 class="post-title">
            <a href="/post/{{ post.slug }}">{{ post.title }}</a>
          </h2>
          
          {% if post.excerpt %}
            <p class="post-excerpt">{{ post.excerpt }}</p>
          {% endif %}
          
          <div class="post-meta">
            <span class="author">{{ post.author.name }}</span>
            <span class="date">{{ post.createdAt|date('M j, Y') }}</span>
            <span class="read-time">{{ post.readTime }} min read</span>
          </div>
          
          {% if post.tags %}
            <div class="post-tags">
              {% for tag in post.tags %}
                <a href="/tag/{{ tag.slug }}" class="tag">{{ tag.name }}</a>
              {% endfor %}
            </div>
          {% endif %}
        </div>
      </article>
    {% endfor %}
  </div>

  {% if posts|length == 0 %}
    <div class="no-posts">
      <p>No posts found.</p>
    </div>
  {% endif %}
</div>
{% endblock %}
    `;

    return {
      name: 'post-list.twig',
      content: template,
      variables: [
        { name: 'siteTitle', type: 'string', description: 'Site title', example: 'My Blog' },
        { name: 'siteDescription', type: 'string', description: 'Site description', example: 'A modern blog' },
        { name: 'searchQuery', type: 'string', description: 'Current search query', example: '' },
        { name: 'categories', type: 'array', description: 'List of categories', example: [] },
        { name: 'selectedCategory', type: 'string', description: 'Currently selected category', example: '' },
        { name: 'posts', type: 'array', description: 'List of posts', example: [] }
      ],
      dependencies: ['layout.twig']
    };
  }

  /**
   * Generate Twig template for single post
   */
  generateSinglePostTemplate(): TwigTemplate {
    const template = `
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
    
    {% if post.category %}
      <a href="/category/{{ post.category.slug }}" class="category-badge">
        {{ post.category.name }}
      </a>
    {% endif %}
    
    <h1 class="post-title">{{ post.title }}</h1>
    
    {% if post.excerpt %}
      <p class="post-excerpt">{{ post.excerpt }}</p>
    {% endif %}
    
    <div class="post-meta">
      <div class="author-info">
        <img src="{{ post.author.avatar }}" alt="{{ post.author.name }}" class="author-avatar">
        <span class="author-name">{{ post.author.name }}</span>
      </div>
      <span class="post-date">{{ post.createdAt|date('F j, Y') }}</span>
      <span class="read-time">{{ post.readTime }} min read</span>
      {% if post.viewCount %}
        <span class="view-count">{{ post.viewCount }} views</span>
      {% endif %}
    </div>
    
    <div class="post-actions">
      <button class="like-button {% if isLiked %}liked{% endif %}" data-post-id="{{ post.id }}">
        ♥ {{ post.likeCount }}
      </button>
      <button class="share-button" onclick="sharePost()">Share</button>
    </div>
  </div>
  
  <div class="post-content">
    {{ post.content|raw }}
  </div>
  
  {% if post.tags %}
    <div class="post-tags">
      <h3>Tags:</h3>
      {% for tag in post.tags %}
        <a href="/tag/{{ tag.slug }}" class="tag">{{ tag.name }}</a>
      {% endfor %}
    </div>
  {% endif %}
  
  {% if post.author.bio %}
    <div class="author-bio">
      <h3>About the Author</h3>
      <div class="author-info">
        <img src="{{ post.author.avatar }}" alt="{{ post.author.name }}" class="author-avatar">
        <div>
          <h4>{{ post.author.name }}</h4>
          <p>{{ post.author.bio }}</p>
        </div>
      </div>
    </div>
  {% endif %}
  
  {% include "comments.twig" with { postId: post.id } %}
</article>
{% endblock %}
    `;

    return {
      name: 'single-post.twig',
      content: template,
      variables: [
        { name: 'post', type: 'object', description: 'Post data', example: {} },
        { name: 'isLiked', type: 'boolean', description: 'Whether current user liked the post', example: false }
      ],
      dependencies: ['layout.twig', 'comments.twig']
    };
  }

  /**
   * Generate Twig template for comments
   */
  generateCommentsTemplate(): TwigTemplate {
    const template = `
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
            {% if comment.isEdited %}
              <span class="edited-badge">edited</span>
            {% endif %}
          </div>
          
          <div class="comment-content">
            {{ comment.content|nl2br }}
          </div>
          
          <div class="comment-actions">
            <button class="reply-button" onclick="showReplyForm('{{ comment.id }}')">Reply</button>
            {% if comment.canEdit %}
              <button class="edit-button" onclick="editComment('{{ comment.id }}')">Edit</button>
              <button class="delete-button" onclick="deleteComment('{{ comment.id }}')">Delete</button>
            {% endif %}
          </div>
          
          <div class="reply-form" id="reply-form-{{ comment.id }}" style="display: none;">
            <form method="POST" action="/api/comments">
              <input type="hidden" name="postId" value="{{ postId }}">
              <input type="hidden" name="parentId" value="{{ comment.id }}">
              <textarea name="content" placeholder="Reply to {{ comment.author.name }}..." required></textarea>
              <button type="submit">Reply</button>
              <button type="button" onclick="hideReplyForm('{{ comment.id }}')">Cancel</button>
            </form>
          </div>
          
          {% if comment.replies %}
            <div class="comment-replies">
              {% for reply in comment.replies %}
                <div class="comment reply" data-comment-id="{{ reply.id }}">
                  <div class="comment-header">
                    <img src="{{ reply.author.avatar }}" alt="{{ reply.author.name }}" class="comment-avatar">
                    <span class="comment-author">{{ reply.author.name }}</span>
                    <span class="comment-date">{{ reply.createdAt|date('M j, Y g:i A') }}</span>
                  </div>
                  
                  <div class="comment-content">
                    {{ reply.content|nl2br }}
                  </div>
                </div>
              {% endfor %}
            </div>
          {% endif %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
  
  {% if comments|length == 0 %}
    <div class="no-comments">
      <p>No comments yet. Be the first to comment!</p>
    </div>
  {% endif %}
</div>

<script>
function showReplyForm(commentId) {
  document.getElementById('reply-form-' + commentId).style.display = 'block';
}

function hideReplyForm(commentId) {
  document.getElementById('reply-form-' + commentId).style.display = 'none';
}

function editComment(commentId) {
  // Implementation for editing comments
}

function deleteComment(commentId) {
  if (confirm('Are you sure you want to delete this comment?')) {
    fetch('/api/comments/' + commentId, { method: 'DELETE' })
      .then(() => window.location.reload());
  }
}

function sharePost() {
  if (navigator.share) {
    navigator.share({
      title: '{{ post.title }}',
      text: '{{ post.excerpt }}',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
}
</script>
    `;

    return {
      name: 'comments.twig',
      content: template,
      variables: [
        { name: 'postId', type: 'string', description: 'Post ID', example: '123' },
        { name: 'comments', type: 'array', description: 'List of comments', example: [] }
      ],
      dependencies: []
    };
  }

  /**
   * Generate PHP controller example
   */
  generatePHPController(): string {
    return `<?php
/**
 * Chyrp Lite Controller Example
 * Generated from React components
 */

class BlogController {
    public function index() {
        $posts = Post::with(['author', 'category', 'tags'])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->paginate(12);
            
        $categories = Category::all();
        $tags = Tag::all();
        
        return view('post-list', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
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
            
        $isLiked = auth()->check() ? 
            Like::where('user_id', auth()->id())
                ->where('post_id', $post->id)
                ->exists() : false;
                
        return view('single-post', [
            'post' => $post,
            'comments' => $comments,
            'isLiked' => $isLiked
        ]);
    }
    
    public function storeComment(Request $request) {
        $validated = $request->validate([
            'postId' => 'required|exists:posts,id',
            'content' => 'required|string|max:1000',
            'parentId' => 'nullable|exists:comments,id'
        ]);
        
        $comment = Comment::create([
            'post_id' => $validated['postId'],
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'parent_id' => $validated['parentId'] ?? null
        ]);
        
        return redirect()->back()->with('success', 'Comment posted successfully!');
    }
}
?>`;
  }
}

export default TwigConverter;
