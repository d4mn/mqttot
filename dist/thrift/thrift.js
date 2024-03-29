"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.int64ToNumber = exports.thriftDescriptors = exports.isThriftBoolean = exports.thriftTypes = void 0;
exports.thriftTypes = {
    STOP: 0x00,
    TRUE: 0x01,
    FALSE: 0x02,
    BYTE: 0x03,
    INT_16: 0x04,
    INT_32: 0x05,
    INT_64: 0x06,
    DOUBLE: 0x07,
    BINARY: 0x08,
    LIST: 0x09,
    SET: 0x0a,
    MAP: 0x0b,
    STRUCT: 0x0c,
    LIST_INT_16: (0x04 << 8) | 0x09,
    LIST_INT_32: (0x05 << 8) | 0x09,
    LIST_INT_64: (0x06 << 8) | 0x09,
    LIST_BINARY: (0x08 << 8) | 0x09,
    MAP_BINARY_BINARY: (0x88 << 8) | 0x0b,
    BOOLEAN: 0xa1,
};
function isThriftBoolean(type) {
    type &= 0x0f;
    return type === exports.thriftTypes.TRUE || type === exports.thriftTypes.FALSE || type === exports.thriftTypes.BOOLEAN;
}
exports.isThriftBoolean = isThriftBoolean;
exports.thriftDescriptors = {
    boolean: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.BOOLEAN,
    }),
    byte: (fieldName, field) => ({ field, fieldName, type: exports.thriftTypes.BYTE }),
    int16: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.INT_16,
    }),
    int32: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.INT_32,
    }),
    int64: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.INT_64,
    }),
    double: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.DOUBLE,
    }),
    binary: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.BINARY,
    }),
    listOfInt16: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.LIST_INT_16,
    }),
    listOfInt32: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.LIST_INT_32,
    }),
    listOfInt64: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.LIST_INT_64,
    }),
    listOfBinary: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.LIST_BINARY,
    }),
    mapBinaryBinary: (fieldName, field) => ({
        field,
        fieldName,
        type: exports.thriftTypes.MAP_BINARY_BINARY,
    }),
    struct: (fieldName, field, descriptors) => ({
        field,
        fieldName,
        type: exports.thriftTypes.STRUCT,
        structDescriptors: descriptors,
    }),
};
function int64ToNumber(i64) {
    if (typeof i64 === 'number') {
        return i64;
    }
    if (typeof i64 === 'bigint') {
        return Number(i64);
    }
    throw new Error('Unknown Int64-type');
}
exports.int64ToNumber = int64ToNumber;
//# sourceMappingURL=thrift.js.map