/// <reference types="node" />
import { SocksClientOptions } from 'socks';
import { MqttProxy } from './mqtt.proxy';
export declare class MqttSocksProxy implements MqttProxy {
    private options;
    constructor(options: Omit<SocksClientOptions, 'command'>);
    connect(): Promise<import("net").Socket>;
}
//# sourceMappingURL=mqtt.socks.proxy.d.ts.map