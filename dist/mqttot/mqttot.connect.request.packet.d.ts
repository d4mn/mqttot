/// <reference types="node" />
/// <reference types="node" />
import { PacketStream, PacketWriteResult } from 'mqtts';
export interface MQTToTConnectPacketOptions {
    keepAlive: number;
    payload: Buffer;
}
export declare function writeConnectRequestPacket(stream: PacketStream, options: MQTToTConnectPacketOptions): PacketWriteResult;
//# sourceMappingURL=mqttot.connect.request.packet.d.ts.map