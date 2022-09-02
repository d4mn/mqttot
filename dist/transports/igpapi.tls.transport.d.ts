/// <reference types="node" />
import { Transport } from 'mqtts';
import { TLSSocket } from 'tls';
import { MqttProxy } from '../proxies/mqtt.proxy';
export interface IgpapiTlsTransportOptions {
    host: string;
    port: number;
    proxy?: MqttProxy;
}
export declare class IgpapiTlsTransport extends Transport<IgpapiTlsTransportOptions> {
    duplex?: TLSSocket;
    private tunnelingSocket?;
    constructor(options: IgpapiTlsTransportOptions);
    reset(): void;
    connect(): Promise<void>;
}
//# sourceMappingURL=igpapi.tls.transport.d.ts.map