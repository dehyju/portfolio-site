import { FaGithub, FaStar, FaCodeBranch } from "react-icons/fa";
import type { Project } from "@/api/githubProjects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl text-white mb-0">{project.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-gray-700 hover:text-white"
          >
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} on GitHub`}
            >
              <FaGithub className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <CardDescription className="text-gray-300">
          {project.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="grow">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {project.language && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              {project.language}
            </span>
          )}
          {project.stars !== undefined && project.stars > 0 && (
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              {project.stars}
            </span>
          )}
          {project.forks !== undefined && project.forks > 0 && (
            <span className="flex items-center gap-1">
              <FaCodeBranch />
              {project.forks}
            </span>
          )}
        </div>
      </CardContent>
      
      {project.topics && project.topics.length > 0 && (
        <CardFooter className="flex-wrap gap-2">
          {project.topics.slice(0, 5).map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="bg-blue-900/30 text-blue-300 border-blue-800 hover:bg-blue-900/50"
            >
              {topic}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectCard;
