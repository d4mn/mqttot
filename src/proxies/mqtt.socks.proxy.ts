import { SocksClient, SocksClientOptions } from 'socks';
import { MqttProxy } from './mqtt.proxy';

export class MqttSocksProxy implements MqttProxy {
  constructor(private options: Omit<SocksClientOptions, 'command'>) {}
  async connect() {
    const establishedEvent = await SocksClient.createConnection({
      ...this.options,
      command: 'connect',
    });
    return establishedEvent.socket;
  }
}
