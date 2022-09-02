"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThriftError = exports.MQTToTConnectionFailedError = exports.MQTToTEmptyPacketError = void 0;
const ts_custom_error_1 = require("ts-custom-error");
class MQTToTEmptyPacketError extends ts_custom_error_1.CustomError {
}
exports.MQTToTEmptyPacketError = MQTToTEmptyPacketError;
class MQTToTConnectionFailedError extends ts_custom_error_1.CustomError {
}
exports.MQTToTConnectionFailedError = MQTToTConnectionFailedError;
class ThriftError extends ts_custom_error_1.CustomError {
}
exports.ThriftError = ThriftError;
//# sourceMappingURL=errors.js.map