import { IllegalStateError, Transport } from 'mqtts';
import { connect, TLSSocket } from 'tls';
import { Socket } from 'net';
import { MqttProxy } from '../proxies/mqtt.proxy';

export interface IgpapiTlsTransportOptions {
  host: string;
  port: number;
  proxy?: MqttProxy;
}

export class IgpapiTlsTransport extends Transport<IgpapiTlsTransportOptions> {
  public duplex?: TLSSocket;
  private tunnelingSocket?: Socket;

  constructor(options: IgpapiTlsTransportOptions) {
    super(options);
    this.reset();
  }

  reset() {
    if (this.duplex && !this.duplex.destroyed) this.duplex.destroy();
    this.duplex = undefined;
  }

  async connect(): Promise<void> {
    if (this.options.proxy) {
      this.tunnelingSocket = await this.options.proxy.connect();
    }

    return new Promise((resolve, reject) => {
      if (this.duplex) {
        // this.duplex has to be undefined
        return reject(new IllegalStateError('TlsTransport still connected - cannot overwrite this.duplex'));
      }

      const tlsSocket = connect(
        {
          host: this.options.host,
          port: this.options.port,
          socket: this.tunnelingSocket,
          rejectUnauthorized: false,
        },
        () => {
          tlsSocket.removeAllListeners('error');
          resolve();
        },
      );
      this.duplex = tlsSocket;
      tlsSocket.once('error', e => reject(e));
      tlsSocket.once('close', () => {
        this.tunnelingSocket?.end();
      });
    });
  }
}
