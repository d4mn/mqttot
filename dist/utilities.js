"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryUnzipAsync = exports.unzipAsync = exports.compressDeflate = void 0;
const zlib_1 = require("zlib");
const util_1 = require("util");
async function compressDeflate(data) {
    return new Promise((resolve, reject) => (0, zlib_1.deflate)(data, { level: 9 }, (error, result) => (error ? reject(error) : resolve(result))));
}
exports.compressDeflate = compressDeflate;
exports.unzipAsync = (0, util_1.promisify)(zlib_1.unzip);
async function tryUnzipAsync(data) {
    try {
        if (data.readInt8(0) !== 0x78)
            return data;
        return (0, exports.unzipAsync)(data);
    }
    catch (e) {
        return data;
    }
}
exports.tryUnzipAsync = tryUnzipAsync;
//# sourceMappingURL=utilities.js.map