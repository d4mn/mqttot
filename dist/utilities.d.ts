/// <reference types="node" />
/// <reference types="node" />
export declare function compressDeflate(data: string | Buffer): Promise<Buffer>;
export declare const unzipAsync: (arg1: string | Buffer) => Promise<Buffer>;
export declare function tryUnzipAsync(data: Buffer): Promise<Buffer>;
export declare type BigInteger = string | bigint | number;
//# sourceMappingURL=utilities.d.ts.map