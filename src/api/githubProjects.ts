export type Project = {
    name: string;
    description: string;
    url: string;
    language?: string;
    stars?: number;
    forks?: number;
    topics?: string[];
};

type GitHubRepo = {
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
    fork: boolean;
};

export async function getGitHubProjects(username: string, limit?: number): Promise<Project[]> {
    try {
        // Fetch all repos from all pages (GitHub limits to 100 per page)
        let allRepos: GitHubRepo[] = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                hasMore = false;
            } else {
                allRepos = allRepos.concat(data);
                hasMore = data.length === 100; // If we got 100, there might be more
                page++;
            }
        }
        
        // Filter and map repos - only exclude forks, keep repos even without descriptions
        const filteredRepos: Project[] = allRepos
            .filter(repo => !repo.fork)
            .map(repo => ({
                name: repo.name,
                description: repo.description || 'No description provided',
                url: repo.html_url,
                language: repo.language || undefined,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                topics: repo.topics || [],
            }));
        
        // Custom sorting options (uncomment the one you want):
        
        // Sort by stars (most popular first)
        filteredRepos.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        
        // Sort by name (alphabetically)
        // filteredRepos.sort((a, b) => a.name.localeCompare(b.name));
        
        // Sort by language (groups repos by language)
        // filteredRepos.sort((a, b) => (a.language || '').localeCompare(b.language || ''));
        
        return limit ? filteredRepos.slice(0, limit) : filteredRepos;
    } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
        return [];
    }
}