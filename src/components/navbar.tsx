import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        setIsMenuOpen(false);
        navigate('/');
    };

    const scrollToSection = (sectionId: string) => {
        setIsMenuOpen(false);
        // If we're already on the home page, just scroll
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Navigate to home with hash, Home component will handle scrolling
            navigate(`/#${sectionId}`);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full text-white bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
            <div className="flex h-16 md:h-20 w-full justify-between items-center px-4 md:px-6">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <img src="/favicon.ico" alt="Stephen Leong" className="h-12 md:h-20 w-auto" />
                </Link>

                {/* Desktop links */}
                <ul className="hidden md:flex space-x-8 text-lg items-center">
                    <li>
                        <button
                            onClick={() => scrollToSection('home')}
                            className="hover:text-blue-400 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            Home
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => scrollToSection('about')}
                            className="hover:text-blue-400 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            About
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => scrollToSection('projects')}
                            className="hover:text-blue-400 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            Projects
                        </button>
                    </li>
                    <li>
                        <Link to="/blog" className="hover:text-blue-400 transition-colors duration-200">
                            Blog
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="hover:text-blue-400 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            Contact
                        </button>
                    </li>
                    {user && (
                        <>
                            <li>
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                                >
                                    <FaUserCircle />
                                    Admin
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                                >
                                    <FaSignOutAlt />
                                    Sign Out
                                </button>
                            </li>
                        </>
                    )}
                </ul>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="md:hidden p-2 text-2xl bg-transparent border-none cursor-pointer"
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <ul className="md:hidden flex flex-col w-full text-lg border-t border-gray-800 bg-gray-900/95">
                    <li>
                        <button
                            onClick={() => scrollToSection('home')}
                            className="w-full text-left px-6 py-3 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            Home
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => scrollToSection('about')}
                            className="w-full text-left px-6 py-3 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            About
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => scrollToSection('projects')}
                            className="w-full text-left px-6 py-3 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            Projects
                        </button>
                    </li>
                    <li>
                        <Link
                            to="/blog"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-6 py-3 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                        >
                            Blog
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="w-full text-left px-6 py-3 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            Contact
                        </button>
                    </li>
                    {user && (
                        <>
                            <li>
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <FaUserCircle />
                                    Admin
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors duration-200 border-none cursor-pointer"
                                >
                                    <FaSignOutAlt />
                                    Sign Out
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;