import { api } from '@/modules/api';
import { bucket } from '@/modules/storage';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
const dataDir = path.join(process.cwd(), 'data');
// const dataDir = path.join(__dirname, '../../../../../../../../../../', 'data');

type Usage = {
  os: string;
  job_id: number;
  duration_ms: number;
};

type Params = { owner: string; repo: string; workflowId: string };
export async function save(params: Params) {
  // const { owner, repo, workflowId } = req.params;
  console.log(params);

  const workflowRuns = await api.listWorkflowRuns(params);
  const run = workflowRuns[0];
  await fs.promises.writeFile(
    path.join(dataDir, `workflow_run_${params.owner}_${params.repo}_${params.workflowId}.json`),
    JSON.stringify(run, null, 2),
  );

  const jobs = await api.listJobsForWorkflowRun({
    owner: params.owner,
    repo: params.repo,
    runId: run.id.toString(),
  });

  await fs.promises.writeFile(
    path.join(dataDir, `jobs_${params.owner}_${params.repo}_${run.id}.json`),
    JSON.stringify(jobs, null, 2),
  );

  const usage = await api.getWorkflowRunUsage({
    owner: params.owner,
    repo: params.repo,
    runId: run.id,
  });
  await fs.promises.writeFile(
    path.join(dataDir, `usage_${params.owner}_${params.repo}_${run.id}.json`),
    JSON.stringify(usage, null, 2),
  );

  const runJson = {
    id: run.id,
    name: run.name,
    head_branch: run.head_branch,
    head_sha: run.head_sha,
    path: run.path,
    display_title: run.display_title,
    run_number: run.run_number,
    event: run.event,
    status: run.status,
    conclusion: run.conclusion,
    workflow_id: run.workflow_id,
    check_suite_id: run.check_suite_id,
    check_suite_node_id: run.check_suite_node_id,
    pull_requests: run.pull_requests,
    created_at: run.created_at,
    updated_at: run.updated_at,
    run_attempt: run.run_attempt,
    run_started_at: run.run_started_at,
  };
  await bucket
    .file(`${run.id}/workflow_run/${params.owner}_${params.repo}_${run.id}.ndjson`)
    .save(JSON.stringify(runJson));

  const usageByJobId: Record<string, Usage> = {};
  for (const [os, billable] of Object.entries(usage.billable)) {
    for (const j of billable.job_runs ?? []) {
      usageByJobId[j.job_id] = {
        os,
        ...j,
      };
    }
  }
  const jobsJson = jobs.map((job) => {
    return {
      id: job.id,
      run_id: job.run_id,
      status: job.status,
      conclusion: job.conclusion,
      created_at: job.created_at,
      started_at: job.started_at,
      completed_at: job.completed_at,
      name: job.name,
      runner_id: job.runner_id,
      runner_name: job.runner_name,
      runner_group_id: job.runner_group_id,
      runner_group_name: job.runner_group_name,
      steps: job.steps,
      usage: usageByJobId[job.id],
    };
  });
  await bucket.file(`${run.id}/jobs/${params.owner}_${params.repo}_${run.id}.ndjson`).save(JSON.stringify(jobsJson));
}
