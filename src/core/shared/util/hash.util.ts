import * as crypto from 'crypto';

export function generateHash(data: any): string {
  const stringData = JSON.stringify(data);
  return crypto.createHash('sha256').update(stringData).digest('hex');
}
