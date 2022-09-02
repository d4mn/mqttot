import debug from 'debug';
import {
  ConnectRequestOptions,
  DefaultPacketReadMap,
  DefaultPacketReadResultMap,
  DefaultPacketWriteMap,
  DefaultPacketWriteOptions,
  isConnAck,
  MqttClient,
  MqttsReconnectStrategy,
  PacketFlowFunc,
  PacketType,
} from 'mqtts';
import { MQTToTConnectResponsePacket } from './mqttot.connect.response.packet';
import { MQTToTConnectPacketOptions, writeConnectRequestPacket } from './mqttot.connect.request.packet';
import { MQTToTConnectionFailedError, MQTToTEmptyPacketError } from '../errors';
// Built-it URL incorrectly parses socks url
import URL from 'url-parse';
import { MqttHttpProxy, MqttSocksProxy } from '../proxies';
import { IgpapiTlsTransport } from '../transports';

export type MQTToTReadMap = Omit<DefaultPacketReadResultMap, PacketType.ConnAck> & {
  [PacketType.ConnAck]: MQTToTConnectResponsePacket;
};
export type MQTToTWriteMap = Omit<DefaultPacketWriteOptions, PacketType.Connect> & {
  [PacketType.Connect]: MQTToTConnectPacketOptions;
};

export class MQTToTClient extends MqttClient<MQTToTReadMap, MQTToTWriteMap> {
  protected connectPayloadProvider: () => Promise<Buffer>;
  protected connectPayload?: Buffer;
  protected requirePayload: boolean;

  private mqttotDebug: (msg: string) => void;

  public constructor(options: {
    url: string;
    payloadProvider: () => Promise<Buffer>;
    autoReconnect: MqttsReconnectStrategy;
    requirePayload: boolean;
    proxyUrl?: string;
  }) {
    super({
      autoReconnect: options.autoReconnect,
      readMap: {
        ...DefaultPacketReadMap,
        [PacketType.ConnAck]: MQTToTConnectResponsePacket.fromStream,
      },
      writeMap: {
        ...DefaultPacketWriteMap,
        [PacketType.Connect]: writeConnectRequestPacket,
      },
      transport: new IgpapiTlsTransport({
        host: options.url,
        port: 443,
        proxy: MQTToTClient.getProxy(options.url, options.proxyUrl),
      }),
    });
    this.mqttotDebug = msg => debug('ig:mqttot')(`${options.url}: ${msg}`);
    this.connectPayloadProvider = options.payloadProvider;
    this.mqttotDebug(`Creating client`);
    this.registerListeners();
    this.requirePayload = options.requirePayload;
  }

  private static getProxy(destinationUrl: string, proxyUrl?: string) {
    if (!proxyUrl) {
      return void 0;
    }
    const proxyURL = new URL(proxyUrl);

    if (proxyUrl.startsWith('socks')) {
      return new MqttSocksProxy({
        proxy: {
          type: (Number(proxyURL.protocol.substr(5, 1)) || 5) as 4 | 5,
          host: proxyURL.hostname,
          port: Number(proxyURL.port),
          userId: proxyURL.username,
          password: proxyURL.password,
        },
        destination: {
          host: destinationUrl,
          port: 443,
        },
      });
    }
    if (proxyURL.protocol === 'http:') {
      return new MqttHttpProxy(proxyUrl, destinationUrl, 443);
    }
    throw new Error(`MQTT: Unsupported proxy protocol "${proxyURL.protocol}"`);
  }

  async connect(options?: ConnectRequestOptions): Promise<any> {
    this.connectPayload = await this.connectPayloadProvider();
    return super.connect(options);
  }

  protected registerListeners() {
    const printErrorOrWarning = (type: string) => (e: Error | string) => {
      if (typeof e === 'string') {
        this.mqttotDebug(`${type}: ${e}`);
      } else {
        this.mqttotDebug(`${type}: ${e} ${e.message?.toString()}\n\tStack:\n${e.stack?.split('\n')?.slice(0, 3)}`);
      }
    };
    this.on('warning', printErrorOrWarning('Warning'));
    this.on('error', printErrorOrWarning('Error'));
    this.on('disconnect', reason => this.mqttotDebug(`Disconnected: reason ${JSON.stringify(reason)}`));
  }

  protected getConnectFlow(): PacketFlowFunc<MQTToTReadMap, MQTToTWriteMap, any> {
    if (!this.connectPayload) {
      throw new Error('connectPayload is not yet ready. Probably you should call .connect() first ');
    }
    return mqttotConnectFlow(this.connectPayload, this.requirePayload);
  }
}

export function mqttotConnectFlow(
  payload: Buffer,
  requirePayload: boolean,
): PacketFlowFunc<MQTToTReadMap, MQTToTWriteMap, MQTToTConnectResponsePacket> {
  return (success, error) => ({
    start: () => ({
      type: PacketType.Connect,
      options: {
        payload,
        keepAlive: 60,
      },
    }),
    accept: isConnAck,
    next: (packet: MQTToTConnectResponsePacket) => {
      if (packet.isSuccess) {
        if (packet.payload?.length || !requirePayload) success(packet);
        else error(new MQTToTEmptyPacketError(`CONNACK: no payload (payloadExpected): ${packet.payload}`));
      } else
        error(
          new MQTToTConnectionFailedError(`CONNACK returnCode: ${packet.returnCode} errorName: ${packet.errorName}`),
        );
    },
  });
}
