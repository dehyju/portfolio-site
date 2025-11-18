
const Navbar = () => {
    return (
        <nav className="flex h-20 w-full text-black justify-between items-center bg-gray-200">
            <img src="/favicon.ico" alt="Logo" className="h-full w-auto" />
            <ul className="flex space-x-6 mr-6 text-lg">
                <li><a href="#home" className="hover:text-gray-600">Home</a></li>
                <li><a href="#about" className="hover:text-gray-600">About</a></li>
                <li><a href="#projects" className="hover:text-gray-600">Projects</a></li>
                <li><a href="#contact" className="hover:text-gray-600">Contact</a></li>
            </ul>
        </nav>
    )
}

export default Navbar