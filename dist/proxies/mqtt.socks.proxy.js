"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttSocksProxy = void 0;
const socks_1 = require("socks");
class MqttSocksProxy {
    constructor(options) {
        this.options = options;
    }
    async connect() {
        const establishedEvent = await socks_1.SocksClient.createConnection({
            ...this.options,
            command: 'connect',
        });
        return establishedEvent.socket;
    }
}
exports.MqttSocksProxy = MqttSocksProxy;
//# sourceMappingURL=mqtt.socks.proxy.js.map