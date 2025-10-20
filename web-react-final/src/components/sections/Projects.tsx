import { siteConfig } from '@/config/siteConfig';
import { getRepoSummary } from '@/lib/github';
import ProjectsClient, { ProjectsClientProject } from './ProjectsClient';

async function buildProjectsList(): Promise<ProjectsClientProject[]> {
  const projects = await Promise.all(
    siteConfig.projects.map(async (project) => {
      try {
        const summary = await getRepoSummary(project.repoOwner, project.repoName);

        return {
          ...project,
          overview: summary.overview || project.outcome || 'Repository summary will appear here soon.',
          repoUrl: summary.htmlUrl,
          liveUrl: project.demoUrl || summary.homepage,
        } satisfies ProjectsClientProject;
      } catch (error) {
        console.error('Failed to fetch repo summary', project.repoOwner, project.repoName, error);

        return {
          ...project,
          overview: project.outcome || 'Project details coming soon.',
          repoUrl: `https://github.com/${project.repoOwner}/${project.repoName}`,
          liveUrl: project.demoUrl,
        } satisfies ProjectsClientProject;
      }
    }),
  );

  return projects;
}

export default async function Projects() {
  const projects = await buildProjectsList();

  return <div className="projects-container"><ProjectsClient projects={projects} /></div>;
}
