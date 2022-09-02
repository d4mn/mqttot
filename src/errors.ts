import { CustomError } from 'ts-custom-error';

export class MQTToTEmptyPacketError extends CustomError {}
export class MQTToTConnectionFailedError extends CustomError {}
export class ThriftError extends CustomError {}