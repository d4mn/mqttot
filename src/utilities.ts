import { deflate, unzip } from 'zlib';
import { promisify } from 'util';

export async function compressDeflate(data: string | Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    deflate(data, { level: 9 }, (error, result) => (error ? reject(error) : resolve(result))),
  );
}
export const unzipAsync = promisify<string | Buffer, Buffer>(unzip);
export async function tryUnzipAsync(data: Buffer): Promise<Buffer> {
  try {
    if (data.readInt8(0) !== 0x78) return data;

    return unzipAsync(data);
  } catch (e) {
    return data;
  }
}
/**
 * A large integer (usually userIds)
 */
export type BigInteger = string | bigint | number;