import Link from 'next/link';
import { api } from '@/modules/api';
import styles from './page.module.css';
import { Save } from './save';
type Params = {
  params: {
    workflowId: string;
    repo: string;
    owner: string;
  };
};

export default async function WorkflowRuns({ params }: Params) {
  const runs = await api.listWorkflowRuns(params);

  return (
    <main className={styles.main}>
      <h2>Workflow runs</h2>
      <Save {...params}></Save>
      <div className={styles.grid}>
        {runs.map((r) => {
          return (
            <div key={r.id} className={styles.card}>
              {r.name} {r.display_title}
              <div>
                {r.status} {r.conclusion}
              </div>
              <h3>
                <Link href={`/repos/${params.owner}/${params.repo}/actions/runs/${r.id}/jobs`}>
                  jobs details <span>-&gt;</span>
                </Link>
              </h3>
              <div>
                <a href={r.html_url}>workflow url</a>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
