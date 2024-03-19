"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeIoActions = void 0;
var Global_1 = require("../Global");
var Constants_1 = require("../Constants");
var lodash_1 = __importDefault(require("lodash"));
/**
 * Função para configurar as ações do Socket.IO.
 * @param io O servidor Socket.IO.
 */
function MakeIoActions(io) {
    /**
      * Converte o socket em seu ID de sala correspondente.
      * @param socket O socket para converter.
      * @returns O ID da sala correspondente ao socket.
      */
    var SocketToRoomId = function (socket) {
        return Global_1.Global.idToRoomMap[socket.id];
    };
    /**
     * Obtém a sala correspondente ao ID da sala.
     * @param roomId O ID da sala.
     * @returns A sala correspondente ao ID.
     */
    var RoomIdToRoom = function (roomId) {
        return Global_1.Global.rooms[roomId];
    };
    /**
     * Obtém a sala correspondente ao socket.
     * @param socket O socket para obter a sala correspondente.
     * @returns A sala correspondente ao socket.
     */
    var SocketToRoom = function (socket) {
        return RoomIdToRoom(SocketToRoomId(socket));
    };
    /**
     * Faz com que o socket se junte a uma sala.
     * @param socket O socket para juntar à sala.
     * @param roomId O ID da sala para se juntar.
     */
    var SocketJoinRoom = function (socket, roomId) {
        Global_1.Global.idToRoomMap[socket.id] = roomId;
    };
    /**
     * Obtém ou cria uma nova sala.
     * @param roomId O ID da sala a obter ou criar.
     * @returns A sala correspondente ao ID, criando-a se não existir.
     */
    var getOrMakeNewRoom = function (roomId) {
        if (!Global_1.Global.rooms[roomId]) {
            Global_1.Global.rooms[roomId] = lodash_1.default.cloneDeep(Constants_1.Constants.DEFAULT_ROOM_STRUCTURE);
        }
        return Global_1.Global.rooms[roomId];
    };
    /**
     * Função para remover o socket de uma sala.
     * @param socket O socket a ser removido da sala.
     */
    var exitRoom = function (socket) {
        var RoomId = SocketToRoomId(socket);
        var currentRoom = RoomIdToRoom(RoomId);
        // Verificando se o usuário está em uma sala válida
        if (currentRoom) {
            delete currentRoom.connections[socket.id];
            socket.leave(RoomId);
            if (Object.keys(currentRoom.connections).length === 0 && RoomId !== Constants_1.Constants.DEFAULT_ROOM) {
                delete Global_1.Global.rooms[RoomId];
            }
            else {
                io.to(RoomId).emit('roomEvent', { connection: currentRoom.connections[socket.id], event: 'leave' });
            }
        }
        Global_1.Global.idToRoomMap[socket.id] = Constants_1.Constants.DEFAULT_ROOM;
        socket.join(Constants_1.Constants.DEFAULT_ROOM);
        roomGlobalUpdate(RoomId);
    };
    /**
     * Atualiza globalmente a sala.
     * @param roomId O ID da sala a atualizar globalmente.
     */
    var roomGlobalUpdate = function (roomId) {
        var room = RoomIdToRoom(roomId);
        if (!room)
            return;
        io.to(roomId).emit('roomEvent', __assign(__assign({}, room), { event: 'update' }));
    };
    // Função para entrar em uma sala
    var joinRoom = function (socket, data, connection) {
        var emitError = function (data) {
            if (data['onError'] != undefined) {
                socket.emit(data['onError'], data);
            }
            else {
                socket.emit("serverError", data);
            }
        };
        if (data['id'] == undefined) {
            emitError(Constants_1.Constants.ERROR_MSG.ROOM_ID_REQUIRED);
            return;
        }
        var room = getOrMakeNewRoom(data.id);
        if (room.password != null) {
            if (data['password'] == undefined) {
                emitError(Constants_1.Constants.ERROR_MSG.PASSWORD_REQUIRED);
                return;
            }
            if (data['password'] != room.password) {
                emitError(Constants_1.Constants.ERROR_MSG.PASSWORD_WRONG);
                return;
            }
        }
        if (room.settings.limitConnections > -1 && (Object.keys(room.connections).length >= room.settings.limitConnections)) {
            emitError(Constants_1.Constants.ERROR_MSG.CONNECTION_LIMIT_EXCEEDED);
            return;
        }
        if (room.password == null && data['password'] != undefined) {
            room.password = data['password'];
        }
        exitRoom(socket); // Saindo da sala atual
        socket.join(data['id']); // Entrando na nova sala
        Global_1.Global.idToRoomMap[socket.id] = data['id'];
        room.connections[socket.id] = connection;
        io.to(data['id']).emit('roomEvent', { conection: Global_1.Global.rooms[data['id']].connections[socket.id], event: 'join' });
        roomGlobalUpdate(data['id']);
    };
    /**
     * Configura a lógica de conexão do socket ao servidor.
     */
    io.on('connection', function (socket) {
        // Gera informações de conexão para o novo usuário.
        var connection = {
            username: 'User' + Math.floor(Math.random() * 1000),
            data: {}
        };
        // Adiciona o ID do socket à sala padrão e cria a conexão na sala.
        Global_1.Global.addIdToRoom(socket.id, Constants_1.Constants.DEFAULT_ROOM);
        Global_1.Global.rooms[Constants_1.Constants.DEFAULT_ROOM].connections[socket.id] = connection;
        // Lógica para lidar com eventos recebidos pelo socket.
        socket.onAny(function (eventName, data) {
            var roomId = SocketToRoomId(socket);
            var currentRoom = RoomIdToRoom(roomId);
            // Define os comandos disponíveis e suas respectivas ações.
            var commands = {
                "command:direct": function (data) {
                    var to = data.to, content = data.content;
                    var senderUsername = currentRoom.connections[socket.id].username; // Obtendo o nome de usuário do remetente
                    var recipientSocketId = Object.keys(currentRoom.connections).find(function (id) { return currentRoom.connections[id].username === to; });
                    if (recipientSocketId) {
                        io.to(recipientSocketId).emit('direct', { from: senderUsername, content: content });
                    }
                },
                "command:joinRoom": function (data) {
                    joinRoom(socket, data, connection);
                },
                "command:setData": function (data) {
                    connection.data = lodash_1.default.clone(data);
                    roomGlobalUpdate(roomId);
                },
                "command:setUserName": function (data) {
                    connection.username = data;
                    roomGlobalUpdate(roomId);
                },
                "command:roomUpdate": function (data) {
                    roomGlobalUpdate(roomId);
                },
                "command:leaveRoom": function (data) {
                    exitRoom(socket);
                }
            };
            if (commands[eventName] != undefined)
                commands[eventName](data);
            else {
                io.to(roomId).emit(eventName, __assign(__assign({}, data), { from_user: RoomIdToRoom(roomId).connections[socket.id] }));
            }
        });
        // Evento disparado quando o cliente se desconecta
        socket.on('disconnect', function () {
            var currentRoomId = SocketToRoomId(socket); // Obtendo a sala atual do usuário
            if (currentRoomId) {
                exitRoom(socket); // Saindo da sala atual
                delete Global_1.Global.idToRoomMap[socket.id]; // Removendo o usuário do mapeamento de salas
            }
        });
    });
}
exports.MakeIoActions = MakeIoActions;
