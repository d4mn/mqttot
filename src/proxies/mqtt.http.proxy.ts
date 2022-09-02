import { connect, Socket } from 'net';
import { MqttProxy } from './mqtt.proxy';

export class MqttHttpProxy implements MqttProxy {
  constructor(private proxyUrl: string, private hostname: string, private port: number) {}
  connect() {
    return new Promise<Socket>((resolve, reject) => {
      const proxyURL = new URL(this.proxyUrl);
      const socket = connect(
        {
          port: Number(proxyURL.port),
          host: proxyURL.hostname,
        },
        () => {
          const host = `${this.hostname}:${this.port}`;
          socket.write(`CONNECT ${host} HTTP/1.1\r\n`);
          socket.write(`Host: ${host}\r\n`);
          socket.write(`Connection: Keep-Alive\r\n`);
          if (proxyURL.username !== '' || proxyURL.password !== '') {
            const auth = Buffer.from(`${proxyURL.username}:${proxyURL.password}`).toString('base64');
            socket.write(`Proxy-Authorization: Basic ${auth}\r\n`);
          }
          socket.write('\r\n');
        },
      );
      socket.once('error', e => {
        socket.removeAllListeners();
        reject(e);
      });
      socket.once('data', data => {
        socket.removeAllListeners();
        if (data.toString().split(' ')[1] === '200') {
          resolve(socket);
        } else {
          reject(new Error(`Wrong response from proxy server: "${data.toString()}"`));
        }
      });
    });
  }
}
