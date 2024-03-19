"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
var Constants_1 = require("./Constants");
var lodash_1 = __importDefault(require("lodash"));
var Global = /** @class */ (function () {
    function Global() {
    }
    Global.addIdToRoom = function (id, roomName) {
        this.idToRoomMap[id] = roomName;
    };
    Global.getRoomByUserId = function (id) {
        return this.idToRoomMap[id];
    };
    Global.changeRoom = function (socketId, newRoomName) {
        var currentRoom = this.getRoomByUserId(socketId);
        if (currentRoom) {
            delete this.rooms[currentRoom].connections[socketId];
        }
        this.idToRoomMap[socketId] = newRoomName;
        this.rooms[newRoomName].connections[socketId] = {
            username: socketId,
            data: {} // Você pode adicionar dados específicos se necessário
        };
    };
    Global.rooms = (_a = {},
        _a[Constants_1.Constants.DEFAULT_ROOM] = lodash_1.default.cloneDeep(Constants_1.Constants.DEFAULT_ROOM_STRUCTURE),
        _a);
    Global.idToRoomMap = {};
    return Global;
}());
exports.Global = Global;
