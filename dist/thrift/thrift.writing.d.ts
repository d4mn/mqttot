/// <reference types="node" />
/// <reference types="node" />
import { Int64, ThriftPacketDescriptor } from './thrift';
export declare function thriftWriteFromObject(obj: any, descriptors: ThriftPacketDescriptor[]): Buffer;
export declare class BufferWriter {
    get buffer(): Buffer;
    private _buffer;
    private _position;
    get position(): number;
    get length(): number;
    private _field;
    get field(): number;
    private _stack;
    get stack(): number[];
    private constructor();
    static fromLength(len: number): BufferWriter;
    static fromBuffer(buf: Buffer): BufferWriter;
    static fromString(data: string): BufferWriter;
    static empty(): BufferWriter;
    move(bytes: number): number;
    private writeVarInt;
    private writeField;
    private writeBuffer;
    private writeByte;
    private writeWord;
    private writeInt;
    private writeLong;
    private writeBigint;
    writeMapHeader(field: number, size: number, keyType: number, valueType: number): this;
    writeBoolean(field: number, bool: boolean): this;
    writeString(field: number, s: string): this;
    writeStringDirect(s: string): this;
    writeStop(): this;
    writeInt8(field: number, num: number): this;
    writeInt16(field: number, num: number): this;
    writeInt32(field: number, num: number): this;
    writeInt64Buffer(field: number, num: Int64): this;
    writeList(field: number, type: number, list: []): this;
    writeStruct(field: number): this;
    pushStack(): void;
    popStack(): void;
    toString(): string;
    static bigintToZigZag(n: bigint): bigint;
    static toZigZag: (n: number, bits: number) => number;
}
//# sourceMappingURL=thrift.writing.d.ts.map