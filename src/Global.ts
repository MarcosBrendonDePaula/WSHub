import { Room } from "./SocketIo/ioTypes";
import { Constants } from "./Constants";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./SocketIo/ioTypes";
import { Server } from "socket.io";
import * as http from 'http';
import _ from 'lodash';
export class Global {

    static APP:http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    static IO:Server;

    static rooms: { [key: string]: Room } = {
        [Constants.DEFAULT_ROOM]: _.cloneDeep(Constants.DEFAULT_ROOM_STRUCTURE)
    };

    static idToRoomMap: { [key: string]: string } = {};

    static addIdToRoom(id: string, roomName: string): void {
        this.idToRoomMap[id] = roomName;
    }

    static getRoomByUserId(id: string): string | undefined {
        return this.idToRoomMap[id];
    }

    static changeRoom(socketId: string, newRoomName: string): void {
        const currentRoom = this.getRoomByUserId(socketId);
        if (currentRoom) {
            delete this.rooms[currentRoom].connections[socketId];
        }
        this.idToRoomMap[socketId] = newRoomName;
        this.rooms[newRoomName].connections[socketId] = {
            username: socketId,
            data: {} // Você pode adicionar dados específicos se necessário
        };
    }
}
