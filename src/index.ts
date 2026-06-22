import dgram from 'dgram';
import { Routes } from './routes/Routes';
import { ResponseParser } from './infra/parser/ResponseParser';
import { ErrorHandler } from './infra/middleware/Error';

const routes = new Routes();
const server = dgram.createSocket('udp4');

server.on('message', (msg: Buffer, rinfo: dgram.RemoteInfo) => {
    try{
        const request = ResponseParser.deserialize(msg.toString());

        if (!request) {
            throw new Error("Requisição mal formatada " + msg.toString());
        }

        routes.handle(request, server, rinfo);
        
    } catch (error) {
        return ErrorHandler.handle("Erro ao processar requisição", server, rinfo);
    }
});

server.on('listening', ()=>{
    const adress = server.address();
    console.log(`Servidor de processamento rodando na porta ${adress.port}`)
});

server.bind(4500);