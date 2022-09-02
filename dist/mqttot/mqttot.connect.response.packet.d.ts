/// <reference types="node" />
/// <reference types="node" />
import { ConnectResponsePacket, PacketStream, ConnectReturnCode } from 'mqtts';
export declare class MQTToTConnectResponsePacket extends ConnectResponsePacket {
    readonly payload: Buffer;
    constructor(ackFlags: number, returnCode: ConnectReturnCode, payload: Buffer);
    static fromStream(stream: PacketStream, remaining: number): MQTToTConnectResponsePacket;
}
//# sourceMappingURL=mqttot.connect.response.packet.d.ts.map