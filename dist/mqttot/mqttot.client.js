"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttotConnectFlow = exports.MQTToTClient = void 0;
const debug_1 = __importDefault(require("debug"));
const mqtts_1 = require("mqtts");
const mqttot_connect_response_packet_1 = require("./mqttot.connect.response.packet");
const mqttot_connect_request_packet_1 = require("./mqttot.connect.request.packet");
const errors_1 = require("../errors");
const url_parse_1 = __importDefault(require("url-parse"));
const proxies_1 = require("../proxies");
const transports_1 = require("../transports");
class MQTToTClient extends mqtts_1.MqttClient {
    constructor(options) {
        super({
            autoReconnect: options.autoReconnect,
            readMap: {
                ...mqtts_1.DefaultPacketReadMap,
                [mqtts_1.PacketType.ConnAck]: mqttot_connect_response_packet_1.MQTToTConnectResponsePacket.fromStream,
            },
            writeMap: {
                ...mqtts_1.DefaultPacketWriteMap,
                [mqtts_1.PacketType.Connect]: mqttot_connect_request_packet_1.writeConnectRequestPacket,
            },
            transport: new transports_1.IgpapiTlsTransport({
                host: options.url,
                port: 443,
                proxy: MQTToTClient.getProxy(options.url, options.proxyUrl),
            }),
        });
        this.mqttotDebug = msg => (0, debug_1.default)('ig:mqttot')(`${options.url}: ${msg}`);
        this.connectPayloadProvider = options.payloadProvider;
        this.mqttotDebug(`Creating client`);
        this.registerListeners();
        this.requirePayload = options.requirePayload;
    }
    static getProxy(destinationUrl, proxyUrl) {
        if (!proxyUrl) {
            return void 0;
        }
        const proxyURL = new url_parse_1.default(proxyUrl);
        if (proxyUrl.startsWith('socks')) {
            return new proxies_1.MqttSocksProxy({
                proxy: {
                    type: (Number(proxyURL.protocol.substr(5, 1)) || 5),
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
            return new proxies_1.MqttHttpProxy(proxyUrl, destinationUrl, 443);
        }
        throw new Error(`MQTT: Unsupported proxy protocol "${proxyURL.protocol}"`);
    }
    async connect(options) {
        this.connectPayload = await this.connectPayloadProvider();
        return super.connect(options);
    }
    registerListeners() {
        const printErrorOrWarning = (type) => (e) => {
            var _a, _b, _c;
            if (typeof e === 'string') {
                this.mqttotDebug(`${type}: ${e}`);
            }
            else {
                this.mqttotDebug(`${type}: ${e} ${(_a = e.message) === null || _a === void 0 ? void 0 : _a.toString()}\n\tStack:\n${(_c = (_b = e.stack) === null || _b === void 0 ? void 0 : _b.split('\n')) === null || _c === void 0 ? void 0 : _c.slice(0, 3)}`);
            }
        };
        this.on('warning', printErrorOrWarning('Warning'));
        this.on('error', printErrorOrWarning('Error'));
        this.on('disconnect', reason => this.mqttotDebug(`Disconnected: reason ${JSON.stringify(reason)}`));
    }
    getConnectFlow() {
        if (!this.connectPayload) {
            throw new Error('connectPayload is not yet ready. Probably you should call .connect() first ');
        }
        return mqttotConnectFlow(this.connectPayload, this.requirePayload);
    }
}
exports.MQTToTClient = MQTToTClient;
function mqttotConnectFlow(payload, requirePayload) {
    return (success, error) => ({
        start: () => ({
            type: mqtts_1.PacketType.Connect,
            options: {
                payload,
                keepAlive: 60,
            },
        }),
        accept: mqtts_1.isConnAck,
        next: (packet) => {
            var _a;
            if (packet.isSuccess) {
                if (((_a = packet.payload) === null || _a === void 0 ? void 0 : _a.length) || !requirePayload)
                    success(packet);
                else
                    error(new errors_1.MQTToTEmptyPacketError(`CONNACK: no payload (payloadExpected): ${packet.payload}`));
            }
            else
                error(new errors_1.MQTToTConnectionFailedError(`CONNACK returnCode: ${packet.returnCode} errorName: ${packet.errorName}`));
        },
    });
}
exports.mqttotConnectFlow = mqttotConnectFlow;
//# sourceMappingURL=mqttot.client.js.map