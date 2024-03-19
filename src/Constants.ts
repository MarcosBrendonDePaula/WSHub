// Arquivo constants.ts
import { Room, ConnectionInfo } from "./SocketIo/ioTypes";
export class Constants {
    static DEFAULT_ROOM = "DEFAULT";

    static DEFAULT_ROOM_STRUCTURE : Room = {
        password: null,
        settings: {
            limitConnections: -1,
            maxPacketSize: -1,
        },
        connections : {},
        name: ""
    };

    static DEFAULT_CONNECTION_DATA = {};

    static ERROR_MSG = {
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
}
