import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ConnectionInfo, ServerToClientEvents } from "./ioTypes";
import { Global } from "../Global";
import { Constants } from "../Constants";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import _ from "lodash";



/**
 * Função para configurar as ações do Socket.IO.
 * @param io O servidor Socket.IO.
 */
export function MakeIoActions (io:Server){
   /**
     * Converte o socket em seu ID de sala correspondente.
     * @param socket O socket para converter.
     * @returns O ID da sala correspondente ao socket.
     */
    const SocketToRoomId = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>)=>{
        return Global.idToRoomMap[socket.id];
    }
    /**
     * Obtém a sala correspondente ao ID da sala.
     * @param roomId O ID da sala.
     * @returns A sala correspondente ao ID.
     */
    const RoomIdToRoom = (roomId: string) =>{
        return Global.rooms[roomId]
    }
    /**
     * Obtém a sala correspondente ao socket.
     * @param socket O socket para obter a sala correspondente.
     * @returns A sala correspondente ao socket.
     */
    const SocketToRoom = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) =>{
        return RoomIdToRoom(SocketToRoomId(socket));
    }
    /**
     * Faz com que o socket se junte a uma sala.
     * @param socket O socket para juntar à sala.
     * @param roomId O ID da sala para se juntar.
     */
    const SocketJoinRoom = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, roomId:string)=>{
        Global.idToRoomMap[socket.id] = roomId;
    }

    /**
     * Obtém ou cria uma nova sala.
     * @param roomId O ID da sala a obter ou criar.
     * @returns A sala correspondente ao ID, criando-a se não existir.
     */
    const getOrMakeNewRoom = (roomId:string)=>{
        if (!Global.rooms[roomId]) {
            Global.rooms[roomId] = _.cloneDeep(Constants.DEFAULT_ROOM_STRUCTURE);
        }
        return Global.rooms[roomId];
    }

    /**
     * Função para remover o socket de uma sala.
     * @param socket O socket a ser removido da sala.
     */
    const exitRoom = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
        const RoomId      = SocketToRoomId(socket);
        const currentRoom = RoomIdToRoom(RoomId);
        // Verificando se o usuário está em uma sala válida
        if (currentRoom) {
            delete currentRoom.connections[socket.id];
            socket.leave(RoomId);
            if (Object.keys(currentRoom.connections).length === 0 && RoomId !== Constants.DEFAULT_ROOM) {
                delete Global.rooms[RoomId];
            }else{
                io.to(RoomId).emit('roomEvent', { connection: currentRoom.connections[socket.id], event: 'leave' });
            }
        }
        Global.idToRoomMap[socket.id] = Constants.DEFAULT_ROOM;
        socket.join(Constants.DEFAULT_ROOM);
        roomGlobalUpdate(RoomId);
    }

    /**
     * Atualiza globalmente a sala.
     * @param roomId O ID da sala a atualizar globalmente.
     */
    const roomGlobalUpdate = (roomId:string) =>{
        let room = RoomIdToRoom(roomId);
        if(!room) return
        io.to(roomId).emit('roomEvent', { ...room, event: 'update' });
    }

    // Função para entrar em uma sala
    const joinRoom = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, data:any, connection:ConnectionInfo) => {

        const emitError = (data:any)=>{
            if(data['onError'] != undefined){
                socket.emit(data['onError'], data)
            }else{
                socket.emit("serverError", data)
            }
        }

        if(data['id'] == undefined){
            emitError(Constants.ERROR_MSG.ROOM_ID_REQUIRED)
            return;
        }

        const room = getOrMakeNewRoom(data.id);
        if(room.password != null){
            if(data['password'] == undefined){
                emitError(Constants.ERROR_MSG.PASSWORD_REQUIRED)
                return
            }

            if(data['password'] != room.password){
                emitError(Constants.ERROR_MSG.PASSWORD_WRONG)
                return
            }
        }

        if(room.settings.limitConnections > -1 && (Object.keys(room.connections).length >= room.settings.limitConnections)){
            emitError(Constants.ERROR_MSG.CONNECTION_LIMIT_EXCEEDED)
            return
        }

        if(room.password == null && data['password'] != undefined){
            room.password = data['password'];
        }

        exitRoom(socket); // Saindo da sala atual
        socket.join(data['id']); // Entrando na nova sala
        Global.idToRoomMap[socket.id] = data['id'];
        room.connections[socket.id] = connection;
        io.to(data['id']).emit('roomEvent', { conection: Global.rooms[data['id']].connections[socket.id], event: 'join' });
        roomGlobalUpdate(data['id']);
    }

    /**
     * Configura a lógica de conexão do socket ao servidor.
     */
    io.on('connection', socket => {
        // Gera informações de conexão para o novo usuário.
        let connection:ConnectionInfo = {
            username:'User' + Math.floor(Math.random() * 1000),
            data: {}
        }

        // Adiciona o ID do socket à sala padrão e cria a conexão na sala.
        Global.addIdToRoom(socket.id, Constants.DEFAULT_ROOM)
        Global.rooms[Constants.DEFAULT_ROOM].connections[socket.id] = connection

        // Lógica para lidar com eventos recebidos pelo socket.
        socket.onAny((eventName, data) => {
            const roomId      = SocketToRoomId(socket);
            const currentRoom = RoomIdToRoom(roomId);

            // Define os comandos disponíveis e suas respectivas ações.
            const commands: Record<string, (data: any) => void> = {
                "command:direct": (data:any)=>{
                    const { to, content } = data;
                    const senderUsername = currentRoom.connections[socket.id].username; // Obtendo o nome de usuário do remetente
                    const recipientSocketId = Object.keys(currentRoom.connections).find(id => currentRoom.connections[id].username === to);
                    if (recipientSocketId) {
                        io.to(recipientSocketId).emit('direct', { from: senderUsername, content });
                    }
                },

                "command:joinRoom": (data:any)=>{
                    joinRoom(socket,data,connection)
                },

                "command:setData": (data:any)=>{
                    connection.data = _.clone(data)
                    roomGlobalUpdate(roomId);
                },

                "command:setUserName": (data:any)=>{
                    connection.username = data
                    roomGlobalUpdate(roomId);
                },

                "command:roomUpdate": (data:any)=>{
                    roomGlobalUpdate(roomId);
                },

                "command:leaveRoom": (data:any)=>{
                    exitRoom(socket);
                }
            }

            if(commands[eventName] != undefined)
                commands[eventName](data);
            else{
                io.to(roomId).emit(eventName, { ...data, from_user: RoomIdToRoom(roomId).connections[socket.id] });
            }
        });

        // Evento disparado quando o cliente se desconecta
        socket.on('disconnect', () => {
            const currentRoomId = SocketToRoomId(socket); // Obtendo a sala atual do usuário
            if (currentRoomId) {
                exitRoom(socket); // Saindo da sala atual
                delete Global.idToRoomMap[socket.id]; // Removendo o usuário do mapeamento de salas
            }
        });

    })
}
