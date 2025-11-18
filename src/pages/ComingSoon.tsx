import { FaGithub, FaLinkedin } from "react-icons/fa6"
import { IoIosMail } from "react-icons/io"

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-screen min-h-screen">
      <h1 className="text-5xl font-bold mb-6">
        Coming Soon
      </h1>
      <p>
        Check out my socials
      </p>
      <div className="flex items-center space-x-6 mt-6">
        <a href="https://github.com/dehyju" className="text-4xl hover:text-gray-400" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a href="mailto:enquire@stephenleong.co.uk" className="text-4xl hover:text-gray-400"><IoIosMail /></a>
        <a href="https://www.linkedin.com/in/stephen-t-j-leong" className="text-4xl hover:text-gray-400" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      </div>
    </div>
  )
}

export default ComingSoon