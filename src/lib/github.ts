import { cache } from 'react';

export type RepoSummary = {
  overview: string;
  htmlUrl: string;
  homepage?: string;
};

const GITHUB_BASE = 'https://api.github.com/repos';

async function fetchReadme(owner: string, repo: string, timeoutMs = 3000): Promise<string | null> {
  const branches = ['main', 'master'];

  for (const branch of branches) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`,
        {
          signal: controller.signal,
          next: { revalidate: 60 * 60 * 24 },
          headers: {
            Accept: 'text/plain',
          },
        },
      );

      if (response.ok) {
        clearTimeout(timer);
        return response.text();
      }
    } catch {
      // Timeout or network error - try next branch
      // swallow and continue
    } finally {
      clearTimeout(timer);
    }
  }

  return null;
}

function extractSummary(markdown: string | null): string {
  if (!markdown) {
    return '';
  }

  const lines = markdown
    .split('\n')
    .map((line) =>
      line
        .replace(/^#+\s*/, '')
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        .replace(/[`*>_~]/g, '')
        .trim(),
    )
    .filter(Boolean);

  if (!lines.length) {
    return '';
  }

  const summary = lines[0];

  return summary.length > 220 ? `${summary.slice(0, 217)}...` : summary;
}

export const getRepoSummary = cache(async (owner: string, repo: string): Promise<RepoSummary> => {
  // Run readme fetch and repo metadata in parallel but handle failures individually.
  const readmePromise = fetchReadme(owner, repo, 2500);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  const repoMetaPromise = fetch(`${GITHUB_BASE}/${owner}/${repo}`, {
    signal: controller.signal,
    next: { revalidate: 60 * 60 * 24 },
    headers: {
      Accept: 'application/vnd.github+json',
    },
  }).finally(() => clearTimeout(timer));

  const [readmeResult, repoMetaResult] = await Promise.allSettled([readmePromise, repoMetaPromise]);

  const readme = readmeResult.status === 'fulfilled' ? readmeResult.value : null;

  const overview = extractSummary(readme);

  if (repoMetaResult.status !== 'fulfilled') {
    return {
      overview,
      htmlUrl: `https://github.com/${owner}/${repo}`,
    };
  }

  try {
    const metaResp = repoMetaResult.value as Response;
    if (!metaResp.ok) {
      return { overview, htmlUrl: `https://github.com/${owner}/${repo}` };
    }

    const json = (await metaResp.json()) as { html_url: string; homepage?: string };
    return {
      overview,
      htmlUrl: json.html_url,
      homepage: json.homepage || undefined,
    };
  } catch {
    return {
      overview,
      htmlUrl: `https://github.com/${owner}/${repo}`,
    };
  }
});
