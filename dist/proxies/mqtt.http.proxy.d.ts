/// <reference types="node" />
import { Socket } from 'net';
import { MqttProxy } from './mqtt.proxy';
export declare class MqttHttpProxy implements MqttProxy {
    private proxyUrl;
    private hostname;
    private port;
    constructor(proxyUrl: string, hostname: string, port: number);
    connect(): Promise<Socket>;
}
//# sourceMappingURL=mqtt.http.proxy.d.ts.map