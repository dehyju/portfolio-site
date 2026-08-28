import { useAuth } from '@/contexts/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const scrollToSection = (sectionId: string) => {
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
        <nav className="fixed top-0 left-0 right-0 z-50 flex h-20 w-full text-white justify-between items-center bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
            <div className="flex items-center ml-6">
                <Link to="/">
                    <img src="/favicon.ico" alt="Stephen Leong" className="h-20 w-auto mr-3" />
                </Link>
            </div>
            <ul className="flex space-x-8 mr-6 text-lg items-center">
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
        </nav>
    );
};

export default Navbar;