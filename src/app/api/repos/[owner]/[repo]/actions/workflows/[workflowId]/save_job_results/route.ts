import { api } from '@/modules/api';
import { save } from '@/modules/save';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
const dataDir = path.join(process.cwd(), 'data');
// const dataDir = path.join(__dirname, '../../../../../../../../../../', 'data');

type Params = {
  params: { owner: string; repo: string; workflowId: string };
};
export async function POST(req: NextRequest, { params }: Params) {
  save(params);

  return NextResponse.json({ ok: true });
}
