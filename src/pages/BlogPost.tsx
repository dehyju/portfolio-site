import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogPostBySlug, type BlogPost as BlogPostType } from "@/api/blogPosts";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { FaClock, FaCalendar, FaArrowLeft, FaFileAlt } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const blogPost = await getBlogPostBySlug(slug);
        
        if (!blogPost) {
          setNotFound(true);
        } else {
          // If post is not published and user is not authenticated, show 404
          if (!blogPost.published && !user) {
            setNotFound(true);
          } else {
            setPost(blogPost);
          }
        }
      } catch (error) {
        console.error("Failed to load blog post:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col text-white bg-gray-900 min-h-screen">
        <Navbar />
        <main className="flex-1 pt-24 pb-20 px-4 flex items-center justify-center">
          <Spinner size={48} />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col text-white bg-gray-900 min-h-screen">
        <Navbar />
        <main className="flex-1 pt-24 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog" className="text-blue-400 hover:text-blue-300">
              <FaArrowLeft className="inline mr-2" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white bg-gray-900 min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <article className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link 
            to="/blog" 
            className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-2"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>

          {/* Draft badge for admin */}
          {!post.published && user && (
            <div className="mb-4">
              <Badge variant="secondary" className="bg-yellow-600 text-white text-lg px-4 py-2">
                <FaFileAlt className="mr-2" />
                Draft Preview
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6 pb-6 border-b border-gray-700">
            <span className="flex items-center gap-2">
              <FaCalendar />
              {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
            </span>
            {post.reading_time_minutes && (
              <span className="flex items-center gap-2">
                <FaClock />
                {post.reading_time_minutes} min read
              </span>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer navigation */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <Link 
              to="/blog" 
              className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
            >
              <FaArrowLeft />
              Back to all posts
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
