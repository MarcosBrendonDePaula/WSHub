import express, { Request, Response } from 'express';
import * as http from 'http';
import { URL } from 'url';
import { Global } from './Global';

// Função para obter informações do servidor WebSocket
const getServerInfo = () => {

    const numSockets = Global.IO.engine.clientsCount;
    const numRooms = Object.keys(Global.rooms).length;
    return {
        numSockets,
        numRooms,
        rooms: Global.rooms
    };
};


export function createServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> {
    const app = express();

    app.use((req: Request, res: Response, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    app.get('/', (req: Request, res: Response) => {
        res.status(200).send('WebSocket Server - Conecte-se via WebSocket!');
    });

    app.get('/info', (req: Request, res: Response) => {
        const serverInfo = getServerInfo();
        res.status(200).json(serverInfo);
    });

    app.use((req: Request, res: Response) => {
        res.status(404).send('Página não encontrada');
    });

    const server = http.createServer(app);
    return server;
}
