"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgpapiTlsTransport = void 0;
const mqtts_1 = require("mqtts");
const tls_1 = require("tls");
class IgpapiTlsTransport extends mqtts_1.Transport {
    constructor(options) {
        super(options);
        this.reset();
    }
    reset() {
        if (this.duplex && !this.duplex.destroyed)
            this.duplex.destroy();
        this.duplex = undefined;
    }
    async connect() {
        if (this.options.proxy) {
            this.tunnelingSocket = await this.options.proxy.connect();
        }
        return new Promise((resolve, reject) => {
            if (this.duplex) {
                return reject(new mqtts_1.IllegalStateError('TlsTransport still connected - cannot overwrite this.duplex'));
            }
            const tlsSocket = (0, tls_1.connect)({
                host: this.options.host,
                port: this.options.port,
                socket: this.tunnelingSocket,
                rejectUnauthorized: false,
            }, () => {
                tlsSocket.removeAllListeners('error');
                resolve();
            });
            this.duplex = tlsSocket;
            tlsSocket.once('error', e => reject(e));
            tlsSocket.once('close', () => {
                var _a;
                (_a = this.tunnelingSocket) === null || _a === void 0 ? void 0 : _a.end();
            });
        });
    }
}
exports.IgpapiTlsTransport = IgpapiTlsTransport;
//# sourceMappingURL=igpapi.tls.transport.js.map