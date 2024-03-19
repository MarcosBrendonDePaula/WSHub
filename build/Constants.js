"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.DEFAULT_ROOM = "DEFAULT";
    Constants.DEFAULT_ROOM_STRUCTURE = {
        password: null,
        settings: {
            limitConnections: -1,
            maxPacketSize: -1,
        },
        connections: {},
        name: ""
    };
    Constants.DEFAULT_CONNECTION_DATA = {};
    Constants.ERROR_MSG = {
        ROOM_ID_REQUIRED: {
            CODE: 400,
            MSG: "Room ID is required"
        },
        CONNECTION_LIMIT_EXCEEDED: {
            CODE: 429,
            MSG: "Connection limit for this room has been reached"
        },
        PASSWORD_REQUIRED: {
            CODE: 401,
            MSG: "The room requires a password"
        },
        PASSWORD_WRONG: {
            CODE: 401,
            MSG: "Password entered does not match the room password"
        }
    };
    return Constants;
}());
exports.Constants = Constants;
