"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferWriter = exports.thriftWriteFromObject = void 0;
const thrift_1 = require("./thrift");
const errors_1 = require("../errors");
function thriftWriteFromObject(obj, descriptors) {
    const writer = BufferWriter.empty();
    thriftWriteSingleLayerFromObject(obj, descriptors, writer);
    writer.writeStop();
    return writer.buffer;
}
exports.thriftWriteFromObject = thriftWriteFromObject;
function thriftWriteSingleLayerFromObject(obj, descriptors, writer) {
    var _a;
    const entries = Object.entries(obj);
    for (const entry of entries) {
        const name = entry[0];
        const value = entry[1];
        if (typeof value === 'undefined')
            continue;
        const descriptor = descriptors.find(d => d.fieldName === name);
        if (!descriptor)
            throw new errors_1.ThriftError(`Descriptor for ${name} not found`);
        switch (descriptor.type & 0xff) {
            case thrift_1.thriftTypes.BOOLEAN:
            case thrift_1.thriftTypes.TRUE:
            case thrift_1.thriftTypes.FALSE: {
                writer.writeBoolean(descriptor.field, !!value);
                break;
            }
            case thrift_1.thriftTypes.BYTE: {
                if (typeof value === 'number') {
                    writer.writeInt8(descriptor.field, value);
                }
                else {
                    throw new errors_1.ThriftError(`Value of ${name} is not a number`);
                }
                break;
            }
            case thrift_1.thriftTypes.INT_16: {
                if (typeof value === 'number') {
                    writer.writeInt16(descriptor.field, value);
                }
                else {
                    throw new errors_1.ThriftError(`Value of ${name} is not a number`);
                }
                break;
            }
            case thrift_1.thriftTypes.INT_32: {
                if (typeof value === 'number') {
                    writer.writeInt32(descriptor.field, value);
                }
                else {
                    throw new errors_1.ThriftError(`Value of ${name} is not a number`);
                }
                break;
            }
            case thrift_1.thriftTypes.INT_64: {
                if (typeof value === 'object') {
                    writer.writeInt64Buffer(descriptor.field, value);
                }
                else if (typeof value === 'number') {
                    writer.writeInt64Buffer(descriptor.field, BigInt(value));
                }
                else if (typeof value === 'bigint') {
                    writer.writeInt64Buffer(descriptor.field, value);
                }
                else {
                    throw new errors_1.ThriftError(`Value of ${name} is neither an object nor a number`);
                }
                break;
            }
            case thrift_1.thriftTypes.LIST: {
                writer.writeList(descriptor.field, descriptor.type >> 8, value);
                break;
            }
            case thrift_1.thriftTypes.STRUCT: {
                writer.writeStruct(descriptor.field);
                thriftWriteSingleLayerFromObject(value, (_a = descriptor.structDescriptors) !== null && _a !== void 0 ? _a : [], writer);
                writer.writeStop();
                break;
            }
            case thrift_1.thriftTypes.BINARY: {
                if (typeof value === 'string') {
                    writer.writeString(descriptor.field, value);
                }
                else {
                    throw new errors_1.ThriftError(`Value of ${name} is not a string`);
                }
                break;
            }
            case thrift_1.thriftTypes.MAP: {
                if (descriptor.type === thrift_1.thriftTypes.MAP_BINARY_BINARY) {
                    let pairs;
                    if (Array.isArray(value)) {
                        pairs = value.map((x) => [x.key, x.value]);
                    }
                    else {
                        pairs = Object.entries(value);
                    }
                    writer.writeMapHeader(descriptor.field, pairs.length, thrift_1.thriftTypes.BINARY, thrift_1.thriftTypes.BINARY);
                    if (pairs.length !== 0) {
                        for (const pair of pairs) {
                            writer.writeStringDirect(pair[0]).writeStringDirect(pair[1]);
                        }
                    }
                }
                else {
                    throw new errors_1.ThriftError(`Map of type ${descriptor.type} not impl.`);
                }
                break;
            }
            default: {
                throw new errors_1.ThriftError(`Could not find type ${descriptor.type} for ${name}`);
            }
        }
    }
}
class BufferWriter {
    constructor(data, length, buffer) {
        this._position = 0;
        this._field = 0;
        this._stack = [];
        this._buffer = data ? Buffer.from(data) : length ? Buffer.alloc(length) : buffer ? buffer : Buffer.from([]);
        this._position = 0;
    }
    get buffer() {
        return this._buffer;
    }
    get position() {
        return this._position;
    }
    get length() {
        return this._buffer.length;
    }
    get field() {
        return this._field;
    }
    get stack() {
        return this._stack;
    }
    static fromLength(len) {
        return new BufferWriter(undefined, len, undefined);
    }
    static fromBuffer(buf) {
        return new BufferWriter(undefined, undefined, buf);
    }
    static fromString(data) {
        return new BufferWriter(data, undefined, undefined);
    }
    static empty() {
        return new BufferWriter(undefined, undefined, undefined);
    }
    move(bytes) {
        this._position = this._position + bytes;
        return this._position - bytes;
    }
    writeVarInt(num) {
        while (true) {
            let byte = num & ~0x7f;
            if (byte === 0) {
                this.writeByte(num);
                break;
            }
            else if (byte === -128) {
                this.writeByte(0);
                break;
            }
            else {
                byte = (num & 0xff) | 0x80;
                this.writeByte(byte);
                num = num >> 7;
            }
        }
        return this;
    }
    writeField(field, type) {
        const delta = field - this.field;
        if (delta > 0 && delta <= 15) {
            this.writeByte((delta << 4) | type);
        }
        else {
            this.writeByte(type);
            this.writeWord(field);
        }
        this._field = field;
        return this;
    }
    writeBuffer(buf) {
        if (this._buffer)
            this._buffer = Buffer.concat([this._buffer, buf]);
        else
            this._buffer = buf;
        this.move(buf.length);
        return this;
    }
    writeByte(byte) {
        const buf = Buffer.alloc(1);
        buf.writeUInt8(byte, 0);
        this.writeBuffer(buf);
        return this;
    }
    writeWord(num) {
        return this.writeVarInt(BufferWriter.toZigZag(num, 0x10));
    }
    writeInt(num) {
        return this.writeVarInt(BufferWriter.toZigZag(num, 0x20));
    }
    writeLong(num) {
        if (num.int) {
            num = num.int;
        }
        if (typeof num === 'bigint') {
            this.writeBigint(BufferWriter.bigintToZigZag(num));
        }
        else {
            this.writeVarInt64(BufferWriter.int64ToZigZag(num));
        }
        return this;
    }
    writeBigint(n) {
        while (true) {
            if ((n & ~BigInt(0x7f)) === BigInt(0)) {
                this.writeByte(Number(n));
                break;
            }
            else {
                this.writeByte(Number((n & BigInt(0x7f)) | BigInt(0x80)));
                n = n >> BigInt(7);
            }
        }
    }
    writeMapHeader(field, size, keyType, valueType) {
        this.writeField(field, thrift_1.thriftTypes.MAP);
        if (size === 0) {
            this.writeByte(0);
        }
        else {
            this.writeVarInt(size);
            this.writeByte(((keyType & 0xf) << 4) | (valueType & 0xf));
        }
        return this;
    }
    writeBoolean(field, bool) {
        return this.writeField(field, bool ? thrift_1.thriftTypes.TRUE : thrift_1.thriftTypes.FALSE);
    }
    writeString(field, s) {
        this.writeField(field, thrift_1.thriftTypes.BINARY);
        return this.writeStringDirect(s);
    }
    writeStringDirect(s) {
        const buf = Buffer.from(s, 'utf8');
        this.writeVarInt(buf.length);
        this.writeBuffer(buf);
        return this;
    }
    writeStop() {
        this.writeByte(thrift_1.thriftTypes.STOP);
        if (this.stack.length > 0) {
            this.popStack();
        }
        return this;
    }
    writeInt8(field, num) {
        this.writeField(field, thrift_1.thriftTypes.BYTE);
        return this.writeByte(num);
    }
    writeInt16(field, num) {
        this.writeField(field, thrift_1.thriftTypes.INT_16);
        return this.writeWord(num);
    }
    writeInt32(field, num) {
        this.writeField(field, thrift_1.thriftTypes.INT_32);
        return this.writeInt(num);
    }
    writeInt64Buffer(field, num) {
        this.writeField(field, thrift_1.thriftTypes.INT_64);
        return this.writeLong(num);
    }
    writeList(field, type, list) {
        this.writeField(field, thrift_1.thriftTypes.LIST);
        const size = list.length;
        if (size < 0x0f) {
            this.writeByte((size << 4) | type);
        }
        else {
            this.writeByte(0xf0 | type);
            this.writeVarInt(size);
        }
        switch (type) {
            case thrift_1.thriftTypes.TRUE:
            case thrift_1.thriftTypes.FALSE: {
                list.forEach(el => this.writeByte(el ? thrift_1.thriftTypes.TRUE : thrift_1.thriftTypes.FALSE));
                break;
            }
            case thrift_1.thriftTypes.BYTE: {
                list.forEach(el => this.writeByte(el));
                break;
            }
            case thrift_1.thriftTypes.INT_16: {
                list.forEach(el => this.writeWord(el));
                break;
            }
            case thrift_1.thriftTypes.INT_32: {
                list.forEach(el => this.writeInt(el));
                break;
            }
            case thrift_1.thriftTypes.INT_64: {
                list.forEach(el => this.writeLong(BigInt(el)));
                break;
            }
            case thrift_1.thriftTypes.BINARY: {
                list.forEach(el => {
                    const buf = Buffer.from(el, 'utf8');
                    this.writeVarInt(buf.length);
                    this.writeBuffer(buf);
                });
                break;
            }
            default: {
                throw new errors_1.ThriftError('not impl');
            }
        }
        return this;
    }
    writeStruct(field) {
        this.writeField(field, thrift_1.thriftTypes.STRUCT);
        this.pushStack();
        return this;
    }
    pushStack() {
        this._stack.push(this.field);
        this._field = 0;
    }
    popStack() {
        var _a;
        this._field = (_a = this._stack.pop()) !== null && _a !== void 0 ? _a : -1;
    }
    toString() {
        return this._buffer.toString('ascii');
    }
    static bigintToZigZag(n) {
        return (n << BigInt(1)) ^ (n >> BigInt(63));
    }
}
exports.BufferWriter = BufferWriter;
BufferWriter.toZigZag = (n, bits) => (n << 1) ^ (n >> (bits - 1));
//# sourceMappingURL=thrift.writing.js.map