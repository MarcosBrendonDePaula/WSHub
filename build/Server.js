"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var Http_1 = require("./Http");
var io_1 = __importDefault(require("./SocketIo/io"));
var port = parseInt(process.env.PORT || '4567', 10);
Global_1.Global.APP = (0, Http_1.createServer)();
Global_1.Global.IO = (0, io_1.default)();
Global_1.Global.APP.listen(port, function () {
    console.log("Servidor WebSocket iniciado na porta ".concat(port));
});
