"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttHttpProxy = void 0;
const net_1 = require("net");
class MqttHttpProxy {
    constructor(proxyUrl, hostname, port) {
        this.proxyUrl = proxyUrl;
        this.hostname = hostname;
        this.port = port;
    }
    connect() {
        return new Promise((resolve, reject) => {
            const proxyURL = new URL(this.proxyUrl);
            const socket = (0, net_1.connect)({
                port: Number(proxyURL.port),
                host: proxyURL.hostname,
            }, () => {
                const host = `${this.hostname}:${this.port}`;
                socket.write(`CONNECT ${host} HTTP/1.1\r\n`);
                socket.write(`Host: ${host}\r\n`);
                socket.write(`Connection: Keep-Alive\r\n`);
                if (proxyURL.username !== '' || proxyURL.password !== '') {
                    const auth = Buffer.from(`${proxyURL.username}:${proxyURL.password}`).toString('base64');
                    socket.write(`Proxy-Authorization: Basic ${auth}\r\n`);
                }
                socket.write('\r\n');
            });
            socket.once('error', e => {
                socket.removeAllListeners();
                reject(e);
            });
            socket.once('data', data => {
                socket.removeAllListeners();
                if (data.toString().split(' ')[1] === '200') {
                    resolve(socket);
                }
                else {
                    reject(new Error(`Wrong response from proxy server: "${data.toString()}"`));
                }
            });
        });
    }
}
exports.MqttHttpProxy = MqttHttpProxy;
//# sourceMappingURL=mqtt.http.proxy.js.map