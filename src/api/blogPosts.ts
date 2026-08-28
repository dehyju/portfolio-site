export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  pinned: boolean;
  published_at: string;
  view_count: number;
  reading_time_minutes: number;
  tags: string[];
  created_at: string;
};

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

export async function incrementViewCount(slug: string): Promise<void> {
  const { supabase } = await import('@/utils/supabase');
  
  try {
    await supabase.rpc('increment_blog_view_count', { post_slug: slug });
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
}

// Admin functions for creating/updating/deleting posts
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'view_count'>): Promise<{ data: BlogPost | null; error: Error | null }> {
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
