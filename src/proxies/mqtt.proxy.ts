import net from 'net';

export interface MqttProxy {
  connect(): Promise<net.Socket>;
}
