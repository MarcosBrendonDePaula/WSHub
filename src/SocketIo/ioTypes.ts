// Interfaces para os eventos do cliente para servidor
export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

// Interfaces para os eventos do servidor para cliente
export interface ClientToServerEvents {
    hello: () => void;
}

// Interfaces para eventos internos do servidor
export interface InterServerEvents {
    ping: () => void;
}

// Interface para os dados que podem ser transmitidos pelos sockets
export interface SocketData {
    name: string;
    age: number;
}

// Arquivo global.ts
export interface RoomSettings {
    limitConnections: number;
    maxPacketSize: number; // -1 para ilimitado
}

export interface ConnectionInfo {
    username: string;
    data: any; // Tipo para outras informações opcionais
}

export interface Room {
    name: string;
    password: string | null;
    settings: RoomSettings;
    connections: { [key: string]: ConnectionInfo }; // Chave: username, Valor: ConnectionInfo
}
