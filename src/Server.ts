import { Global } from "./Global";
import { createServer } from "./Http";
import createSocketServer from "./SocketIo/io";

const port = parseInt(process.env.PORT || '4567', 10);


Global.APP = createServer();
Global.IO = createSocketServer();

Global.APP.listen(port, () => {
    console.log(`Servidor WebSocket iniciado na porta ${port}`);
})
