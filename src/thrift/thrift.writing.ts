/* tslint:disable:no-bitwise */
import { Int64, ThriftPacketDescriptor, thriftTypes } from './thrift';
import { ThriftError } from '../errors';

export function thriftWriteFromObject(obj: any, descriptors: ThriftPacketDescriptor[]): Buffer {
  const writer = BufferWriter.empty();
  thriftWriteSingleLayerFromObject(obj, descriptors, writer);
  writer.writeStop();
  return writer.buffer;
}

function thriftWriteSingleLayerFromObject(obj: any, descriptors: ThriftPacketDescriptor[], writer: BufferWriter): void {
  const entries = Object.entries(obj);

  for (const entry of entries) {
    const name = entry[0];
    const value = entry[1];
    if (typeof value === 'undefined') continue;

    const descriptor = descriptors.find(d => d.fieldName === name);
    if (!descriptor) throw new ThriftError(`Descriptor for ${name} not found`);

    switch (descriptor.type & 0xff) {
      case thriftTypes.BOOLEAN:
      case thriftTypes.TRUE:
      case thriftTypes.FALSE: {
        writer.writeBoolean(descriptor.field, !!value);
        break;
      }
      case thriftTypes.BYTE: {
        if (typeof value === 'number') {
          writer.writeInt8(descriptor.field, value);
        } else {
          throw new ThriftError(`Value of ${name} is not a number`);
        }
        break;
      }
      case thriftTypes.INT_16: {
        if (typeof value === 'number') {
          writer.writeInt16(descriptor.field, value);
        } else {
          throw new ThriftError(`Value of ${name} is not a number`);
        }
        break;
      }
      case thriftTypes.INT_32: {
        if (typeof value === 'number') {
          writer.writeInt32(descriptor.field, value);
        } else {
          throw new ThriftError(`Value of ${name} is not a number`);
        }
        break;
      }
      case thriftTypes.INT_64: {
        if (typeof value === 'object') {
          // @ts-ignore (no types :c )
          writer.writeInt64Buffer(descriptor.field, value);
        } else if (typeof value === 'number') {
          writer.writeInt64Buffer(descriptor.field, BigInt(value));
        } else if (typeof value === 'bigint') {
          writer.writeInt64Buffer(descriptor.field, value);
        } else {
          throw new ThriftError(`Value of ${name} is neither an object nor a number`);
        }
        break;
      }
      case thriftTypes.LIST: {
        // @ts-ignore
        writer.writeList(descriptor.field, descriptor.type >> 8, value);
        break;
      }
      case thriftTypes.STRUCT: {
        writer.writeStruct(descriptor.field);
        thriftWriteSingleLayerFromObject(value, descriptor.structDescriptors ?? [], writer);
        writer.writeStop();
        break;
      }
      case thriftTypes.BINARY: {
        if (typeof value === 'string') {
          writer.writeString(descriptor.field, value);
        } else {
          throw new ThriftError(`Value of ${name} is not a string`);
        }
        break;
      }
      case thriftTypes.MAP: {
        if (descriptor.type === thriftTypes.MAP_BINARY_BINARY) {
          let pairs: [string, string][];
          if (Array.isArray(value)) {
            // [{key: 'a', value: 'b'}]
            pairs = value.map((x: { key: string; value: string }) => [x.key, x.value]);
          } else {
            // {a: 'b'}
            // @ts-ignore - in this case value should match the required type
            pairs = Object.entries(value);
          }
          writer.writeMapHeader(descriptor.field, pairs.length, thriftTypes.BINARY, thriftTypes.BINARY);
          if (pairs.length !== 0) {
            for (const pair of pairs) {
              writer.writeStringDirect(pair[0]).writeStringDirect(pair[1]);
            }
          }
        } else {
          throw new ThriftError(`Map of type ${descriptor.type} not impl.`);
        }
        break;
      }
      default: {
        throw new ThriftError(`Could not find type ${descriptor.type} for ${name}`);
      }
    }
  }
}

export class BufferWriter {
  public get buffer(): Buffer {
    return this._buffer;
  }

  private _buffer: Buffer;

  private _position = 0;
  public get position(): number {
    return this._position;
  }

  public get length(): number {
    return this._buffer.length;
  }

  private _field = 0;
  public get field(): number {
    return this._field;
  }

  private _stack: number[] = [];
  public get stack(): number[] {
    return this._stack;
  }

  private constructor(data?: string, length?: number, buffer?: Buffer) {
    this._buffer = data ? Buffer.from(data) : length ? Buffer.alloc(length) : buffer ? buffer : Buffer.from([]);
    this._position = 0;
  }

  public static fromLength(len: number) {
    return new BufferWriter(undefined, len, undefined);
  }

  public static fromBuffer(buf: Buffer) {
    return new BufferWriter(undefined, undefined, buf);
  }

  public static fromString(data: string) {
    return new BufferWriter(data, undefined, undefined);
  }

  public static empty() {
    return new BufferWriter(undefined, undefined, undefined);
  }

  public move(bytes: number): number {
    this._position = this._position + bytes;
    return this._position - bytes;
  }

  private writeVarInt(num: number): this {
    while (true) {
      let byte = num & ~0x7f;
      if (byte === 0) {
        this.writeByte(num);
        break;
      } else if (byte === -128) {
        // -128 = 0b1000_0000 but it's the last an no other bytes will follow
        this.writeByte(0);
        break;
      } else {
        byte = (num & 0xff) | 0x80;
        this.writeByte(byte);
        num = num >> 7;
      }
    }
    return this;
  }

