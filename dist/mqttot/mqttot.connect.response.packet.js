"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTToTConnectResponsePacket = void 0;
const mqtts_1 = require("mqtts");
class MQTToTConnectResponsePacket extends mqtts_1.ConnectResponsePacket {
    constructor(ackFlags, returnCode, payload) {
        super(ackFlags, returnCode);
        this.payload = payload;
    }
    static fromStream(stream, remaining) {
        const ack = stream.readByte();
        const returnCode = stream.readByte();
        if (ack > 1) {
            throw new Error('Invalid ack');
        }
        else if (returnCode > 5) {
            throw new Error('Invalid return code');
        }
        return new MQTToTConnectResponsePacket(ack, returnCode, remaining > 2 ? stream.readStringAsBuffer() : Buffer.alloc(0));
    }
}
exports.MQTToTConnectResponsePacket = MQTToTConnectResponsePacket;
//# sourceMappingURL=mqttot.connect.response.packet.js.map