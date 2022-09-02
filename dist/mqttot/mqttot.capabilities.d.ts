export declare enum MqttCapability {
    AcknowledgedDelivery = 0,
    ProcessingLastActivePresenceInfo = 1,
    ExactKeepalive = 2,
    RequiresJsonUnicodeEscapes = 3,
    DeltaSentMessageEnabled = 4,
    UseEnumTopic = 5,
    SuppressGetDiffInConnect = 6,
    UseThriftForInbox = 7,
    UseSendPingResp = 8,
    RequireReplayProtection = 9,
    DataSavingMode = 10,
    TypingOffWhenSendingMessage = 11,
    PermissionUserAuthCode = 12,
    FbnsExplicitDeliveryAck = 13,
    IsLargePayloadSupported = 14,
    IsMqttTopicExtensionSupported = 15
}
export declare function makeCapabilityInteger(...caps: MqttCapability[]): number;
//# sourceMappingURL=mqttot.capabilities.d.ts.map