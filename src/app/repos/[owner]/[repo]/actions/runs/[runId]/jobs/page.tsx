import styles from './page.module.css';

import { api } from '@/modules/api';

type Params = {
  params: {
    owner: string;
    repo: string;
    runId: string;
  };
};

export default async function RepoWorkflows({ params: { owner, repo, runId } }: Params) {
  const run = await api.listJobsForWorkflowRun({ owner, repo, runId });

  return (
    <main className={styles.main}>
      <h2>
        {run[0].workflow_name} {run[0].head_branch}
      </h2>
      <div className={styles.grid}>
        {run.map((r) => {
          return (
            <div key={r.id} className={styles.card}>
              {r.name}
              <div>
                {r.status} {r.conclusion} ({durationSec(r.started_at, r.completed_at!)}sec)
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function durationSec(from: string, to: string) {
  const fromTime = new Date(from);
  const toTime = new Date(to);
  return (toTime.getTime() - fromTime.getTime()) / 1000;
}
