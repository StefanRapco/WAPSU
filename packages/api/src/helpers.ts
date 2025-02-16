// ChatGPT generated

export function splitArrayToChunks<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];

  const result: T[][] = new Array();

  for (let chunkStart = 0; chunkStart < array.length; chunkStart += size) {
    result.push(array.slice(chunkStart, chunkStart + size));
  }

  return result;
}
