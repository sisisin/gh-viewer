import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: 'daken-counter',
});
export const bucket = storage.bucket('gh-workflow-res');
