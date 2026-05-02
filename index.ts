import net from 'net';

const server = net.createServer((socket: net.Socket) => {
    console.log('Cliente conectado');

    socket.on('data', (data: Buffer) => {
        const request = JSON.parse(data.toString());
        console.log('Recebido:', request);

        
    });

    socket.on('end', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(4000, () => {
    console.log('Servidor de processamento rodando na porta 4000');
});