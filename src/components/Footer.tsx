const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-400">
          © {currentYear} Stephen Leong. Built with React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
