/// <reference types="node" />
import net from 'net';
export interface MqttProxy {
    connect(): Promise<net.Socket>;
}
//# sourceMappingURL=mqtt.proxy.d.ts.map