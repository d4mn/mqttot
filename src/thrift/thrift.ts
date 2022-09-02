/* tslint:disable:no-bitwise */
export interface ThriftMessage {
  context: string;
  field: number;
  value: any;
  /* see  FbnsTypes*/
  type: number;
}

export const thriftTypes = {
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

  // internal!
  BOOLEAN: 0xa1,
};

export function isThriftBoolean(type: number) {
  type &= 0x0f;
  return type === thriftTypes.TRUE || type === thriftTypes.FALSE || type === thriftTypes.BOOLEAN;
}

export interface ThriftPacketDescriptor {
  fieldName: string;
  field: number;
  type: number;
  structDescriptors?: ThriftPacketDescriptor[];
}

export const thriftDescriptors = {
  boolean: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.BOOLEAN,
  }),
  byte: (fieldName: string, field: number): ThriftPacketDescriptor => ({ field, fieldName, type: thriftTypes.BYTE }),
  int16: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.INT_16,
  }),
  int32: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.INT_32,
  }),
  int64: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.INT_64,
  }),
  double: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.DOUBLE,
  }),
  binary: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.BINARY,
  }),
  listOfInt16: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.LIST_INT_16,
  }),
  listOfInt32: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.LIST_INT_32,
  }),
  listOfInt64: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.LIST_INT_64,
  }),
  listOfBinary: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.LIST_BINARY,
  }),
  mapBinaryBinary: (fieldName: string, field: number): ThriftPacketDescriptor => ({
    field,
    fieldName,
    type: thriftTypes.MAP_BINARY_BINARY,
  }),

  struct: (fieldName: string, field: number, descriptors: ThriftPacketDescriptor[]) => ({
    field,
    fieldName,
    type: thriftTypes.STRUCT,
    structDescriptors: descriptors,
  }),
};

export type Int64 = number | bigint | object;

export function int64ToNumber(i64: Int64): number {
  if (typeof i64 === 'number') {
    return i64;
  }
  if (typeof i64 === 'bigint') {
    return Number(i64);
  }
  throw new Error('Unknown Int64-type');
}
