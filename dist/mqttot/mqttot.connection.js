"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTToTConnection = void 0;
const thrift_1 = require("../thrift");
class MQTToTConnection {
    constructor(connectionData) {
        this.fbnsConnectionData = connectionData;
    }
    toThrift() {
        return (0, thrift_1.thriftWriteFromObject)(this.fbnsConnectionData, MQTToTConnection.thriftConfig);
    }
    toString() {
        return this.toThrift().toString();
    }
}
exports.MQTToTConnection = MQTToTConnection;
MQTToTConnection.thriftConfig = [
    thrift_1.thriftDescriptors.binary('clientIdentifier', 1),
    thrift_1.thriftDescriptors.binary('willTopic', 2),
    thrift_1.thriftDescriptors.binary('willMessage', 3),
    thrift_1.thriftDescriptors.struct('clientInfo', 4, [
        thrift_1.thriftDescriptors.int64('userId', 1),
        thrift_1.thriftDescriptors.binary('userAgent', 2),
        thrift_1.thriftDescriptors.int64('clientCapabilities', 3),
        thrift_1.thriftDescriptors.int64('endpointCapabilities', 4),
        thrift_1.thriftDescriptors.int32('publishFormat', 5),
        thrift_1.thriftDescriptors.boolean('noAutomaticForeground', 6),
        thrift_1.thriftDescriptors.boolean('makeUserAvailableInForeground', 7),
        thrift_1.thriftDescriptors.binary('deviceId', 8),
        thrift_1.thriftDescriptors.boolean('isInitiallyForeground', 9),
        thrift_1.thriftDescriptors.int32('networkType', 10),
        thrift_1.thriftDescriptors.int32('networkSubtype', 11),
        thrift_1.thriftDescriptors.int64('clientMqttSessionId', 12),
        thrift_1.thriftDescriptors.binary('clientIpAddress', 13),
        thrift_1.thriftDescriptors.listOfInt32('subscribeTopics', 14),
        thrift_1.thriftDescriptors.binary('clientType', 15),
        thrift_1.thriftDescriptors.int64('appId', 16),
        thrift_1.thriftDescriptors.boolean('overrideNectarLogging', 17),
        thrift_1.thriftDescriptors.binary('connectTokenHash', 18),
        thrift_1.thriftDescriptors.binary('regionPreference', 19),
        thrift_1.thriftDescriptors.binary('deviceSecret', 20),
        thrift_1.thriftDescriptors.byte('clientStack', 21),
        thrift_1.thriftDescriptors.int64('fbnsConnectionKey', 22),
        thrift_1.thriftDescriptors.binary('fbnsConnectionSecret', 23),
        thrift_1.thriftDescriptors.binary('fbnsDeviceId', 24),
        thrift_1.thriftDescriptors.binary('fbnsDeviceSecret', 25),
        thrift_1.thriftDescriptors.int64('fbUserId', 26),
    ]),
    thrift_1.thriftDescriptors.binary('password', 5),
    thrift_1.thriftDescriptors.int16('unknown', 5),
    thrift_1.thriftDescriptors.listOfBinary('getDiffsRequests', 6),
    thrift_1.thriftDescriptors.binary('zeroRatingTokenHash', 9),
    thrift_1.thriftDescriptors.mapBinaryBinary('appSpecificInfo', 10),
];
//# sourceMappingURL=mqttot.connection.js.map