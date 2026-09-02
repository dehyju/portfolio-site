export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  pinned: boolean;
  published_at: string;
  reading_time_minutes: number;
  tags: string[];
  created_at: string;
  cover_image_url: string | null;
};

// Uploads an image to the public 'blog-images' storage bucket and returns its public URL
export async function uploadBlogImage(file: File): Promise<string> {
  const { supabase } = await import('@/utils/supabase');

  const ext = file.name.split('.').pop() || 'png';
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from('blog-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const { supabase } = await import('@/utils/supabase');
  
  try {
    const query = supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Failed to fetch blog posts:', error);
      return [];
    }
    
    // Sort pinned posts to the top, then by published date
    const sorted = (data || []).sort((a, b) => {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1;
    });
    
    return limit ? sorted.slice(0, limit) : sorted;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

// Get all blog posts including drafts (for admin)
export async function getAllBlogPosts(limit?: number): Promise<BlogPost[]> {
  const { supabase } = await import('@/utils/supabase');
  
  try {
    const query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Failed to fetch blog posts:', error);
      return [];
    }
    
    // Sort pinned posts to the top, then by created date
    const sorted = (data || []).sort((a, b) => {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1;
    });
    
    return limit ? sorted.slice(0, limit) : sorted;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { supabase } = await import('@/utils/supabase');
  
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Failed to fetch blog post:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

// Admin functions for creating/updating/deleting posts
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at'>): Promise<{ data: BlogPost | null; error: Error | null }> {
  const { supabase } = await import('@/utils/supabase');
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();
  
  return { data, error };
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<{ data: BlogPost | null; error: Error | null }> {
  const { supabase } = await import('@/utils/supabase');
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteBlogPost(id: string): Promise<{ error: Error | null }> {
  const { supabase } = await import('@/utils/supabase');
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  
  return { error };
}
