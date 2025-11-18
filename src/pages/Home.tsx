import Navbar from "../components/navbar"
import Section from "../components/section"

// Icons
import { IoIosMail } from "react-icons/io";
import { FaGithub } from "react-icons/fa";

const Home = () => {
    return (
        <div className="flex flex-col text-white bg-gray-900 max-w-screen min-h-screen items-center">
            <Navbar />
            <Section id="home" className="w-full h-screen justify-center items-center">
                <h1 className="text-5xl font-bold mb-4">Welcome to My Portfolio</h1>
                <p className="text-xl">Showcasing my projects and skills.</p>
            </Section>
            <Section id="about" className="w-full h-screen justify-center items-center bg-gray-800">
                <h2 className="text-4xl font-bold mb-4">About Me</h2>
                <p className="text-lg max-w-2xl text-center">I am a passionate developer with experience in building web applications using modern technologies.</p>
            </Section>
            <Section id="projects" className="w-full h-screen justify-center items-center">
                <h2 className="text-4xl font-bold mb-4">Projects</h2>
                <p className="text-lg max-w-2xl text-center">Here are some of the projects I have worked on recently.</p>
            </Section>
            <Section id="contact" className="w-full h-screen justify-center items-center bg-gray-800">
                <h2 className="text-4xl font-bold mb-4">Contact Me</h2>
                <p className="text-lg max-w-2xl text-center">Feel free to reach out for collaborations or just a friendly hello!</p>
                <div className="flex items-center space-x-6 mt-6">
                    <a href="mailto:stephen.t.j.leong@gmail.com" className="text-4xl hover:text-gray-400"><IoIosMail /></a>
                    <a href="https://github.com/dehyju" target="_blank" className="text-4xl hover:text-gray-400"><FaGithub /></a>
                </div>
            </Section>
        </div>
    )
}

export default Home