import fs from 'fs';

import { Octokit } from '@octokit/rest';
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Repo = {
  owner: string;
  repo: string;
};

export const api = {
  listWorkflowRuns: async ({ owner, repo, workflowId }: Repo & { workflowId: string }) => {
    const res = await octokit.actions.listWorkflowRuns({ owner, repo, workflow_id: workflowId });
    return res.data.workflow_runs;
  },
  listRepositoryWorkflows: async ({ owner, repo }: Repo) => {
    const results = [];
    let page = 0;
    let totalCount;
    do {
      page += 1;
      const res = await octokit.actions.listRepoWorkflows({
        owner,
        repo,
        page,
      });
      if (totalCount === undefined) {
        totalCount = res.data.total_count;
      }
      results.push(...res.data.workflows);
    } while (results.length < totalCount);

    return results;
  },
  listJobsForWorkflowRun: async ({ owner, repo, runId }: Repo & { runId: string }) => {
    const res = await octokit.actions.listJobsForWorkflowRun({ owner, repo, run_id: parseInt(runId) });

    return res.data.jobs;
  },
};
