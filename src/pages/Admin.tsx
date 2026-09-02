import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { uploadBlogImage, type BlogPost } from '@/api/blogPosts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaEye, FaImage, FaTimes } from 'react-icons/fa';
import { BsPinAngleFill } from 'react-icons/bs';

const Admin = () => {
  const { signOut, user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-calculate reading time (average 200 words per minute)
  const calculateReadingTime = (text: string): number => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  };

  const readingTime = calculateReadingTime(content);
  const pinnedCount = posts.filter(p => p.pinned && p.id !== editingPost?.id).length;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setTags('');
    setPublished(false);
    setPinned(false);
    setEditingPost(null);
    setShowPreview(false);
    setCoverImageUrl(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt);
    setTags(post.tags.join(', '));
    setPublished(post.published);
    setPinned(post.pinned || false);
    setShowEditor(true);
    setShowPreview(false);
    setCoverImageUrl(post.cover_image_url ?? null);
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadBlogImage(file);
      setCoverImageUrl(url);
    } catch (error) {
      console.error('Failed to upload cover image:', error);
      alert('Failed to upload cover image. Check console for details.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadingInline(true);
    try {
      const url = await uploadBlogImage(file);
      const markdown = `![${file.name.replace(/\.[^.]+$/, '')}](${url})`;
      const textarea = contentTextareaRef.current;

      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const next = content.slice(0, start) + markdown + content.slice(end);
        setContent(next);
        // Restore cursor position after the inserted markdown
        requestAnimationFrame(() => {
          textarea.focus();
          textarea.setSelectionRange(start + markdown.length, start + markdown.length);
        });
      } else {
        setContent((prev) => `${prev}\n${markdown}\n`);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Check console for details.');
    } finally {
      setUploadingInline(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate pinned count
    if (pinned && pinnedCount >= 3) {
      alert('Cannot pin more than 3 posts. Please unpin another post first.');
      return;
    }
    
    setSaving(true);

    const postData = {
      title,
      slug,
      content,
      excerpt,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      published,
      pinned,
      reading_time_minutes: readingTime,
      published_at: published ? new Date().toISOString() : null,
      cover_image_url: coverImageUrl,
    };

    try {
      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
      }

      await fetchPosts();
      resetForm();
      setShowEditor(false);
    } catch (error: unknown) {
      console.error('Error saving post:', error);
      alert(error instanceof Error ? error.message : 'Failed to save post. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchPosts();
    }
  };

  const generateSlug = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(slug);
  };

  return (
    <div className="flex flex-col text-white bg-gray-900 min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome, {user?.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={signOut}
              className="border-red-700 text-red-400 hover:bg-red-950/30"
            >
              Sign Out
            </Button>
          </div>

          {/* Editor Toggle */}
          {!showEditor && (
            <Button
              onClick={() => setShowEditor(true)}
              className="mb-6"
              size="lg"
            >
              + Create New Post
            </Button>
          )}

          {/* Post Editor */}
          {showEditor && (
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={showPreview ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                      className={!showPreview ? "border-gray-600 text-gray-300" : ""}
                    >
                      <FaEye className="mr-2" />
                      {showPreview ? 'Hide' : 'Show'} Preview
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowEditor(false);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Title *</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="My Amazing Post"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center justify-between">
                        <span>Slug *</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={generateSlug}
                          className="text-xs text-blue-400 hover:text-blue-300 h-auto py-1"
                        >
                          Auto-generate
                        </Button>
                      </label>
                      <Input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="my-amazing-post"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Excerpt *</label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      required
                      rows={2}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm resize-none"
                      placeholder="A brief description of the post..."
                    />
                  </div>

                  <div className="flex-col items-center space-y-2">
                    {coverImageUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={coverImageUrl}
                          alt="Cover preview"
                          className="h-40 w-auto rounded-md border border-gray-600 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setCoverImageUrl(null)}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-1.5 text-white"
                          aria-label="Remove cover image"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 w-fit px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-600 cursor-pointer">
                        <FaImage />
                        {uploadingCover ? 'Uploading...' : 'Upload cover image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          disabled={uploadingCover}
                          className="hidden"
                        />
                      </label>
                    )}
                    <p className="text-sm font-medium text-gray-300">Cover Image (thumbnail)</p>
                  </div>

                  {/* Content Editor with Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-300">Content (Markdown) *</label>
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-xs text-gray-300 hover:bg-gray-600 cursor-pointer">
                        <FaImage />
                        {uploadingInline ? 'Uploading...' : 'Insert image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleInlineImageUpload}
                          disabled={uploadingInline}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                      <div>
                        <textarea
                          ref={contentTextareaRef}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          required
                          rows={16}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white font-mono text-sm resize-none"
                          placeholder="# Heading&#10;&#10;Your content here..."
                        />
                      </div>
                      {showPreview && (
                        <div className="bg-gray-700 border border-gray-600 rounded-md p-4 overflow-auto max-h-[400px]">
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                img: ({ ...props }) => (
                                  // eslint-disable-next-line jsx-a11y/alt-text
                                  <img {...props} loading="lazy" className="max-w-full h-auto rounded-md my-4" />
                                ),
                              }}
                            >
                              {content || '*No content to preview*'}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Tags (comma-separated)
                    </label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="react, typescript, web-dev"
                    />
                  </div>

                  {/* Stats and Options */}
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md">
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="published"
                          checked={published}
                          onChange={(e) => setPublished(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600"
                        />
                        <label htmlFor="published" className="text-sm text-gray-300 cursor-pointer">
                          Published
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="pinned"
                          checked={pinned}
                          onChange={(e) => setPinned(e.target.checked)}
                          disabled={!pinned && pinnedCount >= 3}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-yellow-600 disabled:opacity-50"
                        />
                        <label 
                          htmlFor="pinned" 
                          className={`text-sm cursor-pointer flex items-center gap-1 ${
                            !pinned && pinnedCount >= 3 ? 'text-gray-500' : 'text-gray-300'
                          }`}
                        >
                          <BsPinAngleFill className="text-yellow-500 w-4 h-4" />
                          Pin to top
                          {!pinned && pinnedCount >= 3 && (
                            <span className="text-xs text-red-400">(Max 3 reached)</span>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      ≈ {readingTime} min read • {content.trim().split(/\s+/).length} words
                    </div>
                  </div>

                  <Button type="submit" disabled={saving} className="w-full" size="lg">
                    {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">All Posts ({posts.length})</h2>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-400">No posts yet. Create your first one!</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Card key={post.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                            {post.pinned && (
                              <BsPinAngleFill className="text-yellow-500 w-5 h-5" title="Pinned" />
                            )}
                            {post.published ? (
                              <Badge className="bg-green-900 text-green-200">Published</Badge>
                            ) : (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                          <p className="text-xs text-gray-500">
                            Slug: {post.slug} • {post.reading_time_minutes} min read
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(post)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                            className="border-red-700 text-red-400 hover:bg-red-950/30"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
