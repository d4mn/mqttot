/// <reference types="node" />
/// <reference types="node" />
import { ConnectRequestOptions, DefaultPacketReadResultMap, DefaultPacketWriteOptions, MqttClient, MqttsReconnectStrategy, PacketFlowFunc, PacketType } from 'mqtts';
import { MQTToTConnectResponsePacket } from './mqttot.connect.response.packet';
import { MQTToTConnectPacketOptions } from './mqttot.connect.request.packet';
export declare type MQTToTReadMap = Omit<DefaultPacketReadResultMap, PacketType.ConnAck> & {
    [PacketType.ConnAck]: MQTToTConnectResponsePacket;
};
export declare type MQTToTWriteMap = Omit<DefaultPacketWriteOptions, PacketType.Connect> & {
    [PacketType.Connect]: MQTToTConnectPacketOptions;
};
export declare class MQTToTClient extends MqttClient<MQTToTReadMap, MQTToTWriteMap> {
    protected connectPayloadProvider: () => Promise<Buffer>;
    protected connectPayload?: Buffer;
    protected requirePayload: boolean;
    private mqttotDebug;
    constructor(options: {
        url: string;
        payloadProvider: () => Promise<Buffer>;
        autoReconnect: MqttsReconnectStrategy;
        requirePayload: boolean;
        proxyUrl?: string;
    });
    private static getProxy;
    connect(options?: ConnectRequestOptions): Promise<any>;
    protected registerListeners(): void;
    protected getConnectFlow(): PacketFlowFunc<MQTToTReadMap, MQTToTWriteMap, any>;
}
export declare function mqttotConnectFlow(payload: Buffer, requirePayload: boolean): PacketFlowFunc<MQTToTReadMap, MQTToTWriteMap, MQTToTConnectResponsePacket>;
//# sourceMappingURL=mqttot.client.d.ts.map