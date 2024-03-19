"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var Global_1 = require("../Global");
var actions_1 = require("./actions");
function createSocketServer() {
    // Criação de um objeto Server do Socket.IO com as interfaces definidas
    var io = Global_1.Global.IO = new socket_io_1.Server(Global_1.Global.APP, {
        maxHttpBufferSize: 8 * 1024 * 1024 * 1024, // Define o limite do tamanho do buffer HTTP para 8GB
        httpCompression: {
            // Engine.IO options
            threshold: 2048, // defaults to 1024
            // Node.js zlib options
            chunkSize: 8 * 1024, // defaults to 16 * 1024
            windowBits: 14, // defaults to 15
            memLevel: 7, // defaults to 8
        },
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }
    });
    (0, actions_1.MakeIoActions)(io);
    return Global_1.Global.IO;
}
exports.default = createSocketServer;
