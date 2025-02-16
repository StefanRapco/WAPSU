// ChatGPT generated
import { randomUUID } from 'crypto';

export function splitArrayToChunks<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];

  const result: T[][] = new Array();

  for (let chunkStart = 0; chunkStart < array.length; chunkStart += size) {
    result.push(array.slice(chunkStart, chunkStart + size));
  }

  return result;
}

export function uuid(): string {
  const uuid = randomUUID();
  const base64 = Buffer.from(uuid.replace(/-/g, ''), 'hex') // Remove dashes and convert to hex buffer
    .toString('base64') // Convert to Base64
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=+$/, ''); // Remove padding ('=')

  return base64;
}
