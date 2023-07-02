'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
type Props = {};

export function Form({}: Props) {
  const ownerRef = React.useRef<HTMLInputElement>(null);
  const repoRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  return (
    <form
      autoComplete="on"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ownerRef.current?.value || !repoRef.current?.value) return;
        router.push(`/repos/${ownerRef.current?.value}/${repoRef.current?.value}`);
      }}
    >
      <input ref={ownerRef} name="owner" type="text" placeholder="owner" autoComplete="on" /> /{' '}
      <input ref={repoRef} name="repo" type="text" placeholder="repo" autoComplete="on" />
      <input type="submit" value="go" />
    </form>
  );
}
