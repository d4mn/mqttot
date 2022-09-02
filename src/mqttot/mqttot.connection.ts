import { Int64, thriftDescriptors, ThriftPacketDescriptor, thriftWriteFromObject } from '../thrift';

export type MQTToTConnectionData = Partial<{
  clientIdentifier: string;
  willTopic: string;
  willMessage: string;
  clientInfo: MQTToTConnectionClientInfo;
  password: string;
  unknown: number;
  appSpecificInfo: MQTToTConnectionAppSpecificInfo;
}>;
export type MQTToTConnectionAppSpecificInfo = Partial<{
  app_version: string;
  capabilities: string;
  everclear_subscriptions: string;
  'User-Agent': string;
  'Accept-Language': string;
  platform: string;
  ig_mqtt_route: string;
  pubsub_msg_type_blacklist: string;
  auth_cache_enabled: string;
  msys_typing_status_enabled: string;
}>;
export type MQTToTConnectionClientInfo = Partial<{
  // TODO: remove object as polyfill
  userId: Int64;
  userAgent: string;
  clientCapabilities: Int64;
  endpointCapabilities: Int64;
  publishFormat: number;
  noAutomaticForeground: boolean;
  makeUserAvailableInForeground: boolean;
  deviceId: string;
  isInitiallyForeground: boolean;
  networkType: number;
  networkSubtype: number;
  clientMqttSessionId: Int64;
  clientIpAddress: string;
  subscribeTopics: number[];
  clientType: string;
  appId: Int64;
  overrideNectarLogging: boolean;
  connectTokenHash: string;
  regionPreference: string;
  deviceSecret: string;
  clientStack: number;
  fbnsConnectionKey: number;
  fbnsConnectionSecret: string;
  fbnsDeviceId: string;
  fbnsDeviceSecret: string;
  fbUserId: Int64;
}>;

export class MQTToTConnection {
  public fbnsConnectionData: MQTToTConnectionData;

  public static thriftConfig: ThriftPacketDescriptor[] = [
    thriftDescriptors.binary('clientIdentifier', 1),
    thriftDescriptors.binary('willTopic', 2),
    thriftDescriptors.binary('willMessage', 3),
    thriftDescriptors.struct('clientInfo', 4, [
      thriftDescriptors.int64('userId', 1),
      thriftDescriptors.binary('userAgent', 2),
      thriftDescriptors.int64('clientCapabilities', 3),
      thriftDescriptors.int64('endpointCapabilities', 4),
      thriftDescriptors.int32('publishFormat', 5),
      thriftDescriptors.boolean('noAutomaticForeground', 6),
      thriftDescriptors.boolean('makeUserAvailableInForeground', 7),
      thriftDescriptors.binary('deviceId', 8),
      thriftDescriptors.boolean('isInitiallyForeground', 9),
      thriftDescriptors.int32('networkType', 10),
      thriftDescriptors.int32('networkSubtype', 11),
      thriftDescriptors.int64('clientMqttSessionId', 12),
      thriftDescriptors.binary('clientIpAddress', 13),
      thriftDescriptors.listOfInt32('subscribeTopics', 14),
      thriftDescriptors.binary('clientType', 15),
      thriftDescriptors.int64('appId', 16),
      thriftDescriptors.boolean('overrideNectarLogging', 17),
      thriftDescriptors.binary('connectTokenHash', 18),
      thriftDescriptors.binary('regionPreference', 19),
      thriftDescriptors.binary('deviceSecret', 20),
      thriftDescriptors.byte('clientStack', 21),
      thriftDescriptors.int64('fbnsConnectionKey', 22),
      thriftDescriptors.binary('fbnsConnectionSecret', 23),
      thriftDescriptors.binary('fbnsDeviceId', 24),
      thriftDescriptors.binary('fbnsDeviceSecret', 25),
      thriftDescriptors.int64('fbUserId', 26),
    ]),
    thriftDescriptors.binary('password', 5),
    // polyfill
    thriftDescriptors.int16('unknown', 5),
    thriftDescriptors.listOfBinary('getDiffsRequests', 6),
    thriftDescriptors.binary('zeroRatingTokenHash', 9),
    thriftDescriptors.mapBinaryBinary('appSpecificInfo', 10),
  ];

  public constructor(connectionData: MQTToTConnectionData) {
    this.fbnsConnectionData = connectionData;
  }

  public toThrift(): Buffer {
    return thriftWriteFromObject(this.fbnsConnectionData, MQTToTConnection.thriftConfig);
  }

  public toString(): string {
    return this.toThrift().toString();
  }
}
