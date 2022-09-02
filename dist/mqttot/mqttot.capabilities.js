"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCapabilityInteger = exports.MqttCapability = void 0;
var MqttCapability;
(function (MqttCapability) {
    MqttCapability[MqttCapability["AcknowledgedDelivery"] = 0] = "AcknowledgedDelivery";
    MqttCapability[MqttCapability["ProcessingLastActivePresenceInfo"] = 1] = "ProcessingLastActivePresenceInfo";
    MqttCapability[MqttCapability["ExactKeepalive"] = 2] = "ExactKeepalive";
    MqttCapability[MqttCapability["RequiresJsonUnicodeEscapes"] = 3] = "RequiresJsonUnicodeEscapes";
    MqttCapability[MqttCapability["DeltaSentMessageEnabled"] = 4] = "DeltaSentMessageEnabled";
    MqttCapability[MqttCapability["UseEnumTopic"] = 5] = "UseEnumTopic";
    MqttCapability[MqttCapability["SuppressGetDiffInConnect"] = 6] = "SuppressGetDiffInConnect";
    MqttCapability[MqttCapability["UseThriftForInbox"] = 7] = "UseThriftForInbox";
    MqttCapability[MqttCapability["UseSendPingResp"] = 8] = "UseSendPingResp";
    MqttCapability[MqttCapability["RequireReplayProtection"] = 9] = "RequireReplayProtection";
    MqttCapability[MqttCapability["DataSavingMode"] = 10] = "DataSavingMode";
    MqttCapability[MqttCapability["TypingOffWhenSendingMessage"] = 11] = "TypingOffWhenSendingMessage";
    MqttCapability[MqttCapability["PermissionUserAuthCode"] = 12] = "PermissionUserAuthCode";
    MqttCapability[MqttCapability["FbnsExplicitDeliveryAck"] = 13] = "FbnsExplicitDeliveryAck";
    MqttCapability[MqttCapability["IsLargePayloadSupported"] = 14] = "IsLargePayloadSupported";
    MqttCapability[MqttCapability["IsMqttTopicExtensionSupported"] = 15] = "IsMqttTopicExtensionSupported";
})(MqttCapability = exports.MqttCapability || (exports.MqttCapability = {}));
function makeCapabilityInteger(...caps) {
    return caps.reduce((acc, value) => acc | (1 << value), 0);
}
exports.makeCapabilityInteger = makeCapabilityInteger;
//# sourceMappingURL=mqttot.capabilities.js.map