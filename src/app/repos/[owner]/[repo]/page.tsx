import styles from './page.module.css';

import { api } from '@/modules/api';

type Params = {
  params: {
    owner: string;
    repo: string;
  };
};
import Image from 'next/image';
import Link from 'next/link';

export default async function RepoWorkflows({ params: { owner, repo } }: Params) {
  const workflows = await api.listRepositoryWorkflows({ owner, repo });

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        {workflows.map((w) => {
          return (
            <div key={w.id} className={styles.card}>
              {w.name} {w.state}
              <h3>
                <Link href={`/repos/${owner}/${repo}/actions/workflows/${w.id}/runs`}>
                  details <span>-&gt;</span>
                </Link>
              </h3>
            </div>
          );
        })}
      </div>
    </main>
  );
}
