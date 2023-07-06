'use client';

type Props = {
  owner: string;
  repo: string;
  workflowId: string;
};

export function Save(props: Props) {
  const save = async () => {
    const res = await fetch(
      `/api/repos/${props.owner}/${props.repo}/actions/workflows/${props.workflowId}/save_job_results`,
      {
        method: 'POST',
      },
    );
    console.log(res);
  };

  return <button onClick={save}>save</button>;
}