  private writeField(field: number, type: number): this {
    const delta = field - this.field;
    if (delta > 0 && delta <= 15) {
      this.writeByte((delta << 4) | type);
    } else {
      this.writeByte(type);
      this.writeWord(field);
    }
    this._field = field;

    return this;
  }

  private writeBuffer(buf: Buffer): this {
    if (this._buffer) this._buffer = Buffer.concat([this._buffer, buf]);
    else this._buffer = buf;
    this.move(buf.length);
    return this;
  }

  private writeByte(byte: number): this {
    const buf = Buffer.alloc(1);
    buf.writeUInt8(byte, 0);
    this.writeBuffer(buf);
    return this;
  }

  private writeWord(num: number): this {
    return this.writeVarInt(BufferWriter.toZigZag(num, 0x10));
  }

  private writeInt(num: number): this {
    return this.writeVarInt(BufferWriter.toZigZag(num, 0x20));
  }

  private writeLong(num: Int64 | { int: Int64; num: number }): this {
    // @ts-ignore
    if (num.int) {
      // @ts-ignore
      num = num.int;
    }
    if (typeof num === 'bigint') {
      this.writeBigint(BufferWriter.bigintToZigZag(num));
    } else {
      // @ts-ignore
      this.writeVarInt64(BufferWriter.int64ToZigZag(num));
    }
    return this;
  }

  private writeBigint(n: bigint) {
    while (true) {
      if ((n & ~BigInt(0x7f)) === BigInt(0)) {
        this.writeByte(Number(n));
        break;
      } else {
        this.writeByte(Number((n & BigInt(0x7f)) | BigInt(0x80)));
        n = n >> BigInt(7);
      }
    }
  }

  public writeMapHeader(field: number, size: number, keyType: number, valueType: number): this {
    this.writeField(field, thriftTypes.MAP);
    if (size === 0) {
      this.writeByte(0);
    } else {
      this.writeVarInt(size);
      this.writeByte(((keyType & 0xf) << 4) | (valueType & 0xf));
    }
    return this;
  }

  public writeBoolean(field: number, bool: boolean): this {
    return this.writeField(field, bool ? thriftTypes.TRUE : thriftTypes.FALSE);
  }

  public writeString(field: number, s: string): this {
    this.writeField(field, thriftTypes.BINARY);
    return this.writeStringDirect(s);
  }

  public writeStringDirect(s: string): this {
    const buf = Buffer.from(s, 'utf8');
    this.writeVarInt(buf.length);
    this.writeBuffer(buf);
    return this;
  }

  public writeStop(): this {
    this.writeByte(thriftTypes.STOP);
    if (this.stack.length > 0) {
      this.popStack();
    }
    return this;
  }

  public writeInt8(field: number, num: number): this {
    this.writeField(field, thriftTypes.BYTE);
    return this.writeByte(num);
  }

  public writeInt16(field: number, num: number): this {
    this.writeField(field, thriftTypes.INT_16);
    return this.writeWord(num);
  }

  public writeInt32(field: number, num: number): this {
    this.writeField(field, thriftTypes.INT_32);
    return this.writeInt(num);
  }

  public writeInt64Buffer(field: number, num: Int64): this {
    this.writeField(field, thriftTypes.INT_64);
    return this.writeLong(num);
  }

  public writeList(field: number, type: number, list: []): this {
    this.writeField(field, thriftTypes.LIST);
    const size = list.length;

    if (size < 0x0f) {
      this.writeByte((size << 4) | type);
    } else {
      this.writeByte(0xf0 | type);
      this.writeVarInt(size);
    }

    switch (type) {
      case thriftTypes.TRUE:
      case thriftTypes.FALSE: {
        list.forEach(el => this.writeByte(el ? thriftTypes.TRUE : thriftTypes.FALSE));
        break;
      }
      case thriftTypes.BYTE: {
        list.forEach(el => this.writeByte(el));
        break;
      }
      case thriftTypes.INT_16: {
        list.forEach(el => this.writeWord(el));
        break;
      }
      case thriftTypes.INT_32: {
        list.forEach(el => this.writeInt(el));
        break;
      }
      case thriftTypes.INT_64: {
        list.forEach(el => this.writeLong(BigInt(el)));
        break;
      }
      case thriftTypes.BINARY: {
        list.forEach(el => {
          const buf = Buffer.from(el, 'utf8');
          this.writeVarInt(buf.length);
          this.writeBuffer(buf);
        });
        break;
      }
      default: {
        throw new ThriftError('not impl');
      }
    }
    return this;
  }

  public writeStruct(field: number): this {
    this.writeField(field, thriftTypes.STRUCT);
    this.pushStack();
    return this;
  }

  public pushStack() {
    this._stack.push(this.field);
    this._field = 0;
  }

  public popStack() {
    this._field = this._stack.pop() ?? -1;
  }

  public toString() {
    return this._buffer.toString('ascii');
  }

  public static bigintToZigZag(n: bigint): bigint {
    return (n << BigInt(1)) ^ (n >> BigInt(63));
  }

  public static toZigZag = (n: number, bits: number) => (n << 1) ^ (n >> (bits - 1));
}
