import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Project } from "@/api/githubProjects";
import Navbar from "@/components/navbar";
import Section from "@/components/section";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// Icons
import { IoIosMail } from "react-icons/io";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { getGitHubProjects } from "@/api/githubProjects";

const Home = () => {
    const location = useLocation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Handle hash scrolling
    useEffect(() => {
        if (location.hash) {
            // Remove the # from the hash
            const id = location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                // Small delay to ensure page is rendered
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const ghProjects = await getGitHubProjects("dehyju", 6); // Limit to 6 on home page
                setProjects(ghProjects);
                setError(null);
            } catch (err) {
                setError("Failed to load projects. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="flex flex-col text-white bg-gray-900 max-w-screen min-h-screen items-center">
            <Navbar />
            
            <Section id="home" className="w-full min-h-screen justify-center items-center">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-linear-to-r text-white bg-clip-text">
                        Stephen Leong
                    </h1>
                    <p className="text-2xl md:text-3xl mb-4 text-gray-300">Software Engineer</p>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Building innovative solutions at NatWest Group. Passionate about creating elegant, user-focused applications.
                    </p>
                </div>
            </Section>

            <Section id="about" className="w-full min-h-screen justify-center items-center bg-gray-800">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">About Me</h2>
                    <p className="text-lg md:text-xl mb-8 text-gray-300 text-center max-w-3xl mx-auto">
                        Software Engineer at NatWest Group and Loughborough University alum. 
                        Experienced in full-stack development, digital transformation, and building scalable web applications.
                    </p>
                    
                    <div className="mt-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-6">Experience</h3>
                        <div className="space-y-6">
                            <div className="border-l-4 border-blue-500 pl-6 py-2">
                                <h4 className="text-xl font-semibold text-white">Software Engineer</h4>
                                <p className="text-gray-400">NatWest Group • September 2026 - Present</p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-6 py-2">
                                <h4 className="text-xl font-semibold text-white">Digital Experience Specialist</h4>
                                <p className="text-gray-400">
                                    <a href="https://www.lsu.co.uk" className="company-link" target="_blank" rel="noopener noreferrer">LSU</a> • November 2025 - August 2026
                                </p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-6 py-2">
                                <h4 className="text-xl font-semibold text-white">CTO & Co-founder</h4>
                                <p className="text-gray-400">
                                    <a href="https://hauze.io" className="company-link" target="_blank" rel="noopener noreferrer">Hauze Ltd</a> • January 2026 - July 2026
                                </p>
                            </div>
                            <div className="border-l-4 border-yellow-500 pl-6 py-2">
                                <h4 className="text-xl font-semibold text-white">Digital Experience Assistant</h4>
                                <p className="text-gray-400">
                                    <a href="https://www.lsu.co.uk" className="company-link" target="_blank" rel="noopener noreferrer">LSU</a> • October 2024 - November 2025
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section id="projects" className="w-full min-h-screen justify-start items-center py-20">
                <div className="max-w-6xl mx-auto w-full px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Projects</h2>
                    <p className="text-lg md:text-xl text-gray-400 mb-12 text-center max-w-2xl mx-auto">
                        A selection of my recent work and open-source contributions.
                    </p>
                    
                    {loading && <Spinner size={48} />}
                    
                    {error && (
                        <div className="text-center py-20">
                            <p className="text-destructive text-lg">{error}</p>
                        </div>
                    )}
                    
                    {!loading && !error && projects.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No projects to display at the moment.</p>
                        </div>
                    )}
                    
                    {!loading && !error && projects.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {projects.map((project) => (
                                    <ProjectCard key={project.name} project={project} />
                                ))}
                            </div>
                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    asChild
                                    className="border-gray-700 hover:border-blue-400 hover:bg-blue-950/30 text-white"
                                >
                                    <a href="/projects">
                                        View All Projects
                                    </a>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Section>

            <Section id="contact" className="w-full min-h-screen justify-center items-center bg-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button 
                            variant="outline" 
                            size="lg" 
                            asChild 
                            className="border-gray-700 hover:border-blue-400 hover:bg-blue-950/30 text-white"
                        >
                            <a 
                                href="mailto:stephen.t.j.leong@gmail.com" 
                                aria-label="Email"
                            >
                                <IoIosMail className="mr-2 h-5 w-5" />
                                Email Me
                            </a>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            asChild 
                            className="border-gray-700 hover:border-purple-400 hover:bg-purple-950/30 text-white"
                        >
                            <a 
                                href="https://github.com/dehyju" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                            >
                                <FaGithub className="mr-2 h-5 w-5" />
                                GitHub
                            </a>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            asChild 
                            className="border-gray-700 hover:border-blue-500 hover:bg-blue-950/30 text-white"
                        >
                            <a 
                                href="https://www.linkedin.com/in/stephen-t-j-leong/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin className="mr-2 h-5 w-5" />
                                LinkedIn
                            </a>
                        </Button>
                    </div>
                </div>
            </Section>
            
            <Footer />
        </div>
    );
};

export default Home;