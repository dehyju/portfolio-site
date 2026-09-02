import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogPosts, getAllBlogPosts, type BlogPost } from "@/api/blogPosts";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { FaClock, FaFileAlt } from "react-icons/fa";
import { BsPinAngleFill } from "react-icons/bs";

const Blog = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // If user is authenticated, show all posts including drafts
        const blogPosts = user ? await getAllBlogPosts() : await getBlogPosts();
        setPosts(blogPosts);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col text-white bg-gray-900 min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-gray-400">
              Thoughts on software development, technology, and more
            </p>
          </div>

          {loading ? (
            <Spinner size={48} />
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-2xl text-white hover:text-blue-400 transition-colors">
                              {post.title}
                            </CardTitle>
                            {post.pinned && (
                              <BsPinAngleFill className="text-yellow-500 w-5 h-5" title="Pinned" />
                            )}
                            {!post.published && user && (
                              <Badge variant="secondary" className="bg-yellow-600 text-white">
                                <FaFileAlt className="mr-1" />
                                Draft
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-gray-400">
                            {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {post.reading_time_minutes && (
                            <span className="flex items-center gap-1">
                              <FaClock />
                              {post.reading_time_minutes} min
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-300 mb-4">{post.excerpt}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-blue-900/30 text-blue-300 border-blue-800"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
