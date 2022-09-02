export enum MqttCapability {
  AcknowledgedDelivery,
  ProcessingLastActivePresenceInfo,
  ExactKeepalive,
  RequiresJsonUnicodeEscapes,
  DeltaSentMessageEnabled,
  UseEnumTopic,
  SuppressGetDiffInConnect,
  UseThriftForInbox,
  UseSendPingResp,
  RequireReplayProtection,
  DataSavingMode,
  TypingOffWhenSendingMessage,
  PermissionUserAuthCode,
  FbnsExplicitDeliveryAck,
  IsLargePayloadSupported,
  IsMqttTopicExtensionSupported,
}

export function makeCapabilityInteger(...caps: MqttCapability[]): number {
  return caps.reduce((acc, value) => acc | (1 << value), 0);
}
