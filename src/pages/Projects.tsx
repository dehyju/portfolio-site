import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import type { Project } from "@/api/githubProjects";
import { getGitHubProjects } from "@/api/githubProjects";
import Navbar from "@/components/navbar";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FaSearch } from "react-icons/fa";

const ITEMS_PER_PAGE = 9;

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projects = await getGitHubProjects("dehyju");
        setAllProjects(projects);
        setFilteredProjects(projects);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = allProjects;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.topics?.some((topic) => topic.toLowerCase().includes(query))
      );
    }

    // Filter by language
    if (selectedLanguage) {
      filtered = filtered.filter((project) => project.language === selectedLanguage);
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page when filters change

    // Update URL search params
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    setSearchParams(params);
  }, [searchQuery, selectedLanguage, allProjects, setSearchParams]);

  // Get unique languages
  const languages = Array.from(
    new Set(allProjects.filter((p) => p.language).map((p) => p.language))
  ).sort();

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col text-white bg-gray-900 min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Projects</h1>
            <p className="text-lg text-gray-400">
              Browse through all my GitHub repositories
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects by name, description, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Language filters */}
            {languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedLanguage === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(null)}
                  className={selectedLanguage === null ? "" : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                >
                  All
                </Button>
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang || null)}
                    className={selectedLanguage === lang ? "" : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mb-4 text-gray-400">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found
          </div>

          {/* Projects Grid */}
          {loading ? (
            <Spinner size={48} />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No projects found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProjects.map((project) => (
                  <ProjectCard key={project.name} project={project} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="border-gray-700 text-white disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? ""
                            : "border-gray-700 text-gray-300 hover:bg-gray-800"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="border-gray-700 text-white disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
