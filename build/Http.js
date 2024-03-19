"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
var express_1 = __importDefault(require("express"));
var http = __importStar(require("http"));
var Global_1 = require("./Global");
// Função para obter informações do servidor WebSocket
var getServerInfo = function () {
    var numSockets = Global_1.Global.IO.engine.clientsCount;
    var numRooms = Object.keys(Global_1.Global.rooms).length;
    return {
        numSockets: numSockets,
        numRooms: numRooms,
        rooms: Global_1.Global.rooms
    };
};
function createServer() {
    var app = (0, express_1.default)();
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    app.get('/', function (req, res) {
        res.status(200).send('WebSocket Server - Conecte-se via WebSocket!');
    });
    app.get('/info', function (req, res) {
        var serverInfo = getServerInfo();
        res.status(200).json(serverInfo);
    });
    app.use(function (req, res) {
        res.status(404).send('Página não encontrada');
    });
    var server = http.createServer(app);
    return server;
}
exports.createServer = createServer;
