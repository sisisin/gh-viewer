import { api } from '@/modules/api';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
const dataDir = path.join(process.cwd(), 'data');
// const dataDir = path.join(__dirname, '../../../../../../../../../../', 'data');

type Params = {
  params: { owner: string; repo: string; workflowId: string };
};
export async function POST(req: NextRequest, { params }: Params) {
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

  return NextResponse.json({ ok: true });
}
