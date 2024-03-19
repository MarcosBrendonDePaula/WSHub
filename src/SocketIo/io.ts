import { Server, Socket } from "socket.io";
import { Global } from "../Global";
import { MakeIoActions } from "./actions";


function createSocketServer(): Server {
    // Criação de um objeto Server do Socket.IO com as interfaces definidas
    const io = Global.IO = new Server(Global.APP, {
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

    MakeIoActions(io);

    return Global.IO;
}

export default createSocketServer;
